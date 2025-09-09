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
  discountApplied?: number;
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

  private validateDiscount(
    discount: Decimal,
    subtotal: Decimal,
    balance: Decimal
  ): void {
    if (discount.lessThan(0))
      throw new Error("O desconto não pode ser negativo");
    if (discount.greaterThan(subtotal))
      throw new Error("O desconto não pode exceder o subtotal do pedido");
    if (discount.greaterThan(balance))
      throw new Error("Saldo de cashback insuficiente");
  }

  async execute({
    user_id,
    store_id,
    latitude,
    longitude,
    items,
    discountApplied = 0,
    total_amount: expectedTotal,
    useCashback = false,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (!items || items.length === 0) {
      throw new Error("O pedido deve conter pelo menos um item");
    }

    let subtotal = new Decimal(0);
    const validatedItems = [];

    for (const item of items) {
      const product = await this.productsRepository.findByIdProduct(
        item.product_id
      );
      if (!product)
        throw new Error(`Produto com ID ${item.product_id} não encontrado.`);
      if (item.quantity <= 0)
        throw new Error(`Quantidade inválida para o produto ${product.name}`);

      const realSubtotal = new Decimal(product.price)
        .mul(item.quantity)
        .toDecimalPlaces(2);
      subtotal = subtotal.plus(realSubtotal);

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        subtotal: realSubtotal.toNumber(),
      });
    }

    subtotal = subtotal.toDecimalPlaces(2);
    const discount = new Decimal(discountApplied).toDecimalPlaces(2);
    const effectiveDiscount = Decimal.min(discount, subtotal).toDecimalPlaces(
      2
    );
    const calculatedTotal = subtotal
      .minus(effectiveDiscount)
      .toDecimalPlaces(2);

    if (
      expectedTotal !== undefined &&
      new Decimal(expectedTotal).minus(calculatedTotal).abs().greaterThan(0.01)
    ) {
      throw new Error("O total informado não corresponde aos itens e desconto");
    }

    if (useCashback) {
      const balance = new Decimal(
        await this.cashbacksRepository.getBalance(user_id)
      ).toDecimalPlaces(2);
      this.validateDiscount(effectiveDiscount, subtotal, balance);
    }

    const hasPendingOrder = await this.ordersRepository.existsPendingOrder(
      user_id
    );

    if (useCashback && hasPendingOrder) {
      throw new Error(
        "Você já tem um pedido pendente. Aguarde a validação para usar seu cashback novamente."
      );
    }

    const order = await this.ordersRepository.create({
      user_id,
      store_id,
      totalAmount: calculatedTotal,
      discountApplied: effectiveDiscount,
      status: "PENDING",
    });

    if (useCashback && effectiveDiscount.greaterThan(0)) {
      await this.cashbacksRepository.redeemCashback({
        user_id,
        order_id: order.id,
        amount: effectiveDiscount.toNumber(),
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

        const newQuantity = new Decimal(product.quantity).minus(item.quantity);
        if (newQuantity.lessThan(0)) {
          throw new Error(
            `Estoque insuficiente para o produto ${product.name}`
          );
        }

        await this.productsRepository.updateQuantity(product.id, {
          quantity: newQuantity.toNumber(),
          status: newQuantity.greaterThan(0),
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
