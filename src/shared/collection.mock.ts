import { FilterQuery, MongoError } from 'mongodb';

export default class MockCollection<TSchema extends object> {
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
        const outDoc: TSchema | undefined = this.documents.find(
            (doc: TSchema) => {
                for (const prop in filter) {
                    if (
                        filter.hasOwnProperty(prop) &&
                        doc.hasOwnProperty(prop)
                    ) {
                        const docPropDesc = Object.getOwnPropertyDescriptor(
                            doc,
                            prop
                        );

                        if (docPropDesc) {
                            const docProp = docPropDesc.value;
                            if (filter[prop] !== docProp) return false;
                        } else return false;
                    }
                }

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
        const docs: TSchema[] = this.documents.filter((doc: TSchema) => {
            for (const prop in filter) {
                if (filter.hasOwnProperty(prop) && doc.hasOwnProperty(prop)) {
                    const docPropDesc = Object.getOwnPropertyDescriptor(
                        doc,
                        prop
                    );

                    if (docPropDesc) {
                        const docProp = docPropDesc.value;
                        if (filter[prop] !== docProp) return false;
                    } else return false;
                }
            }

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
