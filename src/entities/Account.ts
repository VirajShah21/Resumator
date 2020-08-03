import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import Address from "./Address";
import { IAddress } from "./Address";
import { validateEmail } from "@shared/functions";

const ACCOUNTS_COLLECTION = "accounts";

export interface IAccount {
    _id: ObjectId;
    fname: string;
    lname: string;
    email: string;
    password: string;
    address: IAddress;
}

export default class Account implements IAccount {
    public _id: ObjectId;
    public fname: string;
    public lname: string;
    public email: string;
    public password: string;
    public address: Address;

    constructor(fname: string | IAccount, lname?: string, email?: string, password?: string, address?: IAddress) {
        if (typeof fname == "string") {
            this._id = new ObjectId();
            this.fname = fname;
            this.lname = lname || "";
            this.email = email || "";
            this.password = password || "";
            this.address = address ? new Address(address) : new Address("", "", "", "", 0);
        } else {
            this._id = fname._id;
            this.fname = fname.fname;
            this.lname = fname.lname;
            this.email = fname.email;
            this.password = fname.password;
            this.address = new Address(fname.address);
        }
    }

    public validate(): boolean {
        return this.validateName() && this.validateEmail() && this.validatePassword() && this.validateAddress();
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

    private validateAddress(): booelan {
        return this.address.validate();
    }

    public insertDatabaseItem(callback?: (success: boolean) => void): void {
        database.collection(ACCOUNTS_COLLECTION).findOne({ email: this.email }, (err, result) => {
            if (err) throw err;

            if (result && callback) {
                callback(false);
            } else {
                database.collection(ACCOUNTS_COLLECTION).insertOne(this);
                if (callback) callback(true);
            }
        });
    }

    public static loadFromDatabase(email: string, callback: (account: Account) => void): void {
        database.collection(ACCOUNTS_COLLECTION).findOne({ email }, (err, result) => {
            if (err) throw err;
            callback(new Account(result));
        });
    }
}
