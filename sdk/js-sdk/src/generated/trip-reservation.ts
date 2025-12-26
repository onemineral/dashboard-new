import { Image } from './image';
import { TripGuest } from './trip-guest';

export interface TripReservation {
    id: string;
    reservation_name: string;
    status: string;
    location_name: string;
    address_meeting_point: string;
    type: string;
    arrival_date: string;
    departure_date: string;
    image: string;
    record_type: string;
    images: Image[];
    guests: TripGuest[];
}
