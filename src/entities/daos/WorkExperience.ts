import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import { validateEmail, validateMonthYearString } from "@shared/functions";
import Logger from "@shared/Logger";

const WORK_EXPERIENCE_COLLECTION = "work-experience";

/**
 * Work experience interface
 */
export interface IWorkExperience {
    _id: ObjectId;
    position: string;
    organization: string;
    start: string;
    end: string;
    description: string;
    user: string;
}

/**
 * Work experience class
 */
export default class WorkExperience {
    public _id: ObjectId;
    public user: string;
    public position: string;
    public organization: string;
    public start: string;
    public end: string;
    public description: string;

    /**
     *
     * @param position The job/position
     * @param organization The organization at which this experience occured
     * @param start The start date
     * @param end The end date
     * @param description The job description
     * @param user The user's email
     */
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

    /**
     * Insert this object to the work experiences database
     *
     * @param callback The callback upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(WORK_EXPERIENCE_COLLECTION).insertOne(this, (err, result) => {
                if (err) {
                    Logger.info(`Could not add work experience. ${JSON.stringify(this, null, 4)} Database Error`);
                    Logger.error(err);
                    callback(false);
                } else {
                    Logger.info(`Work experience added: ${JSON.stringify(this, null, 4)} All data is valid`);
                    callback(true);
                }
            });
        } else {
            Logger.warn(`Could not add work experience: ${JSON.stringify(this, null, 4)} Found invalid data`);
            callback(false);
        }
    }

    /**
     * Update this item in the database
     *
     * @param callback The callback upon completion
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(WORK_EXPERIENCE_COLLECTION).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err) => {
                    if (err) {
                        Logger.info(`Could not add work experience: ${JSON.stringify(this, null, 4)} Database Error`);
                        Logger.error(err);
                        callback(false);
                    } else {
                        Logger.info(`Work experience added: ${JSON.stringify(this, null, 4)}`);
                        callback(true);
                    }
                }
            );
        } else {
            Logger.info(`Could not add work experience: ${JSON.stringify(this, null, 4)} Found invalid data`);
            callback(false);
        }
    }

    /**
     * Deletes this object from the database
     *
     * @param callback The callback upon deleting database item
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(WORK_EXPERIENCE_COLLECTION).deleteOne({ _id: new ObjectId(this._id) }, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

    /**
     * Load a list of the user's work experience
     *
     * @param email The user's email to lookup
     * @param callback The callback passing all work history as an array upon completion
     */
    public static loadFromDatabase(email: string, callback: (workExperiences: WorkExperience[]) => void): void {
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

    /**
     * @returns True if all fields are valid; false otherwise
     */
    public validate(): boolean {
        return (
            validateEmail(this.user) &&
            this.position.length > 0 &&
            this.organization.length > 0 &&
            this.validateStartAndEnd()
        );
    }

    /**
     * Checks if the stard and end dates are in the format mm/YYYY (end can be left blank)
     *
     * @returns True if start and end dates are valid; false otherwise
     */
    private validateStartAndEnd(): boolean {
        return validateMonthYearString(this.start) && (validateMonthYearString(this.end) || this.end === "");
    }
}
