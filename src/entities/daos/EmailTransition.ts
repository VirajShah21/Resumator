import { database } from "@shared/database";
import { validateEmail } from "@shared/functions";
import logger from "@shared/Logger";
import { ObjectId } from "mongodb";
import Entity from "../Entity";

const EMAIL_TRANSITION_COLLECTION = "email-transition";

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
        this.oldEmail = oldEmail;
        this.newEmail = newEmail;
    }

    /**
     * Inserts this object to the email transition database
     *
     * @param callback The function to call upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (super.validate()) {
            database
                .collection(EMAIL_TRANSITION_COLLECTION)
                .insertOne(this, (err2) => {
                    if (err2) {
                        logger.warn(
                            `Mongo threw an error while inserting an email transition ${JSON.stringify(
                                this,
                                null,
                                4
                            )}`
                        );
                        logger.error(err2);
                        callback(false);
                    } else {
                        logger.info(
                            `Transition could not be entered due to a database error ${JSON.stringify(
                                this,
                                null,
                                4
                            )}`
                        );
                        callback(true);
                    }
                });
        } else {
            logger.info(
                `Email Transition contains an invalid email (${JSON.stringify(
                    this,
                    null,
                    4
                )})`
            );
            callback(false);
        }
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
                if (err) {
                    logger.warn(
                        `Mongo passed an error while loading email transition (${newEmail}) from database`
                    );
                    logger.error(err);
                    callback(undefined);
                } else if (!result) {
                    logger.warn(
                        `No result returned from database for email transition: ${newEmail}`
                    );
                    callback(undefined);
                } else {
                    logger.info(
                        `Found + loading email transition: ${newEmail}`
                    );
                    callback(
                        result
                            ? new EmailTransition(
                                  result.oldEmail,
                                  result.newEmail,
                                  result._id
                              )
                            : undefined
                    );
                }
            });
    }

    public validateOldEmail(): boolean {
        return validateEmail(this.oldEmail);
    }

    public validateNewEmail(): boolean {
        return validateEmail(this.newEmail);
    }
}
