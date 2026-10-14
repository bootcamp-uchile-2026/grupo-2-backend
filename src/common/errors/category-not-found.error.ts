export class CategoryNotFoundError extends Error {

  constructor() {
    super('Categoría no encontrada');
    this.name = 'CategoryNotFoundError';
  }
}
