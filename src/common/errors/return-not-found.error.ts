export class ReturnNotFoundError extends Error {

    constructor() {
        super('Devolución no encontrada');
        this.name = 'ReturnNotFoundError';
    }
}