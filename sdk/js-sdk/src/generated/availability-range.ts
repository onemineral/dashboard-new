
export interface AvailabilityRange {
    start_date: string;
    end_date: string;
    availability_status_type: "available" | "unavailable" | "booked";
    availability_status_color: string;
    is_available: boolean;
}
