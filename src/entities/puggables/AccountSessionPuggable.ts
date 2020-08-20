import Account, { IAccount } from "@entities/Account";
import Session, { ISession } from "@entities/Session";

export default class AccountSessionPuggable {
    account: Account;
    session: Session;

    constructor(account: IAccount, session: ISession) {
        this.account = new Account(account);
        this.session = new Session(session);
    }

    public static fetch(sessionKey: string, callback: (puggable?: AccountSessionPuggable) => void): void {
        Session.loadFromDatabase(sessionKey, (session) => {
            if (session) {
                Account.loadFromDatabase(session.user, (account) => {
                    if (account) callback(new AccountSessionPuggable(account, session));
                    else callback(undefined);
                });
            } else {
                callback(undefined);
            }
        });
    }
}
