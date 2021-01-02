import { ObjectId } from 'mongodb';
import MockDatabase from '../src/shared/database.mock';
import Award from '../src/entities/daos/Award';
import { database, setMockDatabase } from '../src/shared/database';

describe('Testing Award DAO', () => {
    setMockDatabase(new MockDatabase());

    database.collection('award').insertOne(
        new Award({
            _id: new ObjectId(),
            name: 'Test Suite of the Year',
            user: 'test@test.com',
        })
    );

    it('Should be loaded from database', (done) => {
        Award.loadFromDatabase('test@test.com', (awards) => {
            expect(awards.length).toBe(1);
            expect(awards[0].user).toBe('test@test.com');
            expect(awards[0].name).toBe('Test Suite of the Year');
            done();
        });
    });
});
