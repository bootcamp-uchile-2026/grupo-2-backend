export class InvalidReturnStatusError extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'InvalidReturnStatusError';
    }
}