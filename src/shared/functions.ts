import Bcrypt from "bcrypt";
import { passwordSaltRounds, keygenChars } from "./constants";

export const KEYLENGTH = 15;

export function hashPassword(plaintextPassword: string, callback?: (hash: string) => void) {
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

    while (key.length < KEYLENGTH) key += keygenChars.charAt(Math.random() * keygenChars.length);

    return key;
}

export function validateEmail(email: string): boolean {
    try {
        return email.split("@").length === 2 && email.split("@")[1].split(".").length === 2;
    } catch (e) {
        return false;
    }
}

export function validateMonthYearString(date: string): boolean {
    try {
        const month = parseInt(date.split("/")[0]);
        const year = parseInt(date.split("/")[1]);

        return month > 0 && month <= 12 && year >= 1000 && year <= 9999;
    } catch (e) {
        return false;
    }
}

export function addToObject(toAdd: any, base: any): any {
    for (const prop in toAdd) if (toAdd.hasOwnProperty(prop)) base[prop] = toAdd[prop];
    return base;
}
