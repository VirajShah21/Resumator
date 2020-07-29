import { database } from "@shared/database";
import { ObjectId } from "mongodb";

const EDUCATION_COLLECTION = "education";

export interface IEducation {
    _id: ObjectId;
    user: string;
    institution: string;
    level: string;
    degree: string;
    start: string;
    end: string;
    gpa: number;
    description: string;
}

export default class Education implements IEducation {
    public _id: ObjectId;
    public user: string;
    public institution: string;
    public level: string;
    public degree: string;
    public start: string;
    public end: string;
    public gpa: number;
    public description: string;

    constructor(
        user: string | IEducation,
        institution?: string,
        level?: string,
        degree?: string,
        start?: string,
        end?: string,
        gpa?: number,
        description?: string
    ) {
        if (typeof user == "string") {
            this.user = user;
            this.institution = institution || "";
            this.level = level || "";
            this.degree = degree || "";
            this.start = start || "";
            this.end = end || "";
            this.gpa = gpa || 0;
            this.description = description || "";
            this._id = new ObjectId();
        } else {
            this.user = user.user;
            this.institution = user.institution;
            this.level = user.level;
            this.degree = user.degree;
            this.start = user.start;
            this.end = user.end;
            this.gpa = user.gpa;
            this.description = user.description;
            this._id = user._id;
        }
    }

    public insertDatabaseItem(callback?: () => void): void {
        database.collection(EDUCATION_COLLECTION).insert(this, (err, result) => {
            if (callback) callback();
        });
    }

    public updateDatabaseItem(callback?: () => void): void {
        database.collection(EDUCATION_COLLECTION).updateOne(
            {
                _id: this._id,
            },
            {
                $set: this,
            },
            (err, result) => {
                if (callback) callback();
            }
        );
    }

    public static loadFromDatabase(email: string, callback?: (eduHistory: Education[]) => void): void {
        database
            .collection(EDUCATION_COLLECTION)
            .find({ user: email })
            .toArray((err, result) => {
                if (callback) {
                    callback(
                        result.map((item) => {
                            return new Education(item);
                        })
                    );
                }
            });
    }
}
