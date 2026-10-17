export class FavoriteNotFoundError extends Error {

  constructor() {
    super('Favorito no encontrado.');
    this.name = 'FavoriteNotFoundError';
  }
}
