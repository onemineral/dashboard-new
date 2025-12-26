import { AvailabilityStatus } from "./availability-status";
import { TaxClass } from "./tax-class";
import { PaymentSchedule } from "./payment-schedule";

export interface PropertyRatesSettings {
    base_occupancy: number;
    default_availability_status: AvailabilityStatus;
    tax_class?: TaxClass;
    payment_schedule: PaymentSchedule;
    min_stay: number;
    max_stay?: number | null;
    changeover_days?: "0" | "1" | "2" | "3";
    security_deposit_auto_authorize?: boolean;
    security_deposit_authorization_days?: number;
    security_deposit_release_days?: number;
    min_nightly_rate?: number;
    extra_guest_rate?: number;
    security_deposit?: number;
    ta_max_commission_percent?: number;
}
