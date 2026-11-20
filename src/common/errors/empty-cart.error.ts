export class EmptyCartError extends Error {

    constructor() {
        super('El carrito de compras está vacío.');
        this.name = 'EmptyCartError';
    }
}