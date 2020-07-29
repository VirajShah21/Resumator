import logger from "./Logger";
import Bcrypt from "bcrypt";
import { passwordSaltRounds, keygenChars } from "./constants";

export function hashPassword(
    plaintextPassword: string,
    callback?: (hash: string) => void
) {
    Bcrypt.hash(plaintextPassword, passwordSaltRounds, (err, hash) => {
        if (callback) callback(hash);
    });
}

export function comparePasswordWithHash(
    plaintextPassword: string,
    hashedPassword: string,
    callback?: (matches: boolean) => void
): void {
    Bcrypt.compare(plaintextPassword, hashedPassword, (err, result) => {
        if (callback) callback(result);
    });
}

export function generateKey(): string {
    let key = "";

    while (key.length < 15)
        key += keygenChars.charAt(Math.random() * keygenChars.length);

    return key;
}
