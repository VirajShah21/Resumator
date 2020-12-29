import { database } from '../../shared/database';
import { ObjectId } from 'mongodb';
import { validateEmail, validateMonthYearString } from '../../shared/functions';
import DataAccessObject, { IDaoConfig } from '../DataAccessObject';

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
export default class WorkExperience
    extends DataAccessObject
    implements IWorkExperience {
    private static readonly _dao: IDaoConfig = {
        collection: 'work-experience',
    };
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
        if (typeof position === 'string') {
            super(new ObjectId(), WorkExperience._dao);
            this.position = position.trim();
            this.organization = organization?.trim() || '';
            this.description = description?.trim() || '';
            this.user = user?.trim() || '';
            this.start = start?.trim() || '';
            this.end = end?.trim() || '';
        } else {
            super(position._id, WorkExperience._dao);
            this.position = position.position.trim();
            this.organization = position.organization.trim();
            this.start = position.start.trim();
            this.end = position.end.trim();
            this.description = position.description.trim();
            this.user = position.user.trim();
        }
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
            .collection(WorkExperience._dao.collection)
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
        const dates: boolean =
            validateMonthYearString(this.start) && this.end.length
                ? validateMonthYearString(this.end)
                : false;
        return (
            dates &&
            this.organization.length > 0 &&
            this.position.length > 0 &&
            validateEmail(this.user)
        );
    }
}
