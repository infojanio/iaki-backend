export class InsufficientStockError extends Error {
  constructor() {
    super('Produto insuficiente em estoque.')
  }
}
