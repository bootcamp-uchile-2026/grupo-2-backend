export class CustomerNotFoundError extends Error {
    
  constructor() {
    super('Cliente no encontrado');

    this.name = 'CustomerNotFoundError';
  }
}