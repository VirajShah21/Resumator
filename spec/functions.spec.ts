import {
    assertGoodClient,
    comparePasswordWithHash,
    generateKey,
    generateVerifyPin,
    getClient,
    hashPassword,
    KEYLENGTH,
    validateEmail,
    validateMonthYearString,
} from '../src/shared/functions';
import { Request } from 'express';
import Account from 'src/entities/daos/Account';
import IClientWrapper from 'src/entities/models/IClientWrapper';
import Session from 'src/entities/daos/Session';
import ResumeInfoTransformer from 'src/transformers/ResumeInfoTransformer';

describe('Testing password security functions', () => {
    it('hashPassword should generate hash', (done) => {
        hashPassword('helloworld', (hash) => {
            expect(hash.substring(0, 4)).toBe('$2b$');
            done();
        });
    });

    it('comparePasswordWithHash detect equality between hash and password', (done) => {
        hashPassword('helloworld', (hash) => {
            comparePasswordWithHash('helloworld', hash, (matches) => {
                expect(matches).toBe(true);
                done();
            });
        });
    });

    it('comparePasswordWithHash should detect inequality between hash and password', (done) => {
        hashPassword('helloworld', (hash) => {
            comparePasswordWithHash('byeworld', hash, (matches) => {
                expect(matches).toBe(false);
                done();
            });
        });
    });

    it('generateKey should generate a key of KEYLENGTH', (done) => {
        const key = generateKey();
        expect(key).toBeDefined();
        expect(key.length).toBe(KEYLENGTH);
        done();
    });

    it('Should generate a 6-digit verify pin', (done) => {
        expect(generateVerifyPin().length).toBe(6);
        done();
    });
});

describe('Testing shared validation functions', () => {
    it('Should validate month year string', (done) => {
        expect(validateMonthYearString('12/1999')).toBe(true);
        expect(validateMonthYearString('12/21/1999')).toBe(false);
        done();
    });

    it('Should validate email', (done) => {
        expect(validateEmail('viraj@virajshah.org')).toBe(true);
        expect(validateEmail('viraj@virajshah')).toBe(false);
        done();
    });
});

describe('Tests for Request.client', () => {
    it('Should return a client object from the request', (done) => {
        const mockRequest: Request = ({
            client: {
                exists: true,
            },
        } as unknown) as Request;
        expect(getClient(mockRequest)).toBeDefined();
        done();
    });

    it('Should return undefined for no client', (done) => {
        const mockRequest: Request = ({} as unknown) as Request;
        expect(getClient(mockRequest)).toBeUndefined();
        done();
    });

    it('Should assert the client object is good', (done) => {
        const mockClient: IClientWrapper = ({
            account: {} as Account,
            session: {} as Session,
            resumeInfo: {} as ResumeInfoTransformer,
        } as unknown) as IClientWrapper;

        assertGoodClient(mockClient);
        done();
    });
});
