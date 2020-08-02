export interface IAddress {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: number;
}

export default class Address implements IAddress {
    public line1: string;
    public line2: string;
    public city: string;
    public state: string;
    public zip: number;

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

    validate(): boolean {
        return true;
    }
}
