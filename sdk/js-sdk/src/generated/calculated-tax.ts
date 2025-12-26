import { BookingProduct } from "./booking-product";
import { BookingTaCommission } from "./booking-ta-commission";
import { Tax } from "./tax";

export interface CalculatedTax {
    id: number;
    resource?: {
            type: 'booking-product' | 'booking-ta-commission',
            record: BookingProduct | BookingTaCommission
        };
    tax: Tax;
    name: string;
    description: string;
    total: number;
    amount?: number | null;
    amount_type?: "per_guest_per_night" | "per_guest_per_stay" | "per_night";
    percent?: number | null;
    created_at: string;
    updated_at: string;
}
