export class EntrepreneurNotFoundError extends Error {

  constructor() {
    super('Emprendedor no encontrado');

    this.name = 'EntrepreneurNotFoundError';
  }
}