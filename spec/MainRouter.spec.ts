import request from 'supertest';
import { expect } from 'chai';
import app from '../src/Server';

describe('Testing routes (/) on root router', () => {
    it('Testing Route: /', (done) => {
        request(app).get('/').expect(200, done);
    });
});
