import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import { validateEmail, validateDateString } from "@shared/functions";

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
        start?: string,
        end?: string,
        description?: string,
        user?: string
    ) {
        if (typeof position == "string") {
            this._id = new ObjectId();
            this.position = position;
            this.organization = organization || "";
            this.description = description || "";
            this.user = user || "";
            this.start = start || "";
            this.end = end || "";
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
        database.collection(WORK_EXPERIENCE_COLLECTION).insertOne(this, (err, result) => {
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

    public static loadFromDatabase(email: string, callback?: (workExperiences: WorkExperience[]) => void): void {
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

    public validate(): boolean {
        return (
            this.validateUser() &&
            this.validatePosition() &&
            this.validateOrganization() &&
            this.validateStartAndEnd() &&
            this.validateDescription()
        );
    }

    private validateUser(): boolean {
        return validateEmail(this.user);
    }

    private validatePosition(): boolean {
        return this.position.length > 0;
    }

    private validateOrganization(): boolean {
        return this.organization.length > 0;
    }

    private validateStartAndEnd(): boolean {
        return validateDateString(this.start) && validateDateString(this.end);
    }

    private validateDescription(): boolean {
        return this.description.length > 0;
    }
}
