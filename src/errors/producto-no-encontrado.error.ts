export class ProductoNoEncontradoError extends Error {

  constructor() {
    super('Producto no encontrado');

    this.name = 'ProductoNoEncontradoError';
  }
}