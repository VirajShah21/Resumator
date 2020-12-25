import { database } from '@shared/database';

export default abstract class Entity {
    // private static mongodb: {
    //     collection: string; // the mongodb collection name
    // };

    public abstract validate(): boolean;

    // public insertDatabaseItem(callback: (success: boolean) => void): void {
    //     if (this.validate())
    //         database
    //             .collection(Entity.mongodb.collection)
    //             .insertOne(this, (err, result) => {
    //                 callback(err ? false : true);
    //             });
    //     else callback(false);
    // }
}
