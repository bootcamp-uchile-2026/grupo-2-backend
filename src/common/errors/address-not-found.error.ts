export class AddressNotFoundError extends Error {

    constructor() {
        super('Dirección no encontrada.');
        this.name = 'AddressNotFoundError';
    }
}