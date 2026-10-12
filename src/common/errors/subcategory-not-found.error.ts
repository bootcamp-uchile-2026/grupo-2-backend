export class SubcategoryNotFoundError extends Error {

  constructor() {
    super('Subcategoría no encontrada');

    this.name = 'SubcategoryNotFoundError';
  }
}