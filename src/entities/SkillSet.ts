import { ObjectId } from "mongodb";
import { ISkill } from "./Skill";

/**
 * SkillSet interface
 */
export interface ISkillSet {
    _id: ObjectId;
    user: string;
    skills: ISkill[];
}

/**
 * SkillSet class
 */
export default class SkillSet {
    public _id: ObjectId;
    public user: string;
    public skills: ISkill[];

    /**
     *
     * @param user The user's email OR an ISkillSet
     * @param skills A list of ISkills. Defaults to []
     */
    constructor(user: string | ISkillSet, skills?: ISkill[]) {
        if (typeof user == "string") {
            this._id = new ObjectId();
            this.user = user;
            this.skills = skills || [];
        } else {
            this._id = user._id;
            this.user = user.user;
            this.skills = user.skills;
        }
    }
}
