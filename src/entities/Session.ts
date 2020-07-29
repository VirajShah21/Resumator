import { generateKey } from "@shared/functions";
import { database } from "@shared/database";
import { IAccount } from "@entities/Account";

const SESSIONS_COLLECTION = "sessions";

export interface ISession {
    timestamp: number;
    key: string;
    user: string;
}

export default class Session implements ISession {
    public timestamp: number;
    public key: string;
    public user: string;

    constructor(sessionOrAccount: ISession | IAccount) {
        if (sessionOrAccount.hasOwnProperty("key")) {
            // if is of type `ISession`
            this.key = (sessionOrAccount as ISession).key;
            this.timestamp = (sessionOrAccount as ISession).timestamp;
            this.user = (sessionOrAccount as ISession).user;
        } else {
            // is of type `IAccount`
            this.key = generateKey();
            this.timestamp = new Date().getTime();
            this.user = (sessionOrAccount as IAccount).email;
        }
    }

    public insertDatabaseItem(callback: () => void): void {
        database.collection(SESSIONS_COLLECTION).insert(this);
        callback();
    }

    public static loadFromDatabase(
        key: string,
        callback: (session: Session) => void
    ): void {
        database
            .collection(SESSIONS_COLLECTION)
            .findOne({ key }, (err, result) => {
                if (err) throw err;
                callback(new Session(result));
            });
    }
}
