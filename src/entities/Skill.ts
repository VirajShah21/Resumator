import { ObjectId } from "mongodb";

/**
 * Skill interface
 */
export interface ISkill {
    _id: ObjectId;
    category: string;
    subcategory: string;
    name: string;
    proficiency: number;
}

/**
 * Skill class
 */
export default class Skill implements ISkill {
    public _id: ObjectId;
    public category: string;
    public subcategory: string;
    public name: string;
    public proficiency: number;

    /**
     *
     * @param category The category which this skill belongs to OR an ISkill
     * @param subcategory The subcategory which this skill belongs to; defaults to ""
     * @param name The name of this skill; defaults to ""
     * @param proficiency The proficiency the user has in this skill; defaults to 1 (out of 100)
     */
    constructor(category: string | ISkill, subcategory?: string, name?: string, proficiency?: number) {
        if (typeof category == "string") {
            this._id = new ObjectId();
            this.category = category;
            this.subcategory = subcategory || "";
            this.name = name || "";
            this.proficiency = proficiency || 1;
        } else {
            this._id = category._id;
            this.category = category.category;
            this.subcategory = category.subcategory;
            this.name = category.name;
            this.proficiency = category.proficiency;
        }
    }
}
