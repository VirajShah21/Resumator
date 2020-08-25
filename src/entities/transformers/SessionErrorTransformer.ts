export default class SessionErrorPuggable {
    public error = "Session Error";
    public message = "An account could not be found for this session.";

    constructor(altMessage?: string) {
        if (altMessage) this.message = altMessage;
    }
}
