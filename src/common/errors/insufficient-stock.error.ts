export class InsufficientStockError extends Error {

    constructor(productName: string) {
        super(`Stock insuficiente para el producto: ${productName}.`);
        this.name = 'InsufficientStockError';
    }
}