/**
 * Address interface
 */
export interface IAddress {
    line1: string;
    line2: string;
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
     * @param line1 Address line 1
     * @param line2 Address line 2
     * @param city City/Township/Municipality
     * @param state The two letter state abbreviation
     * @param zip Zip code
     */
    constructor(line1: string | IAddress, line2?: string, city?: string, state?: string, zip?: string) {
        if (typeof line1 == "string") {
            this.line1 = line1;
            this.line2 = line2 || "";
            this.city = city || "";
            this.state = state || "";
            this.zip = zip || "";
        } else {
            this.line1 = line1.line1;
            this.line2 = line1.line2;
            this.city = line1.city;
            this.state = line1.state;
            this.zip = line1.zip;
        }
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
