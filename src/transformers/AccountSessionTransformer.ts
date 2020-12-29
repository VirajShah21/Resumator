import Account, { IAccount } from '../entities/daos/Account';
import Session, { ISession } from '../entities/daos/Session';

export default class AccountSessionTransformer {
    account: Account;
    session: Session;

    constructor(account: IAccount, session: ISession) {
        this.account = new Account(account);
        this.session = new Session(session);
    }

    public static fetch(
        sessionKey: string,
        callback: (Transformer?: AccountSessionTransformer) => void
    ): void {
        Session.loadFromDatabase(sessionKey, (session) => {
            if (session)
                Account.loadFromDatabase(session.user, (account) => {
                    if (account)
                        callback(
                            new AccountSessionTransformer(account, session)
                        );
                    else callback(undefined);
                });
            else callback(undefined);
        });
    }
}
