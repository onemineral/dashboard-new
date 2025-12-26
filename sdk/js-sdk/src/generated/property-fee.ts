import { Property } from "./property";
import { FeeType } from "./fee-type";
import { TaxClass } from "./tax-class";

export interface PropertyFee {
    id: number;
    property: Property;
    fee_type: FeeType;
    amount?: number | null;
    percent?: number | null;
    tax_class?: TaxClass;
}
