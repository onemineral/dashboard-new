import { Booking } from "./booking";
import { Country } from "./country";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface BookingGuest {
    id: number;
    booking?: Booking;
    name?: string;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
    company?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: Country;
    gender?: "female" | "male";
    birthdate?: string | null;
    citizenship_country?: Country;
    id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit";
    id_number?: string | null;
    id_issue_date?: string | null;
    created_at: string;
    updated_at: string;
}

export class BookingGuestClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking-guest';

    public async fetch(params: BookingGuestFetchParams, options?: RequestOptions): Promise<Response<BookingGuest>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: BookingGuestCreateParams, options?: RequestOptions): Promise<Response<BookingGuest>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: BookingGuestUpdateParams, options?: RequestOptions): Promise<Response<BookingGuest>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: BookingGuestDeleteParams, options?: RequestOptions): Promise<Response<BookingGuest>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface BookingGuestFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
    with?: string[];
    with_aggregations?: Array<{
            type?: "count" | "avg" | "sum" | "min" | "max",
            as?: string,
            relation?: string,
            field?: string,
            where?: {
                conditions?: any,
                conditions_logic?: string | null
            }
        }>;
}

export interface BookingGuestCreateParams {
    booking: number;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
    company?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: number | null;
    gender?: "female" | "male";
    birthdate?: string | null;
    citizenship_country?: number | null;
    id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit";
    id_number?: string | null;
    id_issue_date?: string | null;
}

export interface BookingGuestUpdateParams {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
    company?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: number | null;
    gender?: "female" | "male";
    birthdate?: string | null;
    citizenship_country?: number | null;
    id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit";
    id_number?: string | null;
    id_issue_date?: string | null;
}

export interface BookingGuestDeleteParams {
    id: number;
}
