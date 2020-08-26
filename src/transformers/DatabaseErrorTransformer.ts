export default class DatabaseErrorTransformer {
    public error = "Database Error";
    public message: string;

    constructor(message: string) {
        this.message = `${message} Please try again in some time.`;
    }
}
