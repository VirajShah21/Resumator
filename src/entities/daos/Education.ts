import { database } from '@shared/database';
import { ObjectId } from 'mongodb';
import { validateEmail, validateMonthYearString } from '@shared/functions';
import Entity from '../Entity';

const EDUCATION_COLLECTION = 'education';

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
    end?: string;
    gpa?: number;
    description?: string;
}

/**
 * Education class
 */
export default class Education extends Entity implements IEducation {
    public _id: ObjectId;
    public user: string;
    public institution: string;
    public level: string;
    public degree: string;
    public start: string;
    public end: string;
    public gpa?: number;
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
    constructor(education: IEducation) {
        super();
        this.user = education.user.trim();
        this.institution = education.institution.trim();
        this.level = education.level.trim();
        this.degree = education.degree.trim();
        this.start = education.start.trim();
        this.end = education.end?.trim() || '';
        this.gpa = education.gpa ? +education.gpa : undefined;
        this.description = education.description?.trim() || '';
        this._id = new ObjectId(education._id);
    }

    /**
     * Inserts this object to the education database
     *
     * @param callback Callback upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate())
            database
                .collection(EDUCATION_COLLECTION)
                .insertOne(this, (err, result) => {
                    callback(err ? false : true);
                });
        else callback(false);
    }

    /**
     * Updates this item in the database
     *
     * @param callback Callback upon completion
     */
    public updateDatabaseItem(callback?: (success: boolean) => void): void {
        if (this.validate())
            database.collection(EDUCATION_COLLECTION).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err, result) => {
                    if (callback) callback(err ? false : true);
                }
            );
        else if (callback) callback(false);
    }

    /**
     * Delete the DAO from the database (based on _id)
     *
     * @param callback Takes an argument based on the success of the delete operation
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database
            .collection(EDUCATION_COLLECTION)
            .deleteOne({ _id: new ObjectId(this._id) }, (err) => {
                callback(err ? false : true);
            });
    }

    /**
     * Loads a list of education history belonging to the user
     *
     * @param email The email to lookup
     * @param callback The callback passing the education history for the user
     */
    public static loadFromDatabase(
        email: string,
        callback: (eduHistory: Education[]) => void
    ): void {
        database
            .collection(EDUCATION_COLLECTION)
            .find({ user: email })
            .toArray((err, result) => {
                callback(
                    err
                        ? []
                        : result.map((item) => {
                              return new Education(item);
                          })
                );
            });
    }

    protected validateUser(): boolean {
        return validateEmail(this.user);
    }

    protected validateInstitution(): boolean {
        return this.institution.length > 0;
    }

    protected validateLevel(): boolean {
        return this.level.length > 0;
    }

    protected validateDegree(): boolean {
        return this.degree.length > 0;
    }

    protected validateStart(): boolean {
        return validateMonthYearString(this.start);
    }

    protected validateEnd(): boolean {
        return validateMonthYearString(this.end) || this.end === '';
    }

    protected validateGpa(): boolean {
        if (this.gpa === undefined) return true;
        return +this.gpa > 0 && +this.gpa < 5;
    }

    protected getValidators(): (() => boolean)[] {
        return [
            this.validateDegree,
            this.validateEnd,
            this.validateGpa,
            this.validateInstitution,
            this.validateLevel,
            this.validateStart,
            this.validateUser,
        ];
    }
}
