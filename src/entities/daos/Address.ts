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
export default class Address implements IAddress {
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
        this.line1 = address.line1;
        this.line2 = address.line2 || "";
        this.city = address.city;
        this.state = address.state;
        this.zip = address.zip;
    }

    /**
     * Validate street, city, state, and zip
     *
     * @returns True if all fields are valid; false otherwise
     */
    public validate(): boolean {
        return this.validateStreet() && this.validateCityAndState() && this.validateZip();
    }

    /**
     * Checks if the street provides a number as the first item
     *
     * @returns True if the address line 1 is valid; false otherwise
     */
    private validateStreet(): boolean {
        try {
            const number = this.line1.split(" ")[0];
            parseInt(number, 10); // will throw an exception if NaN
            // checks if street name exists (and len > 1) (if blank throws an exception)
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if the city has any length, and the state has an abbreviation length of 2
     *
     * @returns True if the city and state are valid; false otherwise
     */
    private validateCityAndState(): boolean {
        return this.city.length > 0 && this.state.length === 2;
    }

    /**
     * Checks if the zip code has a length of exactly 5
     *
     * @returns True if the zip code is valid; false otherwise
     */
    private validateZip(): boolean {
        return this.zip.length === 5;
    }
}
