import { PaymentSchedule } from "./payment-schedule";

export interface TenantPolicy {
    id: number;
    min_stay: number;
    max_stay?: number | null;
    min_prior_notify: number;
    min_children_age: number;
    min_adults_age: number;
    adults_age_from: number;
    default_payment_schedule?: PaymentSchedule;
}
