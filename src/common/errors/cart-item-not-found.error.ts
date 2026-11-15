export class CartItemNotFoundError extends Error {

    constructor() {
        super('Producto no encontrado en el carrito.');
        this.name = 'CartItemNotFoundError'}
}