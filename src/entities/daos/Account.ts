import { database } from '@shared/database';
import { ObjectId } from 'mongodb';
import Address, { IAddress } from '../models/Address';
import { validateEmail } from '@shared/functions';
import DataAccessObject from '../DataAccessObject';

/**
 * Account Interface (User accounts)
 */
export interface IAccount {
    _id: ObjectId;
    fname: string;
    lname: string;
    email: string;
    password: string;
    address?: IAddress;
    phone?: string;
    currentGoal?: string;
    objective?: string;
    photo?: boolean;
    emailVerified: boolean;
}

/**
 * The Account class. Stores core user account information.
 */
export default class Account extends DataAccessObject implements IAccount {
    private static readonly _dao = { collection: 'accounts' };
    public fname: string;
    public lname: string;
    public email: string;
    public password: string;
    public address?: Address;
    public phone?: string;
    public currentGoal?: string;
    public objective?: string;
    public photo: boolean;
    public emailVerified: boolean;

    /**
     *
     * @param accountObject an implementation of IAccount
     */
    constructor(accountObject: IAccount) {
        super(accountObject._id, { collection: 'accounts' });
        this.fname = accountObject.fname.trim();
        this.lname = accountObject.lname.trim();
        this.email = accountObject.email.trim();
        this.password = accountObject.password.trim();
        this.address = accountObject.address
            ? new Address(accountObject.address)
            : undefined;
        this.phone = accountObject.phone?.trim();
        this.currentGoal = accountObject.currentGoal?.trim();
        this.objective = accountObject.objective?.trim();
        this.photo = accountObject.photo || false;
        this.emailVerified = accountObject.emailVerified || false;
    }

    /**
     * Inserts this object to the accounts database
     *
     * @param callback The function to call upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (
            validateEmail(this.email) &&
            this.fname.indexOf(' ') < 0 &&
            this.lname.indexOf(' ') < 0
        ) {
            database
                .collection(this._dao.collection)
                .findOne({ email: this.email }, (err, result) => {
                    if (err) throw err;
                    else if (result) callback(false);
                    else
                        database
                            .collection(this._dao.collection)
                            .insertOne(this, (err2) => {
                                callback(err2 ? false : true);
                            });
                });
        } else callback(false);
    }

    /**
     * Loads an account from the database via email address
     *
     * @param email Lookup email
     * @param callback The callback passing the user's account
     */
    public static loadFromDatabase(
        email: string,
        callback: (account?: Account) => void
    ): void {
        database
            .collection(Account._dao.collection)
            .findOne({ email }, (err, result) => {
                callback(err || !result ? undefined : new Account(result));
            });
    }

    public static loadFromDatabaseById(
        oid: ObjectId,
        callback: (account?: Account) => void
    ): void {
        database
            .collection(Account._dao.collection)
            .findOne({ _id: oid }, (err, result) => {
                callback(err || !result ? undefined : new Account(result));
            });
    }

    private validateName(): boolean {
        return this.fname.indexOf(' ') < 0 && this.lname.indexOf(' ') < 0;
    }

    public validate(): boolean {
        const nameValid: boolean =
            this.fname.indexOf(' ') < 0 && this.lname.indexOf(' ') < 0;
        const addressValid: boolean = this.address
            ? this.address.validate()
            : true;

        let phoneValid: boolean = this.phone
            ? this.phone.split('').filter((digit) => {
                  return '1234567890 ()-'.indexOf(digit) < 0;
              }).length === 0 && this.phone.length === 16
            : true;

        return (
            addressValid &&
            validateEmail(this.email) &&
            nameValid &&
            this.password.length > 8 &&
            phoneValid
        );
    }
}
