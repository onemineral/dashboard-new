import { DateRange } from "./shared";

export interface RatesAvailabilityRange {
    daterange?: DateRange;
    rate?: number;
    min_stay?: number;
    checkin_restricted?: boolean;
    checkout_restricted?: boolean;
    availability_status_type?: string;
    is_available?: boolean;
}
