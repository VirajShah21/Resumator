import { Collection, FilterQuery, MongoError } from 'mongodb';
import { ObjectId } from 'mongodb';
import { MockDatabase } from '../src/shared/database.mock';
import Account from '../src/entities/daos/Account';
import { database, setMockDatabase } from '../src/shared/database';

setMockDatabase(new MockDatabase());
const accountId: ObjectId = new ObjectId();
const account: Account = new Account({
    _id: accountId,
    fname: 'Viraj',
    lname: 'Shah',
    email: 'test@test.com',
    emailVerified: true,
    password: '$2b$wjifojwiojoi',
});

database.collection('accounts').insertOne(account);

describe('Testing Account initialization', () => {
    it('Should verify an account was constructed', (done) => {
        expect(account).toBeInstanceOf(Account);
        done();
    });

    it('Should construct an account from a database pull', () => {
        Account.loadFromDatabase('test@test.com', (loadedAccount) => {
            expect(loadedAccount).toBeInstanceOf(Account);
        });

        Account.loadFromDatabaseById(accountId, (loadedAccount) => {
            expect(loadedAccount).toBeInstanceOf(Account);
        });
    });
});

describe('Testing Account Insertion', () => {
    it('Should cleanly insert account to db', () => {
        const newAccount = new Account({
            _id: new ObjectId(),
            fname: 'Other',
            lname: 'User',
            email: 'other.user@gmail.com',
            emailVerified: true,
            password: '$2b$sjfiojro',
        });
        newAccount.insertDatabaseItem((success) => {
            expect(success).toBe(true);
        });
    });

    it('Should notify that the account already exists', () => {
        const newAccount = new Account({
            _id: new ObjectId(),
            fname: 'Other',
            lname: 'User',
            email: 'test@test.com',
            emailVerified: false,
            password: '$2b$sjfiojro',
        });
        newAccount.insertDatabaseItem((success) => {
            expect(success).toBe(false);
        });
    });
});

describe('Testing validators', () => {
    it('The account should be valid', () => {
        expect(account.validate()).toBe(true);
    });
});
