import request from 'supertest';
import app from '../src/Server';
import { comparePasswordWithHash, hashPassword } from '../src/shared/functions';

describe('Testing password security functions', () => {
    it('Should generate hash', (done) => {
        hashPassword('helloworld', (hash) => {
            expect(hash.substring(0, 4)).toBe('$2b$');
            done();
        });
    });

    it('Should detect equality between hash and password', (done) => {
        hashPassword('helloworld', (hash) => {
            comparePasswordWithHash('helloworld', hash, (matches) => {
                expect(matches).toBe(true);
                done();
            });
        });
    });

    it('Should detect inequality between hash and password', (done) => {
        hashPassword('helloworld', (hash) => {
            comparePasswordWithHash('byeworld', hash, (matches) => {
                expect(matches).toBe(false);
                done();
            });
        });
    });
});
