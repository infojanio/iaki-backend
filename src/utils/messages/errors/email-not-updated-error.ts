// src/errors/user-not-found-error.ts
export class EmailNotUpdatedError extends Error {
  constructor() {
    super("A atualização por e-mail não é permitida");
    this.name = "EmailNotUpdatedError";
  }
}
