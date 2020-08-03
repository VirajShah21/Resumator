import { generateKey } from "@shared/functions";
import { database } from "@shared/database";
import { IAccount } from "@entities/Account";

const SESSIONS_COLLECTION = "sessions";

/**
 * Session interface
 */
export interface ISession {
    timestamp: number;
    key: string;
    user: string;
}

/**
 * Session class
 */
export default class Session implements ISession {
    public timestamp: number;
    public key: string;
    public user: string;

    /**
     *
     * @param sessionOrAccount An object containing information for either a session or an account
     */
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

    /**
     * Inserts this object to the sessions database
     *
     * @param callback Callback upon completion
     */
    public insertDatabaseItem(callback: () => void): void {
        database.collection(SESSIONS_COLLECTION).insertOne(this);
        callback();
    }

    /**
     * Loads a single session object from the database via its key
     *
     * @param key The session key to lookup
     * @param callback The callback upon completion
     */
    public static loadFromDatabase(key: string, callback: (session: Session) => void): void {
        database.collection(SESSIONS_COLLECTION).findOne({ key }, (err, result) => {
            if (err) throw err;
            callback(new Session(result));
        });
    }
}
