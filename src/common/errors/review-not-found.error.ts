export class ReviewNotFoundError extends Error {

    constructor() {
        super('Valoración no encontrada');
        this.name = 'ReviewNotFoundError';
    }
}