import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { UserLocationRepository } from "@/repositories/prisma/Iprisma/user-locations-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateOrderUseCaseRequest {
  user_id: string;
  store_id: string;
  latitude?: number;
  longitude?: number;
  useCashback?: boolean;
  items: {
    product_id: string;
    quantity: number;
    subtotal: number;
  }[];
}

interface CreateOrderUseCaseResponse {
  id: string;
  qrCodeUrl: string | null;
  total_amount: Decimal | number;
  discountApplied: Decimal | number;
  status: string;
}

export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userLocationRepository: UserLocationRepository,
    private productsRepository: ProductsRepository,
    private cashbacksRepository: CashbacksRepository
  ) {}

  async execute({
    user_id,
    store_id,
    latitude,
    longitude,
    items,
    useCashback = false,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (!items || items.length === 0) {
      throw new Error("O pedido deve conter pelo menos um item");
    }

    // 🔹 1. Buscar preços reais e calcular subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await this.productsRepository.findByIdProduct(
        item.product_id
      );
      if (!product)
        throw new Error(`Produto com ID ${item.product_id} não encontrado.`);
      if (item.quantity <= 0)
        throw new Error(`Quantidade inválida para o produto ${product.name}`);

      const realSubtotal = product.price.toNumber() * item.quantity;
      subtotal += realSubtotal;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        subtotal: realSubtotal,
      });
    }

    // 🔹 2. Calcular desconto corretamente
    let effectiveDiscount = 0;
    if (useCashback) {
      const balance = await this.cashbacksRepository.getBalance(user_id);
      effectiveDiscount = Math.min(balance, subtotal);
    }

    const calculatedTotal = subtotal - effectiveDiscount;

    // 🔹 3. Bloquear cashback se já houver pedido pendente
    const hasPendingOrder = await this.ordersRepository.existsPendingOrder(
      user_id
    );
    if (useCashback && hasPendingOrder) {
      throw new Error(
        "Você já possui um pedido pendente. Aguarde a validação antes de usar seu cashback novamente."
      );
    }

    // 🔹 4. Criar pedido
    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: new Decimal(calculatedTotal),
      discountApplied: effectiveDiscount,
      status: "PENDING",
    });

    // 🔹 5. Debitar cashback do usuário
    if (useCashback && effectiveDiscount > 0) {
      await this.cashbacksRepository.redeemCashback({
        user_id,
        order_id: order.id,
        amount: effectiveDiscount,
      });
    }

    try {
      // Itens do pedido
      await this.ordersRepository.createOrderItems(order.id, validatedItems);

      // Localização do usuário (opcional)
      if (latitude !== undefined && longitude !== undefined) {
        await this.userLocationRepository.create({
          user_id,
          latitude,
          longitude,
        });
      }

      // Atualizar estoque
      for (const item of validatedItems) {
        const product = await this.productsRepository.findByIdProduct(
          item.product_id
        );
        if (!product) continue;

        const newQuantity = product.quantity.toNumber() - item.quantity;
        if (newQuantity < 0) {
          throw new Error(
            `Estoque insuficiente para o produto ${product.name}`
          );
        }

        await this.productsRepository.updateQuantity(product.id, {
          quantity: newQuantity,
          status: newQuantity > 0,
        });
      }

      return {
        id: order.id,
        qrCodeUrl: null,
        total_amount: calculatedTotal,
        discountApplied: effectiveDiscount,
        status: order.status,
      };
    } catch (error) {
      throw new Error(`Erro ao processar pedido: ${error}`);
    }
  }
}
