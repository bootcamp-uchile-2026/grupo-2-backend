export class ReviewNotAllowedError extends Error {

    constructor() {
        super('El cliente solo puede valorar productos de pedidos entregados');
        this.name = 'ReviewNotAllowedError';
    }
}