export class AppError {
    public readonly message: string;

    public readonly statusCode: number;

    public readonly responseCode: string;

    constructor(message: string, statusCode = 400, responseCode = null) {
        this.message = message;
        this.statusCode = statusCode;

        this.responseCode = responseCode;
    }
}
