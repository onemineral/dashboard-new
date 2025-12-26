import { TaxClass } from "./tax-class";
import { CalculatedTax } from "./calculated-tax";

export interface BookingHostRevenueShare {
    tax_class?: TaxClass;
    type?: "revenue_share" | "commission";
    service_fee_amount?: number;
    host_percent?: number | null;
    apply_on?: "accommodation" | "subtotal" | "total";
    apply_with_tax?: boolean | null;
    exclude_ta_commission?: boolean | null;
    total?: number | null;
    total_pretax?: number;
    taxes?: CalculatedTax[];
}
