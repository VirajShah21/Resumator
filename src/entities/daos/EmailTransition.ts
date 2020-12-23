import { database } from '@shared/database';
import { validateEmail } from '@shared/functions';
import { ObjectId } from 'mongodb';
import Entity from '../Entity';

const EMAIL_TRANSITION_COLLECTION = 'email-transition';

export interface IEmailTransition {
    _id: ObjectId;
    oldEmail: string;
    newEmail: string;
}

export default class EmailTransition
    extends Entity
    implements IEmailTransition {
    public _id: ObjectId;
    public oldEmail: string;
    public newEmail: string;

    public constructor(
        oldEmail: string,
        newEmail: string,
        objectId?: ObjectId
    ) {
        super();
        this._id = objectId ? new ObjectId(objectId) : new ObjectId();
        this.oldEmail = oldEmail.trim();
        this.newEmail = newEmail.trim();
    }

    /**
     * Inserts this object to the email transition database
     *
     * @param callback The function to call upon completion
     */
    public insertDatabaseItem(callback?: (success: boolean) => void): void {
        if (super.validate())
            database
                .collection(EMAIL_TRANSITION_COLLECTION)
                .insertOne(this, (err2) => {
                    if (callback) callback(err2 ? false : true);
                });
        else if (callback) callback(false);
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
            .collection(EMAIL_TRANSITION_COLLECTION)
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

    public validateOldEmail(): boolean {
        return validateEmail(this.oldEmail);
    }

    public validateNewEmail(): boolean {
        return validateEmail(this.newEmail);
    }

    protected getValidators(): (() => boolean)[] {
        return [this.validateOldEmail, this.validateNewEmail];
    }
}
