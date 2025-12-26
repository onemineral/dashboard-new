import { TripDestination } from './trip-destination';
import { TripReservation } from './trip-reservation';
import { TripActivity } from './trip-activity';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface Trip {
    id: string;
    trip_name: string;
    short_description: string;
    description?: string;
    itinerary_image?: string;
    arrival_date?: string;
    departure_date?: string;
    product_image?: string;
    status?: string;
    hide_proposal_tab?: boolean;
    destination?: TripDestination;
    reservations?: TripReservation[];
    activities?: TripActivity[];
}

export class TripClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'trip';

    public async query(params: TripQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Trip>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: TripFetchParams, options?: RequestOptions): Promise<Response<Trip>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }
}

export interface TripQueryParams {
    type?: string;
    offset: number;
    count: number;
    paginate?: {
        page?: number;
        perpage?: number;
    };
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

export interface TripFetchParams {
    trip_id: string;
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
