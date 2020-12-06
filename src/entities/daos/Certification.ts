import { ObjectId } from "mongodb";
import { database } from "@shared/database";
import { validateMonthYearString, validateEmail } from "@shared/functions";
import Logger from "@shared/Logger";

const CERT_COLLECTION = "certifications";

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
export default class Certification implements ICertification {
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
        this._id = certification._id;
        this.institution = certification.institution.trim();
        this.certification = certification.certification.trim();
        this.details = certification.details?.trim() || "";
        this.examDate = certification.examDate.trim();
        this.user = certification.user.trim();
    }

    /**
     * Checks if the certifications fields are valid
     *
     * @returns True if all fields are valid; false otherwise
     */
    public validate(): boolean {
        return (
            this.institution.length > 0 &&
            this.certification.length > 0 &&
            validateMonthYearString(this.examDate) &&
            validateEmail(this.user)
        );
    }

    /**
     * Inserts the DAO to the database
     *
     * @param callback The callback once inserting is complete
     */
    public insertDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            database.collection(CERT_COLLECTION).insertOne(this, (err) => {
                if (err) callback(false);
                else callback(true);
            });
        } else {
            Logger.warn(
                `Could not update certification ${JSON.stringify(
                    this,
                    null,
                    4
                )} Invalid Data`
            );
            callback(false);
        }
    }

    /**
     * Updated the DAO in the databse
     *
     * @param callback The callback once updating is complete
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate()) {
            Logger.info(
                `Certification (${this._id}) is valid and will be updated`
            );
            database.collection(CERT_COLLECTION).updateOne(
                { _id: new ObjectId(this._id) },
                {
                    $set: this,
                },
                (err) => {
                    if (err) {
                        Logger.warn(
                            `Could not update certification ${JSON.stringify(
                                this,
                                null,
                                4
                            )} Database Error`
                        );
                        Logger.error(err);
                        callback(false);
                    } else {
                        Logger.info(
                            `Updated certification ${JSON.stringify(
                                this,
                                null,
                                4
                            )}`
                        );
                        callback(true);
                    }
                }
            );
        } else {
            Logger.warn(
                `Could not update certification ${JSON.stringify(
                    this,
                    null,
                    4
                )} Invalid Data`
            );
            callback(false);
        }
    }

    /**
     * Deletes the DAO (by ID) from the database
     * @param callback The callback once deletion is done
     */
    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database
            .collection(CERT_COLLECTION)
            .deleteOne({ _id: new ObjectId(this._id) }, (err) => {
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
    public static loadFromDatabase(
        user: string,
        callback: (certifications: Certification[]) => void
    ): void {
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
