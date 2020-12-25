import { database } from '@shared/database';
import { ObjectId } from 'mongodb';
import DataAccessObject, { IDaoConfig } from '../DataAccessObject';

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
export default class Award extends DataAccessObject implements IAward {
    private static readonly _dao: IDaoConfig = { collection: 'award' };
    public user: string;
    public name: string;

    /**
     *
     * @param award
     */
    constructor(award: IAward) {
        super(award._id, Award._dao);
        this.user = award.user;
        this.name = award.name.trim();
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
            .collection(Award._dao.collection)
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
