
export interface BookingPaymentScheduleStep {
    id: number;
    short_description?: string | null;
    type?: "on_reservation" | "before_checkin";
    days?: number | null;
    charge_percent?: number;
    due_date?: string;
    amount?: number;
    amount_paid?: number;
    is_paid?: boolean;
    created_at: string;
    updated_at: string;
}
