export class OrderItemNotFoundError extends Error {

    constructor() {
        super('Ítem del pedido no encontrado');
        this.name = 'OrderItemNotFoundError';
    }
}