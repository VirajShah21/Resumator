import { database } from '@shared/database';
import { ObjectId } from 'mongodb';
import { validateEmail, validateMonthYearString } from '@shared/functions';
import Entity from '../Entity';

/**
 * Education interface
 */
export interface IAward {
    _id: ObjectId;
    user: string;
    name: string;
}

/**
 * Education class
 */
export default class Award extends Entity implements IAward {
    private static readonly mongodb = {
        collection: 'awards',
    };

    public _id: ObjectId;
    public user: string;
    public name: string;

    /**
     *
     * @param award
     */
    constructor(award: IAward) {
        super();
        this._id = new ObjectId(award._id);
        this.user = award.user;
        this.name = award.name.trim();
    }

    /**
     * Inserts this object to the education database
     *
     * @param callback Callback upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate())
            database
                .collection(Award.mongodb.collection)
                .insertOne(this, (err, result) => {
                    callback(err ? false : true);
                });
        else callback(false);
    }

    /**
     * Updates this item in the database
     *
     * @param callback Callback upon completion
     */
    public updateDatabaseItem(callback?: (success: boolean) => void): void {
        if (this.validate())
            database.collection(Award.mongodb.collection).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err, result) => {
                    if (callback) callback(err ? false : true);
                }
            );
        else if (callback) callback(false);
    }

    /**
     * Delete the DAO from the database (based on _id)
     *
     * @param callback Takes an argument based on the success of the delete operation
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database
            .collection(Award.mongodb.collection)
            .deleteOne({ _id: new ObjectId(this._id) }, (err) => {
                callback(err ? false : true);
            });
    }

    /**
     * Loads a list of education history belonging to the user
     *
     * @param email The email to lookup
     * @param callback The callback passing the education history for the user
     */
    public static loadFromDatabase(
        email: string,
        callback: (awards: Award[]) => void
    ): void {
        database
            .collection(Award.mongodb.collection)
            .find({ user: email })
            .toArray((err, result) => {
                callback(
                    err
                        ? []
                        : result.map((item) => {
                              return new Award(item);
                          })
                );
            });
    }

    public validate(): boolean {
        return this.name.length > 1;
    }
}
