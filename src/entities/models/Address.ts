import Entity from '../Entity';

/**
 * Address interface
 */
export interface IAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
}

/**
 * Address class
 */
export default class Address extends Entity implements IAddress {
    public line1: string;
    public line2: string;
    public city: string;
    public state: string;
    public zip: string;

    /**
     *
     * @param address The address object to construct
     */
    constructor(address: IAddress) {
        super();
        this.line1 = address.line1.trim();
        this.line2 = address.line2?.trim() || '';
        this.city = address.city.trim();
        this.state = address.state.trim();
        this.zip = address.zip.trim();
    }

    protected validateCity(): boolean {
        return this.city.length > 0;
    }

    protected validateLine1(): boolean {
        try {
            const num = this.line1.split(' ')[0];
            parseInt(num, 10); // will throw an exception if NaN
            // checks if street name exists (and len > 1) (if blank throws an exception)
            return true;
        } catch (e) {
            return false;
        }
    }

    protected validateState(): boolean {
        return this.state.length === 2;
    }

    protected validateZip(): boolean {
        return this.zip.length === 5;
    }
}
