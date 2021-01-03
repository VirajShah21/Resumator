import Address from '../src/entities/models/Address';

describe('Constructing an address', () => {
    const address: Address = new Address({
        line1: '2000 N Broad St.',
        city: 'Philadelphia',
        state: 'PA',
        zip: '19121',
    });

    it('Should construct an Address object', (done) => {
        expect(address).toBeInstanceOf(Address);
        done();
    });

    it('Should be valid', (done) => {
        expect(address.validate()).toBe(true);
        done();
    });
});
