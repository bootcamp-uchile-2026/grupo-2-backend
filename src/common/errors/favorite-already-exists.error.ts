export class FavoriteAlreadyExistsError extends Error {

  constructor() {
    super('El producto ya está en favoritos.');
    this.name = 'FavoriteAlreadyExistsError';
  }
}
