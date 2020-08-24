import { ObjectId } from "mongodb";
import { database } from "@shared/database";
import { validateMonthYearString, validateEmail } from "@shared/functions";
import logger from "@shared/Logger";

const CERT_COLLECTION = "certifications";

/**
 * Certification interface
 */
export interface ICertification {
    _id: ObjectId;
    institution: string;
    certification: string;
    details: string;
    examDate: string;
    user: string;
}

/**
 * Certification class
 */
export default class Certification implements ICertification {
    public _id: ObjectId;
    public institution: string;
    public certification: string;
    public details: string;
    public examDate: string;
    public user: string;

    /**
     * Constructs a Certification DAO
     * @param institution The institution which the certification belongs to
     * @param certification The name of the certification
     * @param details Additional details about the certification
     * @param examDate The date which the certification exam was taken
     * @param user The user's email
     */
    constructor(
        institution: string | ICertification,
        certification?: string,
        details?: string,
        examDate?: string,
        user?: string
    ) {
        if (typeof institution == "string") {
            this._id = new ObjectId();
            this.institution = institution;
            this.certification = certification || "";
            this.details = details || "";
            this.examDate = examDate || "";
            this.user = user || "";
        } else {
            this._id = new ObjectId(institution._id);
            this.institution = institution.institution;
            this.certification = institution.certification;
            this.details = institution.details;
            this.examDate = institution.examDate;
            this.user = institution.user;
        }
    }

    /**
     * Checks if the certifications fields are valid
     *
     * @returns True if all fields are valid; false otherwise
     */
    public validate(): boolean {
        return (
            this.validateInstitution() && this.validateCertification && this.validateExamDate() && this.validateUser()
        );
    }

    private validateInstitution(): boolean {
        logger.info(`Validate Institution (${this.institution} = ${this.institution.length > 0})`);
        return this.institution.length > 0;
    }

    private validateCertification(): boolean {
        logger.info(`Validate Certification (${this.certification} = ${this.certification.length > 0})`);
        return this.certification.length > 0;
    }

    private validateExamDate(): boolean {
        logger.info(`Validate Exam Date (${this.examDate} = ${validateMonthYearString(this.examDate)})`);
        return validateMonthYearString(this.examDate);
    }

    private validateUser(): boolean {
        logger.info(`Validate User (${this.user} = ${validateEmail(this.user)})`);
        return validateEmail(this.user);
    }

    /**
     * Inserts the DAO to the database
     *
     * @param callback The callback once inserting is complete
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(CERT_COLLECTION).insertOne(this, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

    /**
     * Updated the DAO in the databse
     *
     * @param callback The callback once updating is complete
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(CERT_COLLECTION).updateOne(
                { _id: new ObjectId(this._id) },
                {
                    $set: this,
                },
                (err) => {
                    if (err) {
                        logger.info(`Could not update certification ${JSON.stringify(this, null, 4)} Database Error`);
                        logger.error(err);
                        callback(false);
                    } else {
                        logger.info(`Updated certification ${JSON.stringify(this, null, 4)}`);
                        callback(true);
                    }
                }
            );
        } else {
            logger.warn(`Could not update certification ${JSON.stringify(this, null, 4)} Invalid Data`);
            callback(false);
        }
    }

    /**
     * Deletes the DAO (by ID) from the database
     * @param callback The callback once deletion is done
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(CERT_COLLECTION).deleteOne({ _id: new ObjectId(this._id) }, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

    /**
     * Load a list of certifications from the data
     *
     * @param user The user's email
     * @param callback The callback containing a list of certifications as the only argument
     */
    public static loadFromDatabase(user: string, callback: (certifications: Certification[]) => void): void {
        database
            .collection(CERT_COLLECTION)
            .find({ user })
            .toArray((err, results) => {
                if (err) throw err;
                else if (!results) callback([]);
                else
                    callback(
                        results.map((cert) => {
                            return new Certification(cert);
                        })
                    );
            });
    }
}
