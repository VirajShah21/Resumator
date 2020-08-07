import { ObjectId } from "mongodb";
import { database } from "@shared/database";

const CERT_COLLECTION = "certifications";

export interface ICertification {
    _id: ObjectId;
    institution: string;
    certification: string;
    details: string;
}

export default class Certification implements ICertification {
    public _id: ObjectId;
    public institution: string;
    public certification: string;
    public details: string;

    constructor(institution: string | ICertification, certification?: string, details?: string) {
        if (typeof institution == "string") {
            this._id = new ObjectId();
            this.institution = institution;
            this.certification = certification || "";
            this.details = details || "";
        } else {
            this._id = new ObjectId(institution._id);
            this.institution = institution.institution;
            this.certification = institution.certification;
            this.details = institution.details;
        }
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
