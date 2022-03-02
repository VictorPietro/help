export class InternalServerError extends Error {
    constructor() {
        super('Server is unavailable.');
    }
}