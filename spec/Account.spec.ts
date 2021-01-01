import { Collection, FilterQuery, MongoError } from 'mongodb';
import { ObjectId } from 'mongodb';
import Account from '../src/entities/daos/Account';
import { database, setMockDatabase } from '../src/shared/database';

let account: Account = new Account({
    _id: new ObjectId(),
    fname: 'Viraj',
    lname: 'Shah',
    email: 'test@test.com',
    emailVerified: true,
    password: '$2b$wjifojwiojoi',
});

describe('Testing Account initialization', () => {
    setMockDatabase({
        collection: <TSchema>(name: string): Collection<TSchema> => {
            return name == 'accounts'
                ? (({
                      findOne: (
                          filter: FilterQuery<unknown>,
                          callback?: (err: unknown, result?: Account) => void
                      ): void => {
                          if (
                              (filter as { email: string }).email !==
                                  undefined ||
                              (filter as { _id: ObjectId })._id !== undefined
                          ) {
                              if (callback) callback(undefined, account);
                          } else {
                              if (callback)
                                  callback(
                                      new MongoError('No good query specified')
                                  );
                          }
                      },
                  } as unknown) as Collection<TSchema>)
                : ({} as Collection<TSchema>);
        },
    });

    it('Should construct an account', (done) => {
        expect(account).toBeInstanceOf(Account);
        done();
    });

    it('Should construct an account from a database pull', () => {
        Account.loadFromDatabase('test@test.com', (account) => {
            expect(account).toBeInstanceOf(Account);
        });

        Account.loadFromDatabaseById(new ObjectId(), (account) => {
            expect(account).toBeInstanceOf(Account);
        });
    });
});

describe('Testing validators', () => {
    it('The account should be valid', () => {
        expect(account.validate()).toBe(true);
    });
});
