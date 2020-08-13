import Account from "@entities/Account";
import Session from "@entities/Session";
import { callbackify } from "util";

export default class AccountSessionPuggable {
    account: Account;
    session: Session;

    constructor(account: Account, session: Session) {
        this.account = account;
        this.session = session;
    }

    public static fetch(sessionKey: string, callback: (puggable?: AccountSessionPuggable) => void): void {
        Session.loadFromDatabase(sessionKey, (session) => {
            if (session) {
                Account.loadFromDatabase(session.user, (account) => {
                    if (account) callback(new AccountSessionPuggable(account, session));
                    else callback(undefined);
                });
            }
        });
    }
}
