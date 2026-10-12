export class ProductNotFoundError extends Error {

  constructor() {
    super('Producto no encontrado');

    this.name = 'ProductNotFoundError';
  }
}