import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import Address, { IAddress } from "./Address";
import { validateEmail } from "@shared/functions";

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
    address: IAddress;
    phone: string;
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
    public address: Address;
    public phone: string;

    /**
     *
     * @param fname The user's first name
     * @param lname The user's last name
     * @param email The user's email
     * @param password The user's hashed password (hashed with Bcrypt)
     * @param address The user's address
     */
    constructor(
        fname: string | IAccount,
        lname?: string,
        email?: string,
        password?: string,
        address?: IAddress,
        phone?: string
    ) {
        if (typeof fname == "string") {
            this._id = new ObjectId();
            this.fname = fname;
            this.lname = lname || "";
            this.email = email || "";
            this.password = password || "";
            this.address = address ? new Address(address) : new Address("", "", "", "", 0);
            this.phone = phone || "";
        } else {
            this._id = new ObjectId(fname._id);
            this.fname = fname.fname;
            this.lname = fname.lname;
            this.email = fname.email;
            this.password = fname.password;
            this.address = new Address(fname.address);
            this.phone = fname.phone;
        }
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
        return this.address.validate();
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
                if (err) throw err;

                if (result) {
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
                    if (err) callback(false);
                    else callback(true);
                }
            );
        } else {
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