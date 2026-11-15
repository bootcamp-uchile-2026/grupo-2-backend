export class CartNotFoundError extends Error {

    constructor() {
        super('Carrito no encontrado.');
        this.name = 'CartNotFoundError'
    }
}