import { database } from '../shared/database';
import { ObjectId } from 'mongodb';
import Entity from './Entity';

export interface IDaoConfig {
    collection: string;
}

export default abstract class DataAccessObject extends Entity {
    protected _dao: IDaoConfig;
    public _id: ObjectId;

    public constructor(_id: ObjectId, _dao: IDaoConfig) {
        super();
        this._dao = _dao;
        this._id = new ObjectId(_id);
    }

    /**
     * Inserts this object to the accounts database
     *
     * @param callback The function to call upon completion
     */
    public insertDatabaseItem(callback: (success?: boolean) => void): void {
        if (this.validate())
            database
                .collection(this._dao.collection)
                .insertOne(this, (err, result) => {
                    callback(err ? false : true);
                });
        else callback(false);
    }

    /**
     * Updates this DAO
     *
     * @param callback The function call upon completion
     */
    public updateDatabaseItem(callback: (success: boolean) => void): void {
        if (this.validate())
            database.collection(this._dao.collection).updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                },
                (err) => {
                    callback(err ? false : true);
                }
            );
        else callback(false);
    }

    /**
     * Delete the DAO from the database (based on _id)
     *
     * @param callback Takes an argument based on the success of the delete operation
     */
    public deleteDatabaseItem(callback: (success?: boolean) => void): void {
        database
            .collection(this._dao.collection)
            .deleteOne({ _id: new ObjectId(this._id) }, (err) => {
                callback(err ? false : true);
            });
    }
}
