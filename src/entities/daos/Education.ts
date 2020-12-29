import { database } from '../../shared/database';
import { ObjectId } from 'mongodb';
import { validateEmail, validateMonthYearString } from '../../shared/functions';
import DataAccessObject, { IDaoConfig } from '../DataAccessObject';

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
export default class Education extends DataAccessObject implements IEducation {
    private static readonly _dao: IDaoConfig = { collection: 'education' };
    public user: string;
    public institution: string;
    public level: string;
    public degree: string;
    public start: string;
    public end: string;
    public gpa?: number;
    public description: string;

    /**
     * @param education The education object to construct
     */
    constructor(education: IEducation) {
        super(education._id, Education._dao);
        this.user = education.user.trim();
        this.institution = education.institution.trim();
        this.level = education.level.trim();
        this.degree = education.degree.trim();
        this.start = education.start.trim();
        this.end = education.end?.trim() || '';
        this.gpa = education.gpa ? +education.gpa : undefined;
        this.description = education.description?.trim() || '';
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
            .collection(Education._dao.collection)
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

    public validate(): boolean {
        const gpa: boolean = this.gpa ? +this.gpa > 0 && +this.gpa < 5 : true;
        const correctLength: boolean =
            this.institution.length > 0 &&
            this.level.length > 0 &&
            this.degree.length > 0;
        const dates: boolean =
            validateMonthYearString(this.start) &&
            (validateMonthYearString(this.end) || this.end === '');
        return validateEmail(this.user) && gpa && correctLength && dates;
    }
}
