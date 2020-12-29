import { VerifyEmailer } from '../src/shared/util/Emailer';
import { ObjectId } from 'mongodb';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/Server';

describe('Test for @shared/util/Emailer.ts', () => {
    it('VerifyEmailer can be constructed', () => {
        new VerifyEmailer(new ObjectId());
        // expect();
    });
});
