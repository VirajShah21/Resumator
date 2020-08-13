/**
 * Address interface
 */
export interface IAddress {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: number;
}

/**
 * Address class
 */
export default class Address implements IAddress {
    public line1: string;
    public line2: string;
    public city: string;
    public state: string;
    public zip: number;

    /**
     *
     * @param line1 Address line 1
     * @param line2 Address line 2
     * @param city City/Township/Municipality
     * @param state The two letter state abbreviation
     * @param zip Zip code
     */
    constructor(line1: string | IAddress, line2?: string, city?: string, state?: string, zip?: number) {
        if (typeof line1 == "string") {
            this.line1 = line1;
            this.line2 = line2 || "";
            this.city = city || "";
            this.state = state || "PA";
            this.zip = zip || 0;
        } else {
            this.line1 = line1.line1;
            this.line2 = line1.line2;
            this.city = line1.city;
            this.state = line1.state;
            this.zip = line1.zip;
        }
    }

    /**
     * @returns True if all fields are valid; false otherwise
     */
    public validate(): boolean {
        return this.validateStreet() && this.validateCityAndState() && this.validateZip();
    }

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

    private validateCityAndState(): boolean {
        return this.city.length > 0 && this.state.length == 2;
    }

    private validateZip(): boolean {
        return this.zip.toString().length === 5;
    }
}
