import { ObjectId } from 'mongodb';
import { assertDefined } from '../src/shared/functions';
import Account from '../src/entities/daos/Account';
import {
    sendVerificationEmail,
    VerifyEmailToken,
    verifyEmailTokens,
} from '../src/routes/AccountRouter';
import { database, setMockDatabase } from '../src/shared/database';
import MockDatabase from '../src/shared/database.mock';
import Session from '../src/entities/daos/Session';

describe('Email verification', () => {
    it('Should add email to the list of verification tokens', (done) => {
        setMockDatabase(new MockDatabase());
        const myAccount: Account = new Account({
            _id: new ObjectId(),
            fname: 'Viraj',
            lname: 'Shah',
            email: 'test@test.com',
            password: '$2b$jiojwraiojo',
            emailVerified: false,
        });
        database.collection('accounts').insertOne(myAccount);
        database.collection('session').insertOne(new Session(myAccount));
        sendVerificationEmail(myAccount);
        let myToken: VerifyEmailToken | undefined = verifyEmailTokens.find(
            (tok) => {
                return tok.email == 'test@test.com';
            }
        );
        expect(myToken).toBeDefined();
        assertDefined(myToken);
        expect(myToken.email).toBe('test@test.com');
        done();
    });
});
