import { database } from '../../shared/database';
import { validateEmail } from '../../shared/functions';
import { ObjectId } from 'mongodb';
import DataAccessObject, { IDaoConfig } from '../DataAccessObject';

export interface IEmailTransition {
    _id: ObjectId;
    oldEmail: string;
    newEmail: string;
}

export default class EmailTransition
    extends DataAccessObject
    implements IEmailTransition {
    private static readonly _dao: IDaoConfig = {
        collection: 'email-transition',
    };
    public _id: ObjectId;
    public oldEmail: string;
    public newEmail: string;

    public constructor(
        oldEmail: string,
        newEmail: string,
        objectId?: ObjectId
    ) {
        super(objectId ? objectId : new ObjectId(), EmailTransition._dao);
        this._id = objectId ? new ObjectId(objectId) : new ObjectId();
        this.oldEmail = oldEmail.trim();
        this.newEmail = newEmail.trim();
    }

    /**
     * Loads an account from the database via email address
     *
     * @param newEmail The new email to lookup
     * @param callback The callback passing the user's account
     */
    public static loadFromDatabase(
        newEmail: string,
        callback: (emailTransitionObj?: EmailTransition) => void
    ): void {
        database
            .collection(EmailTransition._dao.collection)
            .findOne({ newEmail }, (err, result) => {
                callback(
                    err || !result
                        ? undefined
                        : new EmailTransition(
                              result.oldEmail,
                              result.newEmail,
                              result._id
                          )
                );
            });
    }

    public validate(): boolean {
        return validateEmail(this.oldEmail) && validateEmail(this.newEmail);
    }
}
