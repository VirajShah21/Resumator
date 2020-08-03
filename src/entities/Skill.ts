import { ObjectId } from "mongodb";
import { database } from "@shared/database";

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
            this.name = name;
            this.proficiency = proficiency || 1;
            this.user = user || "";
        } else {
            this._id = name._id;
            this.name = name.name;
            this.proficiency = name.proficiency;
            this.user = name.user;
        }
    }

    public insertDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(SKILLS_COLLECTION).insert(this, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

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
