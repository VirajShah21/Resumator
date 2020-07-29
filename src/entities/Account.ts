import { database } from "@shared/database";

const ACCOUNTS_COLLECTION = "accounts";
const SESSIONS_COLLECTION = "sessions";

export interface IAccount {
    fname: string;
    lname: string;
    email: string;
    password: string;
}

export default class Account implements IAccount {
    public fname: string;
    public lname: string;
    public email: string;
    public password: string;

    constructor(
        fname: string | IAccount,
        lname?: string,
        email?: string,
        password?: string
    ) {
        if (typeof fname == "string") {
            this.fname = fname;
            this.lname = lname || "";
            this.email = email || "";
            this.password = password || "";
        } else {
            this.fname = fname.fname;
            this.lname = fname.lname;
            this.email = fname.email;
            this.password = fname.password;
        }
    }

    public validate(): boolean {
        let valid: boolean;

        valid = this.fname.indexOf(" ") < 0;
        valid = valid && this.lname.indexOf(" ") < 0;
        valid =
            valid &&
            this.email.split("@").length === 2 &&
            this.email.split("@")[1].split(".").length === 2;
        valid = valid && this.password.length > 8;
        return valid;
    }

    public insertDatabaseItem(callback?: (success: boolean) => void): void {
        database
            .collection(ACCOUNTS_COLLECTION)
            .findOne({ email: this.email }, (err, result) => {
                if (err) throw err;

                if (result && callback) {
                    callback(false);
                } else {
                    database.collection(ACCOUNTS_COLLECTION).insertOne(this);
                    if (callback) callback(true);
                }
            });
    }

    public static loadFromDatabase(
        email: string,
        callback: (account: Account) => void
    ): void {
        database
            .collection(ACCOUNTS_COLLECTION)
            .findOne({ email }, (err, result) => {
                if (err) throw err;
                callback(new Account(result));
            });
    }
}
