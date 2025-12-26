import { TaxClass } from "./tax-class";

export interface PropertyHostRevenueShare {
    tax_class?: TaxClass;
    type?: "revenue_share" | "commission";
    service_fee_amount?: number;
    host_percent?: number;
    apply_on?: "accommodation" | "subtotal" | "total";
    apply_with_tax?: boolean | null;
    exclude_ta_commission?: boolean | null;
}
