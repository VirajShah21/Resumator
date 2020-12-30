import IClientWrapper from '../entities/models/IClientWrapper';
import { hash, compare } from 'bcrypt';
import { Request } from 'express';
import { passwordSaltRounds, keygenChars } from './constants';

export const KEYLENGTH = 15;

/**
 * Hashes a password and pipes it to the callback
 *
 * @param plaintextPassword Plaintext password
 * @param callback Passes one argument: the password hash
 */
export function hashPassword(
    plaintextPassword: string,
    callback?: (hash: string) => void
): void {
    hash(plaintextPassword, passwordSaltRounds, (err, hash) => {
        if (callback) callback(hash);
    });
}

/**
 * Checks if a plaintext password matches the hashed password
 *
 * @param plaintextPassword The plaintext password
 * @param hashedPassword The hashed password
 * @param callback Passes true if passwords match; false otherwise
 */
export function comparePasswordWithHash(
    plaintextPassword: string,
    hashedPassword: string,
    callback?: (matches: boolean) => void
): void {
    compare(plaintextPassword, hashedPassword, (err, result) => {
        if (callback) callback(result);
    });
}

/**
 * Generates a random key with a length of KEYLENGTH
 */
export function generateKey(): string {
    let key = '';

    while (key.length < KEYLENGTH)
        key += keygenChars.charAt(Math.random() * keygenChars.length);

    return key;
}

/**
 * Checks if an email address follows the convention <user>@<domain>.com
 *
 * @param email The email to validat
 * @returns True if the email follows the generic email format
 */
export function validateEmail(email: string): boolean {
    try {
        return (
            email.split('@').length === 2 &&
            email.split('@')[1].split('.').length === 2
        );
    } catch (e) {
        return false;
    }
}

/**
 * Checks if a datestring follows the format mm/dd/YYYY
 *
 * @param date The date to validate
 * @returns True if the date is a valid datestring
 */
export function validateMonthYearString(date: string): boolean {
    try {
        const month = parseInt(date.split('/')[0], 10);
        const year = parseInt(date.split('/')[1], 10);

        return month > 0 && month <= 12 && year >= 1000 && year <= 9999;
    } catch (e) {
        return false;
    }
}

export function generateVerifyPin(): string {
    let verifyPin = Math.round(Math.random() * 1000000) + '';
    while (verifyPin.length < 6) verifyPin = '0' + verifyPin;
    return verifyPin;
}

export function getClient(req: Request): IClientWrapper | undefined {
    const obj = Object.getOwnPropertyDescriptor(req, 'client');
    if (obj) return obj.value;
    else return undefined;
}

export function assertGoodClient(
    client?: IClientWrapper
): asserts client is IClientWrapper {
    if (!client || !client.account || !client.session || !client.resumeInfo)
        throw `Client is not good ${JSON.stringify(client, null, 4)}`;
}

export function assertDefined<T>(
    anything: T | undefined | null
): asserts anything is T {
    if (anything === undefined || anything === null)
        throw `${anything} is not defined.`;
}
