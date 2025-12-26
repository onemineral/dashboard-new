import { TaxClass } from "./tax-class";

export interface Tax {
    id: number;
    tax_class: TaxClass;
    tax_type: "VAT/GST" | "Local tax" | "Tourist tax (%)" | "Tourist tax (flat)" | "State tax" | "Room tax";
    amount: number;
    amount_type: "per_guest_per_night" | "per_guest_per_stay" | "per_night";
    percent: number;
    is_excluded: boolean;
    created_at: string;
    updated_at: string;
}
