import { DateRange } from "./shared";
import { Currency } from "./currency";
import { Account } from "./account";
import { Property } from "./property";
import { Booking } from "./booking";
import { PartnerAccount } from "./partner-account";
import { BookingProduct } from "./booking-product";
import { BookingTaCommission } from "./booking-ta-commission";

export interface Quote {
    search_criteria?: {
            property: number,
            booking: number,
            channel?: number | null,
            public?: boolean,
            force?: boolean,
            daterange: DateRange,
            adults: number,
            children?: number | null,
            babies?: number | null,
            pets?: boolean | null,
            bedrooms?: number | null,
            fees?: Array<{
                id?: number | null,
                name?: string | null,
                total?: number
            }>,
            overlap_fees?: boolean,
            commission_amount?: number,
            commission_percent?: number,
            commission_apply_on?: "accommodation" | "subtotal" | "total",
            commission_is_charged_by_ta?: boolean,
            commission_apply_with_tax?: boolean,
            total_accommodation_with_fees?: number,
            total_accommodation?: number,
            currency?: {
                id?: Currency,
                iso_code?: string
            },
            booker?: Account,
            coupon_code?: string,
            ignore?: Array<"all" | "policies" | "restrictions" | "children_allowed" | "babies_allowed" | "pets_allowed" | "max_occupancy" | "min_prior_notify" | "max_booking_window" | "checkin_restricted" | "checkout_restricted" | "min_stay" | "max_stay" | "availability">
        };
    property: Property;
    booking: Booking;
    currency: Currency;
    booker: PartnerAccount;
    products?: BookingProduct[];
    total: number;
    total_pretax: number;
    total_taxes: number;
    total_accommodation: number;
    total_accommodation_pretax: number;
    total_fees: number;
    total_fees_pretax: number;
    total_before_discount: number;
    total_discount: number;
    security_deposit: number;
    security_deposit_currency: Currency;
    commission?: BookingTaCommission;
    quote_id: string;
    book_url: string;
    exceptions: any;
    warnings: any;
}
