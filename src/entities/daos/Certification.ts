import { ObjectId } from "mongodb";
import { database } from "@shared/database";
import { validateMonthYearString } from "@shared/functions";

const CERT_COLLECTION = "certifications";

export interface ICertification {
    _id: ObjectId;
    institution: string;
    certification: string;
    details: string;
    examDate: string;
    user: string;
}

export default class Certification implements ICertification {
    public _id: ObjectId;
    public institution: string;
    public certification: string;
    public details: string;
    public examDate: string;
    public user: string;

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

    public validate(): boolean {
        return (
            this.institution.trim().length > 0 &&
            this.certification.trim().length > 0 &&
            validateMonthYearString(this.examDate)
        );
    }

    public insertDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(CERT_COLLECTION).insertOne(this, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

    public updateDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(CERT_COLLECTION).updateOne(
            { _id: this._id },
            {
                $set: this,
            },
            (err) => {
                if (err) callback(false);
                else callback(true);
            }
        );
    }

    public deleteDatabaseItem(callback: (success: boolean) => void): void {
        database.collection(CERT_COLLECTION).deleteOne({ _id: new ObjectId(this._id) }, (err) => {
            if (err) callback(false);
            else callback(true);
        });
    }

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
