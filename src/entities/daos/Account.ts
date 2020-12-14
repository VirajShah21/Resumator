import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import Address, { IAddress } from "../models/Address";
import { validateEmail } from "@shared/functions";
import Logger from "@shared/Logger";
import Entity from "../Entity";

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
    photo?: boolean;
    emailVerified: boolean;
}

/**
 * The Account class. Stores core user account information.
 */
export default class Account extends Entity implements IAccount {
    public _id: ObjectId;
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
        super();
        this._id = new ObjectId(accountObject._id);
        this.fname = accountObject.fname.trim();
        this.lname = accountObject.lname.trim();
        this.email = accountObject.email.trim();
        this.password = accountObject.password;
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
            this.validateEmail() &&
            this.validateFname() &&
            this.validateLname()
        ) {
            Logger.info(`User account (${this._id}) is validated`);
            database
                .collection(ACCOUNTS_COLLECTION)
                .findOne({ email: this.email }, (err, result) => {
                    if (err) {
                        throw err;
                    } else if (result) {
                        Logger.info(
                            `Could not insert account (${this._id}) because email already exists`
                        );
                        callback(false);
                    } else {
                        database
                            .collection(ACCOUNTS_COLLECTION)
                            .insertOne(this, (err2) => {
                                if (err2) {
                                    Logger.warn(
                                        `Mongo threw an error while inserting account (${this._id})`
                                    );
                                    Logger.error(err2);
                                    callback(false);
                                } else {
                                    Logger.info(
                                        `Account inserted (${this._id})`
                                    );
                                    callback(true);
                                }
                            });
                    }
                });
        } else {
            Logger.info(
                `User account contains invalid email and name (${this._id})`
            );
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
                        Logger.info(
                            `Could not update account ${JSON.stringify(
                                this,
                                null,
                                4
                            )} Database Error`
                        );
                        callback(false);
                    } else {
                        Logger.info(
                            `Updated account ${JSON.stringify(this, null, 4)}`
                        );
                        callback(true);
                    }
                }
            );
        } else {
            Logger.info(
                `Could not update account ${JSON.stringify(
                    this,
                    null,
                    4
                )} Invalid data`
            );
            callback(false);
        }
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
            .collection(ACCOUNTS_COLLECTION)
            .findOne({ email }, (err, result) => {
                if (err) {
                    Logger.warn(
                        `Mongo passed an error while loading user (${email}) from database`
                    );
                    Logger.error(err);
                    callback(undefined);
                } else if (!result) {
                    Logger.warn(
                        `No result returned from database for user: ${email}`
                    );
                    callback(undefined);
                } else {
                    Logger.info(`Found + loading account: ${email}`);
                    callback(result ? new Account(result) : undefined);
                }
            });
    }

    public static loadFromDatabaseById(
        oid: ObjectId,
        callback: (account?: Account) => void
    ): void {
        database
            .collection(ACCOUNTS_COLLECTION)
            .findOne({ _id: oid }, (err, result) => {
                if (err) {
                    Logger.warn(
                        `Mongo passed an error while loading user (${oid.toString()}) from`
                    );
                    Logger.error(err);
                    callback(undefined);
                } else if (!result) {
                    Logger.warn(
                        `No result returned from database for user: ${oid.toString()}`
                    );
                    callback(result ? new Account(result) : undefined);
                } else {
                    Logger.info(`Found + loading account: ${oid.toString()}`);
                    callback(result ? new Account(result) : undefined);
                }
            });
    }

    protected validateAddress(): boolean {
        return this.address ? this.address.validate() : true;
    }

    protected validateEmail(): boolean {
        return validateEmail(this.email);
    }

    protected validateFname(): boolean {
        return this.fname.indexOf(" ") < 0;
    }

    protected validateLname(): boolean {
        return this.lname.indexOf(" ") < 0;
    }

    protected validatePassword(): boolean {
        return this.password.length > 8;
    }

    protected validatePhone(): boolean {
        if (this.phone)
            return (
                this.phone.split("").filter((digit) => {
                    return "1234567890 ()-".indexOf(digit) < 0;
                }).length === 0 && this.phone.length === 16
            );
        else return true;
    }

    protected validateEmailVerified(): boolean {
        return typeof this.emailVerified == "boolean";
    }
}
