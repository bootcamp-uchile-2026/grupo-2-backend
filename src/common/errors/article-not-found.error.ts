export class ArticleNotFoundError extends Error {

    constructor() {
        super('Artículo no encontrado');

        this.name = 'ArticleNotFoundError';
    }
}