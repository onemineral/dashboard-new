import { TripGuest } from './trip-guest';

export interface TripActivity {
    id: string;
    address: string;
    start_time: string;
    end_time: string;
    subject: string;
    type: string;
    description: string;
    light_activity: boolean;
    reservation_id: string;
    supplier_name: string;
    reservation_status: string;
    reservation_type: string;
    reservation_record_type: string;
    image: string;
    guests?: TripGuest[];
}
