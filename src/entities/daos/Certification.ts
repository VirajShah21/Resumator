import { ObjectId } from 'mongodb';
import { database } from '@shared/database';
import { validateMonthYearString, validateEmail } from '@shared/functions';
import DataAccessObject, { IDaoConfig } from '../DataAccessObject';

const CERT_COLLECTION = 'certifications';

/**
 * Certification interface
 */
export interface ICertification {
    _id: ObjectId;
    institution: string;
    certification: string;
    details?: string;
    examDate: string;
    user: string;
}

/**
 * Certification class
 */
export default class Certification
    extends DataAccessObject
    implements ICertification {
    private static readonly _dao: IDaoConfig = { collection: 'certifications' };
    public _id: ObjectId;
    public institution: string;
    public certification: string;
    public details: string;
    public examDate: string;
    public user: string;

    /**
     * Constructs a Certification DAO
     * @param certification The certification object to construct
     */
    constructor(certification: ICertification) {
        super(certification._id, Certification._dao);
        this._id = new ObjectId(certification._id);
        this.institution = certification.institution.trim();
        this.certification = certification.certification.trim();
        this.details = certification.details?.trim() || '';
        this.examDate = certification.examDate.trim();
        this.user = certification.user.trim();
    }

    /**
     * Load a list of certifications from the data
     *
     * @param user The user's email
     * @param callback The callback containing a list of certifications as the only argument
     */
    public static loadFromDatabase(
        user: string,
        callback: (certifications: Certification[]) => void
    ): void {
        database
            .collection(CERT_COLLECTION)
            .find({ user })
            .toArray((err, results) => {
                callback(
                    err || !results
                        ? []
                        : results.map((cert) => {
                              return new Certification(cert);
                          })
                );
            });
    }

    public validate(): boolean {
        return (
            this.certification.length > 0 &&
            validateMonthYearString(this.examDate) &&
            this.institution.length > 0 &&
            validateEmail(this.user)
        );
    }
}
