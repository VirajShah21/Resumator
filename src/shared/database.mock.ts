import { FilterQuery, MongoError } from 'mongodb';

export class MockCollection<TSchema extends Object> {
    public readonly name: string;
    private documents: TSchema[];

    public constructor(name: string, documents?: TSchema[]) {
        this.name = name;
        this.documents = documents ? documents : [];
    }

    public insertOne(doc: TSchema, callback?: () => void): void {
        this.documents.push(doc);
        if (callback) callback();
    }

    public findOne(
        filter: FilterQuery<TSchema>,
        callback?: (err: MongoError | null, result?: TSchema) => void
    ): void {
        let outDoc: TSchema | undefined = this.documents.find(
            (doc: TSchema) => {
                for (const prop in filter)
                    if (filter.hasOwnProperty(prop) && doc.hasOwnProperty(prop))
                        if (filter[prop] !== (doc as any)[prop]) return false;

                return true;
            }
        );

        if (outDoc && callback) callback(null, outDoc);
        else if (callback) callback(null, undefined);
    }

    public find(
        filter: FilterQuery<TSchema>,
        callback?: (err: MongoError | null, result?: TSchema) => void
    ): MockCollection<TSchema> {
        let docs: TSchema[] = this.documents.filter((doc: TSchema) => {
            for (const prop in filter)
                if (filter.hasOwnProperty(prop) && doc.hasOwnProperty(prop))
                    if (filter[prop] !== (doc as any)[prop]) return false;

            return true;
        });

        return new MockCollection(this.name, docs);
    }

    public toArray(
        callback: (err: MongoError | null, results: TSchema[]) => void
    ): void {
        callback(null, this.documents);
    }
}

export class MockDatabase {
    private collections: MockCollection<Object>[];

    public constructor() {
        this.collections = [];
    }

    public collection(collectionName: string): MockCollection<Object> {
        let col: MockCollection<Object> | undefined = this.collections.find(
            (col) => {
                if (col.name === collectionName) return true;
                else return false;
            }
        );

        if (col) return col;
        else {
            col = new MockCollection<Object>(collectionName);
            this.collections.push(col);
            return col;
        }
    }
}
