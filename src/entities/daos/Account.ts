import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import Address, { IAddress } from "./Address";
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

    /**
     *
     * @param accountObject an implementation of IAccount
     */
    constructor(accountObject: IAccount) {
        this._id = accountObject._id;
        this.fname = accountObject.fname;
        this.lname = accountObject.lname;
        this.email = accountObject.email;
        this.password = accountObject.password;
        this.address = accountObject.address ? new Address(accountObject.address) : undefined;
        this.phone = accountObject.phone;
        this.currentGoal = accountObject.currentGoal;
    }

    /**
     * @returns True if all fields are valid
     */
    public validate(): boolean {
        return (
            this.validateName() &&
            this.validateEmail() &&
            this.validatePassword() &&
            this.validateAddress() &&
            this.validatePhone()
        );
    }

    private validateName(): boolean {
        return this.fname.indexOf(" ") < 0 && this.lname.indexOf(" ") < 0;
    }

    private validateEmail(): boolean {
        return validateEmail(this.email);
    }

    private validatePassword(): boolean {
        // TODO: Ensure that the password is a bcrypt hash
        return true;
    }

    private validateAddress(): boolean {
        return this.address ? this.address.validate() : true;
    }

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
        if (this.validateEmail() && this.validateName() && this.validatePassword()) {
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
