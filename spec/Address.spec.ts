import Address from '../src/entities/models/Address';

describe('Constructing an address', () => {
    let address: Address = new Address({
        line1: '2000 N Broad St.',
        city: 'Philadelphia',
        state: 'PA',
        zip: '19121',
    });

    it('Should construct an Address object', () => {
        expect(address).toBeInstanceOf(Address);
    });

    it('Should be valid', () => {
        expect(address.validate()).toBe(true);
    });
});
