export class InvalidReturnError extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'InvalidReturnError';
    }
}