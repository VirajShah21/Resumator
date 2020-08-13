import { database } from "@shared/database";
import { ObjectId } from "mongodb";
import { validateEmail, validateMonthYearString } from "@shared/functions";
import logger from "@shared/Logger";

const EDUCATION_COLLECTION = "education";

/**
 * Education interface
 */
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

/**
 * Education class
 */
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

    /**
     *
     * @param user The user's email address
     * @param institution The institution which this education object belongs to
     * @param level The level of education acquired
     * @param degree The degree/diploma received
     * @param start Start date
     * @param end End/Graduation Date
     * @param gpa Grade Point Average
     * @param description Description of study at the institution
     */
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

    /**
     * Inserts this object to the education database
     *
     * @param callback Callback upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        logger.info(`Adding education to database: ${JSON.stringify(this, null, 4)}`);
        if (this.validate()) {
            logger.info("All data is valid");
            database.collection(EDUCATION_COLLECTION).insertOne(this, (err, result) => {
                if (err) {
                    logger.error(err);
                    callback(false);
                } else {
                    logger.info(`Work experience added: ${JSON.stringify(this, null, 4)}`);
                    callback(true);
                }
            });
        } else {
            logger.info(`Found invalid data: ${JSON.stringify(this, null, 4)}`);
            callback(false);
        }
    }

    /**
     * Updates this item in the database
     *
     * @param callback Callback upon completion
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(EDUCATION_COLLECTION).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err, result) => {
                    if (err) callback(false);
                    else callback(true);
                }
            );
        } else {
            callback(false);
        }
    }

    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(EDUCATION_COLLECTION).deleteOne({ _id: new ObjectId(this._id) }, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

    /**
     * Loads a list of education history belonging to the user
     *
     * @param email The email to lookup
     * @param callback The callback passing the education history for the user
     */
    public static loadFromDatabase(email: string, callback: (eduHistory: Education[]) => void): void {
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

    /**
     * @returns True if all fields are valid; false otherwise
     */
    public validate(): boolean {
        return (
            this.validateUser() &&
            this.validateInstitution() &&
            this.validateLevel() &&
            this.validateDegree() &&
            this.validateStartAndEnd() &&
            this.validateGpa() &&
            this.validateDescription()
        );
    }

    private validateUser(): boolean {
        logger.info(`Validate User (${this.user} = ${validateEmail(this.user)})`);
        return validateEmail(this.user);
    }

    private validateInstitution(): boolean {
        logger.info(`Validate Institution (${this.institution} = ${this.institution.length > 0})`);
        return this.institution.length > 0;
    }

    private validateLevel(): boolean {
        logger.info(`Validate Level (${this.level} = ${this.level.length > 0})`);
        return this.level.length > 0;
    }

    private validateDegree(): boolean {
        logger.info(`Validate Degree (${this.degree} = ${this.degree.length > 0})`);
        return this.degree.length > 0;
    }

    private validateStartAndEnd(): boolean {
        logger.info(`Validate Start Date (${this.start} = ${validateMonthYearString(this.start)})`);
        logger.info(`Validate End Date (${this.end} = ${validateMonthYearString(this.end)})`);
        return validateMonthYearString(this.start) && validateMonthYearString(this.end);
    }

    private validateGpa(): boolean {
        logger.info(`Validate GPA (${this.gpa} = ${this.gpa > 0 && this.gpa <= 5})`);
        return this.gpa > 0 && this.gpa <= 5;
    }

    private validateDescription(): boolean {
        logger.info(`Validate Description (${this.description} = ${this.description !== undefined})`);
        return this.description !== undefined;
    }
}
