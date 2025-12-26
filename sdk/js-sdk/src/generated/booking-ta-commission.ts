import { TaxClass } from "./tax-class";
import { CalculatedTax } from "./calculated-tax";

export interface BookingTaCommission {
    id: number;
    tax_class?: TaxClass;
    percent?: number | null;
    apply_on?: "accommodation" | "subtotal" | "total";
    apply_with_tax?: boolean | null;
    total?: number | null;
    total_pretax?: number;
    is_charged_by_ta?: boolean | null;
    taxes?: CalculatedTax[];
    created_at: string;
    updated_at: string;
}
