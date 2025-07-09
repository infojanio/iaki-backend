export class StoreAlreadyExistsError extends Error {
  constructor() {
    super("Loja já cadastrada.");
  }
}
