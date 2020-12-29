import { VerifyEmailer } from '@shared/util/Emailer';
import { ObjectId } from 'mongodb';

describe('Test for @shared/util/Emailer.ts', () => {
    it('VerifyEmailer can be constructed', () => {
        new VerifyEmailer(new ObjectId());
        expect();
    });
});
