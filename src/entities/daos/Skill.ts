import { ObjectId } from 'mongodb';
import { database } from '@shared/database';
import { validateEmail } from '@shared/functions';
import DataAccessObject, { IDaoConfig } from '../DataAccessObject';

/**
 * Skill interface
 */
export interface ISkill {
    _id: ObjectId;
    name: string;
    proficiency: number;
    user: string;
}

/**
 * Skill class
 */
export default class Skill extends DataAccessObject implements ISkill {
    private static readonly _dao: IDaoConfig = { collection: 'skills' };
    public _id: ObjectId;
    public name: string;
    public proficiency: number;
    public user: string;

    /**
     *
     * @param name The name of this skill; defaults to ""
     * @param proficiency The proficiency the user has in this skill; defaults to 1 (out of 100)
     * @param user The user's email address
     */
    constructor(name: string | ISkill, proficiency?: number, user?: string) {
        if (typeof name === 'string') {
            super(new ObjectId(), Skill._dao);
            this._id = new ObjectId();
            this.name = name.trim();
            this.proficiency = proficiency || 1;
            this.user = user?.trim() || '';
        } else {
            super(name._id, Skill._dao);
            this._id = name._id;
            this.name = name.name.trim();
            this.proficiency = name.proficiency;
            this.user = name.user.trim();
        }
    }

    /**
     * Load all of a user's skills
     *
     * @param user The user's email
     * @param callback Passes a list of skills belonging to the specified user
     */
    public static loadFromDatabase(
        user: string,
        callback: (skills: Skill[]) => void
    ): void {
        database
            .collection(Skill._dao.collection)
            .find({ user })
            .toArray((err, skillset) => {
                callback(
                    err
                        ? []
                        : skillset.map((skill) => {
                              return new Skill(skill);
                          }) || []
                );
            });
    }

    public validate(): boolean {
        return (
            this.name.length > 0 &&
            this.proficiency >= 0 &&
            this.proficiency <= 100 &&
            validateEmail(this.user)
        );
    }
}
