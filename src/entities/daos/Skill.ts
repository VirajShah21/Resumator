import { ObjectId } from "mongodb";
import { database } from "@shared/database";
import { validateEmail } from "@shared/functions";

export const SKILLS_COLLECTION = "skills";

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
export default class Skill implements ISkill {
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
        if (typeof name == "string") {
            this._id = new ObjectId();
            this.name = name.trim();
            this.proficiency = proficiency || 1;
            this.user = user?.trim() || "";
        } else {
            this._id = name._id;
            this.name = name.name.trim();
            this.proficiency = name.proficiency;
            this.user = name.user.trim();
        }
    }

    /**
     * Checks if name, proficiency, and email are valid
     *
     * @returns True if fields are valid; false otherwise
     */
    public validate(): boolean {
        return this.name !== "" && this.proficiency > 0 && this.proficiency <= 100 && validateEmail(this.user);
    }

    /**
     * Insert the DAO to the database
     *
     * @param callback Takes one argument based on the success of the insert operation
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(SKILLS_COLLECTION).insertOne(this, (err) => {
                if (err) callback(false);
                else callback(true);
            });
        } else {
            callback(false);
        }
    }

    /**
     * Updates the skill DAO in the database
     *
     * @param callback Takes one argument based on the success of the update operation
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(SKILLS_COLLECTION).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err) => {
                    if (err) callback(false);
                    else callback(true);
                }
            );
        } else {
            callback(false);
        }
    }

    /**
     * Deletes the skill from the database (via _id)
     * @param callback Takes one argument based on the success of the delete operation
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(SKILLS_COLLECTION).deleteOne({ _id: new ObjectId(this._id) }, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

    /**
     * Load all of a user's skills
     *
     * @param user The user's email
     * @param callback Passes a list of skills belonging to the specified user
     */
    public static loadFromDatabase(user: string, callback: (skills: ISkill[]) => void): void {
        database
            .collection(SKILLS_COLLECTION)
            .find({ user })
            .toArray((err, skillset) => {
                if (err) callback([]);
                else callback(skillset || []);
            });
    }
}
