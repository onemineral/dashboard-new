import { BookingProduct } from "./booking-product";
import { PropertyLosSeasonDiscount } from "./property-los-season-discount";
import { Discount } from "./discount";
import { PropertyFee } from "./property-fee";

export interface BookingProductLineItem {
    id: number;
    booking_product: BookingProduct;
    name: string;
    description: string;
    type: "rate" | "extra_guest" | "discount" | "fee" | "los_discount" | "bond_capture" | "service" | "other";
    total_pretax: number;
    unit_pretax: number;
    quantity: number;
    start_date: string;
    end_date: string;
    amount?: number | null;
    amount_type?: string | null;
    percent?: number | null;
    calculation_mode: "manual" | "automatic";
    resource?: {
            type: 'property-los-season-discount' | 'discount' | 'property-fee',
            record: PropertyLosSeasonDiscount | Discount | PropertyFee
        };
    created_at: string;
    updated_at: string;
}
