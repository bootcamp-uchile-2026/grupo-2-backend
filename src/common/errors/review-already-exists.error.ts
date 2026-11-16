export class ReviewAlreadyExistsError extends Error {

    constructor() {
        super('El cliente ya ha valorado este producto');
        this.name = 'ReviewAlreadyExistsError';
    }
}