export class MaxNumberOfOrdersError extends Error {
  constructor() {
    super("Número máximo de pedidos excedido.");
  }
}
