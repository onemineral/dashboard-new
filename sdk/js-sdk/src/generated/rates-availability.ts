import { AvailabilityStatus } from "./availability-status";

export interface RatesAvailability {
    id: number;
    day?: string;
    rate?: number;
    availability_status?: AvailabilityStatus;
    min_stay?: number;
    checkin_restricted?: boolean;
    checkout_restricted?: boolean;
    availability_status_type?: string;
    is_available?: boolean;
    created_at: string;
    updated_at: string;
}
