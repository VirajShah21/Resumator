import { database } from '@shared/database';
import { ObjectId } from 'mongodb';
import { validateEmail, validateMonthYearString } from '@shared/functions';
import Entity from '../Entity';

const WORK_EXPERIENCE_COLLECTION = 'work-experience';

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
export default class WorkExperience extends Entity implements IWorkExperience {
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
        super();
        if (typeof position === 'string') {
            this._id = new ObjectId();
            this.position = position.trim();
            this.organization = organization?.trim() || '';
            this.description = description?.trim() || '';
            this.user = user?.trim() || '';
            this.start = start?.trim() || '';
            this.end = end?.trim() || '';
        } else {
            this._id = position._id;
            this.position = position.position.trim();
            this.organization = position.organization.trim();
            this.start = position.start.trim();
            this.end = position.end.trim();
            this.description = position.description.trim();
            this.user = position.user.trim();
        }
    }

    /**
     * Insert this object to the work experiences database
     *
     * @param callback The callback upon completion
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database
                .collection(WORK_EXPERIENCE_COLLECTION)
                .insertOne(this, (err, result) => {
                    callback(err ? false : true);
                });
        } else callback(false);
    }

    /**
     * Update this item in the database
     *
     * @param callback The callback upon completion
     */
    public updateDatabaseItem(callback?: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(WORK_EXPERIENCE_COLLECTION).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err) => {
                    if (callback) callback(err ? false : true);
                }
            );
        } else if (callback) callback(false);
    }

    /**
     * Deletes this object from the database
     *
     * @param callback The callback upon deleting database item
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database
            .collection(WORK_EXPERIENCE_COLLECTION)
            .deleteOne({ _id: new ObjectId(this._id) }, (err) => {
                callback(err ? false : true);
            });
    }

    /**
     * Load a list of the user's work experience
     *
     * @param email The user's email to lookup
     * @param callback The callback passing all work history as an array upon completion
     */
    public static loadFromDatabase(
        email: string,
        callback: (workExperiences: WorkExperience[]) => void
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

    protected validateEnd(): boolean {
        return validateMonthYearString(this.end) || this.end === '';
    }

    protected validateOrganization(): boolean {
        return this.organization.length > 0;
    }

    protected validatePosition(): boolean {
        return this.position.length > 0;
    }

    protected validateStart(): boolean {
        return validateMonthYearString(this.start);
    }

    protected validateUser(): boolean {
        return validateEmail(this.user);
    }
}
