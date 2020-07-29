import { database } from "@shared/database";
import { ObjectId } from "mongodb";

const WORK_EXPERIENCE_COLLECTION = "work-experience";

export interface IWorkExperience {
    _id: ObjectId;
    position: string;
    organization: string;
    start: string;
    end: string;
    description: string;
    user: string;
}

export default class WorkExperience {
    public _id: ObjectId;
    public user: string;
    public position: string;
    public organization: string;
    public start: string;
    public end: string;
    public description: string;

    constructor(
        position: string | IWorkExperience,
        organization?: string,
        start?: string | Date,
        end?: string | Date,
        description?: string,
        user?: string
    ) {
        if (typeof position == "string") {
            this.position = position;
            this.organization = organization || "";
            this.description = description || "";
            this.user = user || "";
            this._id = new ObjectId();
            if (start) {
                if (typeof start != "string") {
                    const month = start.getMonth() + 1;
                    const date = start.getDate();
                    const year = start.getFullYear();
                    this.start = `${month}/${date}/${year}`;
                } else {
                    this.start = start;
                }
            } else {
                this.start = "1/1/2020";
            }
            if (end) {
                if (typeof end != "string") {
                    const month = end.getMonth() + 1;
                    const date = end.getDate();
                    const year = end.getFullYear();
                    this.end = `${month}/${date}/${year}`;
                } else {
                    this.end = end;
                }
            } else {
                this.end = "1/1/2020";
            }
        } else {
            this._id = position._id;
            this.position = position.position;
            this.organization = position.organization;
            this.start = position.start;
            this.end = position.end;
            this.description = position.description;
            this.user = position.user;
        }
    }

    public insertDatabaseItem(callback?: () => void): void {
        database
            .collection(WORK_EXPERIENCE_COLLECTION)
            .insert(this, (err, result) => {
                if (callback) callback();
            });
    }

    public updateDatabaseItem(callback?: () => void): void {
        database.collection(WORK_EXPERIENCE_COLLECTION).updateOne(
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

    public static loadFromDatabase(
        email: string,
        callback?: (workExperiences: WorkExperience[]) => void
    ): void {
        database
            .collection(WORK_EXPERIENCE_COLLECTION)
            .find({ user: email })
            .toArray((err, work: IWorkExperience[]) => {
                if (callback) {
                    callback(
                        work.map((item) => {
                            return new WorkExperience(item);
                        })
                    );
                }
            });
    }
}
