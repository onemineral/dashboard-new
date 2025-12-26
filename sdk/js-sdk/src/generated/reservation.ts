import { Geo } from './shared';
import { Image } from './image';
import { Flight } from './flight';
import { TripGuest } from './trip-guest';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface Reservation {
    id: string;
    trip_id: string;
    order: string;
    image: string;
    type: string;
    reservation_name: string;
    status: string;
    arrival_date: string;
    departure_date: string;
    description: string;
    document_link: string;
    access_instructions: string;
    location_name: string;
    meeting_point: string;
    meeting_point_geo: Geo;
    images: Image[];
    contact: {
        name: string;
        email: string;
        phone_number: string;
        bio: string;
    };
    record_type: string;
    url_override: string;
    reservation_location_name: string;
    reservation_location_details: string;
    proposal_id: string;
    link_label: string;
    guests_override: string;
    price: string;
    flights: Flight[];
    property: {
        id: string;
        name: string;
        geo: Geo;
        address: string;
    };
    guests: TripGuest[];
}

export class ReservationClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'reservation';

    public async fetch(params: ReservationFetchParams, options?: RequestOptions): Promise<Response<Reservation>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async update(params: ReservationUpdateParams, options?: RequestOptions): Promise<Response<Reservation>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }
}

export interface ReservationFetchParams {
    reservation_id: string;
    with?: string[];
    with_aggregations?: Array<{
        type?: 'count' | 'avg' | 'sum' | 'min' | 'max';
        as?: string;
        relation?: string;
        field?: string;
        where?: {
            conditions?: any;
            conditions_logic?: string | null;
        };
    }>;
}

export interface ReservationUpdateParams {
    reservation_id: string;
    status?: 'proposed' | 'requested' | 'confirmed' | 'canceled';
    notes?: string;
    reaction?: 'like' | 'dislike' | 'null';
}
