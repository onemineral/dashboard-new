import { DateRange } from "./shared";

export interface AvailabilityDetails {
    daterange: DateRange;
    min_stay: {
            ok?: boolean,
            value?: number
        };
    max_stay: {
            ok?: boolean,
            value?: number
        };
    min_prior_notify_days: {
            ok?: boolean,
            value?: number
        };
    max_booking_window_days: {
            ok?: boolean,
            value?: number
        };
    checkin_restricted: {
            ok?: boolean,
            value?: boolean
        };
    checkout_restricted: {
            ok?: boolean,
            value?: boolean
        };
    length_of_stay: number;
    total_accommodation: number;
    total_discount: number;
    total_fees: number;
    total: number;
    total_before_discount: number;
    currency_iso: string;
    total_discount_percent: number;
    is_price_approximate: boolean;
    converted: {
            total_accommodation: number,
            total_discount: number,
            total_fees: number,
            total: number,
            total_before_discount: number,
            currency_iso: string
        };
}
