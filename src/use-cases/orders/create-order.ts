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
  discount_applied?: number;
  total_amount?: number | Decimal;
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
  discount_applied: Decimal | number;
  status: string;
}

export class OrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private userLocationRepository: UserLocationRepository,
    private productsRepository: ProductsRepository,
    private cashbacksRepository: CashbacksRepository
  ) {}

  private validateDiscount(
    discount: number,
    subtotal: number,
    balance: number
  ): void {
    if (discount < 0) throw new Error("O desconto não pode ser negativo");
    if (discount > subtotal)
      throw new Error("O desconto não pode exceder o subtotal do pedido");
    if (discount > balance) throw new Error("Saldo de cashback insuficiente");
  }

  async execute({
    user_id,
    store_id,
    latitude,
    longitude,
    items,
    discount_applied = 0,
    total_amount: expectedTotal,
    useCashback = false,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (!items || items.length === 0) {
      throw new Error("O pedido deve conter pelo menos um item");
    }

    // Buscar preços reais e calcular subtotal
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

    const effectiveDiscount = Math.min(discount_applied, subtotal);
    const calculatedTotal = subtotal - effectiveDiscount;

    if (
      expectedTotal !== undefined &&
      new Decimal(expectedTotal).minus(calculatedTotal).abs().greaterThan(0.01)
    ) {
      throw new Error("O total informado não corresponde aos itens e desconto");
    }

    if (useCashback && effectiveDiscount > 0) {
      const balance = await this.cashbacksRepository.getBalance(user_id);
      this.validateDiscount(effectiveDiscount, subtotal, balance);
    }

    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: new Decimal(calculatedTotal),
      discountApplied: effectiveDiscount,
      status: "PENDING",
    });

    // ✅ Aplicar o desconto (debitar cashback do saldo do usuário)
    if (useCashback && effectiveDiscount > 0) {
      await this.cashbacksRepository.redeemCashback({
        user_id,
        order_id: order.id,
        amount: effectiveDiscount,
      });
    }

    try {
      await this.ordersRepository.createOrderItems(order.id, validatedItems);

      if (latitude !== undefined && longitude !== undefined) {
        await this.userLocationRepository.create({
          user_id,
          latitude,
          longitude,
        });
      }

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
        discount_applied: effectiveDiscount,
        status: order.status,
      };
    } catch (error) {
      throw new Error(`Erro ao processar pedido: ${error}`);
    }
  }
}
