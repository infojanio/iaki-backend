export class LateOrderValidationError extends Error {
  constructor() {
    super("O pedido só poderá ser validado até 20 minutos após sua criação.");
  }
}
