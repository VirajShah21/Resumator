import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import Address, { IAddress } from "../models/Address";
import { validateEmail } from "@shared/functions";
import logger from "@shared/Logger";

const ACCOUNTS_COLLECTION = "accounts";

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
}

/**
 * The Account class. Stores core user account information.
 */
export default class Account implements IAccount {
    public _id: ObjectId;
    public fname: string;
    public lname: string;
    public email: string;
    public password: string;
    public address?: Address;
    public phone?: string;
    public currentGoal?: string;
    public objective?: string;

    /**
     *
     * @param accountObject an implementation of IAccount
     */
    constructor(accountObject: IAccount) {
        this._id = accountObject._id;
        this.fname = accountObject.fname.trim();
        this.lname = accountObject.lname.trim();
        this.email = accountObject.email.trim();
        this.password = accountObject.password;
        this.address = accountObject.address ? new Address(accountObject.address) : undefined;
        this.phone = accountObject.phone?.trim();
        this.currentGoal = accountObject.currentGoal?.trim();
        this.objective = accountObject.objective?.trim();
    }

    /**
     * Checks if name, email, address, and phone numbers are valid entries
     *
     * @returns True if all fields are valid
     */
    public validate(): boolean {
        return this.validateName() && this.validateEmail() && this.validateAddress() && this.validatePhone();
    }

    /**
     * Checks if the first and last name do not contain spaces and if their length is is greater than 0
     *
     * @returns True if the name field is valid
     */
    private validateName(): boolean {
        return this.fname.indexOf(" ") < 0 && this.lname.indexOf(" ") < 0;
    }

    /**
     * Checks if the email is valid based on the format <user>@<domain>.<tld>
     *
     * @returns True if the email is valid
     */
    private validateEmail(): boolean {
        return validateEmail(this.email);
    }

    /**
     * Checks if the address fields are valid based on the Address DAO
     *
     * @returns True if all address fields are valid or no address was provided
     */
    private validateAddress(): boolean {
        return this.address ? this.address.validate() : true;
    }

    /**
     * Checks if the phone number is valid
     *
     * @returns True if the phone number follows the format (XXX) XXX - XXXX or if it is not provided
     */
    private validatePhone(): boolean {
        if (this.phone)
            return (
                this.phone.split("").filter((digit) => {
                    return "1234567890 ()-".indexOf(digit) < 0;
                }).length === 0 && this.phone.length === 16
            );
        else return true;
    }

    /**
     * Inserts this object to the accounts database
     *
     * @param callback The function to call upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validateEmail() && this.validateName()) {
            database.collection(ACCOUNTS_COLLECTION).findOne({ email: this.email }, (err, result) => {
                if (err) {
                    throw err;
                } else if (result) {
                    callback(false);
                } else {
                    database.collection(ACCOUNTS_COLLECTION).insertOne(this, (err2) => {
                        if (err2) callback(false);
                        else callback(true);
                    });
                }
            });
        } else {
            callback(false);
        }
    }

    /**
     * Updates this DAO
     *
     * @param callback The function call upon completion
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(ACCOUNTS_COLLECTION).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err) => {
                    if (err) {
                        logger.info(`Could not update account ${JSON.stringify(this, null, 4)} Database Error`);
                        callback(false);
                    } else {
                        logger.info(`Updated account ${JSON.stringify(this, null, 4)}`);
                        callback(true);
                    }
                }
            );
        } else {
            logger.info(`Could not update account ${JSON.stringify(this, null, 4)} Invalid data`);
            callback(false);
        }
    }

    /**
     * Loads an account from the database via email address
     *
     * @param email Lookup email
     * @param callback The callback passing the user's account
     */
    public static loadFromDatabase(email: string, callback: (account?: Account) => void): void {
        database.collection(ACCOUNTS_COLLECTION).findOne({ email }, (err, result) => {
            if (err || !result) callback(undefined);
            callback(new Account(result));
        });
    }
}
