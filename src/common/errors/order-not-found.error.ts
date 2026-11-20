export class OrderNotFoundError extends Error {

    constructor() {
        super('Pedido no encontrado');

        this.name = 'OrderNotFoundError';
    }
}