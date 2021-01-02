import MockCollection from './collection.mock';
export default class MockDatabase {
    private collections: MockCollection<object>[];

    public constructor() {
        this.collections = [];
    }

    public collection(collectionName: string): MockCollection<object> {
        let col: MockCollection<object> | undefined = this.collections.find(
            (currCol) => {
                if (currCol.name === collectionName) return true;
                else return false;
            }
        );

        if (col) return col;
        else {
            col = new MockCollection<object>(collectionName);
            this.collections.push(col);
            return col;
        }
    }
}
