export class InsufficientGreenPointsError extends Error {

    constructor() {
        super('El cliente no dispone de suficientes puntos verdes.');
        this.name = 'InsufficientGreenPointsError';
    }
}