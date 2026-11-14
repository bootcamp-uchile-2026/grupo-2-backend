export class ProducerNotFoundError extends Error {

  constructor() {
    super('Productor no encontrado');
    this.name = 'ProducerNotFoundError';
  }
}