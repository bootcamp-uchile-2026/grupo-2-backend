export class CheckoutTotalChangedError extends Error {

    constructor() {
        super('El total de la compra ha cambiado. Debe revisar nuevamente el resumen del pedido.');
        this.name = 'CheckoutTotalChangedError';
    }
}