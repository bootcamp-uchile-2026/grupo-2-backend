export class SubcategoriaNoEncontradaError extends Error {

  constructor() {
    super('Subcategoría no encontrada');

    this.name = 'SubcategoriaNoEncontradaError';
  }
}