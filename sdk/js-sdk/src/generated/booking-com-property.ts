import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface BookingComProperty {
    id: number;
    status: "enabled" | "disabled" | "pending_approval" | "pending";
    provider: string;
    options: any;
    external_id: string;
    channel: Channel;
    property: Property;
    channel_manager_sync?: ChannelManagerSync[];
    created_at: string;
    updated_at: string;
}

export class BookingComPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking-com-property';

    public async fetch(params: BookingComPropertyFetchParams, options?: RequestOptions): Promise<Response<BookingComProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: BookingComPropertyCreateParams, options?: RequestOptions): Promise<Response<BookingComProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async attach(params: BookingComPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async activate(params: BookingComPropertyActivateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/activate`,{params,options});
    }

    public async update(params: BookingComPropertyUpdateParams, options?: RequestOptions): Promise<Response<BookingComProperty>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async unlink(params: BookingComPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }

    public async fetchRooms(params: BookingComPropertyFetchRoomsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-rooms`,{params,options});
    }

    public async fetchRoomProducts(params: BookingComPropertyFetchRoomProductsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-room-products`,{params,options});
    }

    public async queryReviews(params: BookingComPropertyQueryReviewsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/query-reviews`,{params,options});
    }
}

export interface BookingComPropertyFetchParams {
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

export interface BookingComPropertyCreateParams {
    property: number;
    channel: number;
    legal_entity: number;
    booking_category?: "instant" | "rtb";
    cancellation_policy: "1" | "12" | "13" | "14" | "16" | "29" | "55" | "62" | "68" | "72" | "74" | "115" | "121" | "152" | "168";
    cancellation_grace_period?: {
            hours_after_booking?: "0" | "1" | "4" | "24",
            weeks_before_checkin?: "0" | "4" | "8" | "12"
        };
    require_guest_address?: boolean;
    require_guest_contact_number?: boolean;
    guest_identification?: boolean;
    inform_arrival_time?: boolean;
    key_collection?: {
            address?: string,
            city?: string,
            postal_code?: string
        };
    pay_before_stay?: boolean;
    require_invoice?: boolean;
    early_departure?: boolean;
    pedestrian_zone_only?: boolean;
    limited_parking?: boolean;
    access_by_unpaved_road?: boolean;
    onsite_functions?: boolean;
    residential_area?: boolean;
    busy_area?: boolean;
    no_public_transport?: boolean;
    prevent_likely_to_be_cancelled_bookings?: boolean;
    covid_19_restriction_of_guests?: boolean;
    covid_19_extra_cleaning?: boolean;
    covid_19_only_essential_travellers?: boolean;
    covid_19_reduced_services?: boolean;
    covid_19_extra_documentation?: boolean;
    covid_19_reduced_facilities?: boolean;
}

export interface BookingComPropertyAttachParams {
    property: number;
    channel: number;
    listing_id: string;
}

export interface BookingComPropertyActivateParams {
    id: number;
    room_id: number;
    rate_plan_id?: number;
    synchronization_category: "sync_all" | "sync_rates_and_availability";
    cancellation_policy: "1" | "12" | "13" | "14" | "16" | "29" | "55" | "62" | "68" | "72" | "74" | "115" | "121" | "152" | "168";
    cancellation_grace_period?: {
            hours_after_booking?: "0" | "1" | "4" | "24",
            weeks_before_checkin?: "0" | "4" | "8" | "12"
        };
    require_guest_address?: boolean;
    require_guest_contact_number?: boolean;
    guest_identification?: boolean;
    inform_arrival_time?: boolean;
    key_collection?: {
            address?: string,
            city?: string,
            postal_code?: string
        };
    pay_before_stay?: boolean;
    require_invoice?: boolean;
    early_departure?: boolean;
    pedestrian_zone_only?: boolean;
    limited_parking?: boolean;
    access_by_unpaved_road?: boolean;
    onsite_functions?: boolean;
    residential_area?: boolean;
    busy_area?: boolean;
    no_public_transport?: boolean;
    prevent_likely_to_be_cancelled_bookings?: boolean;
    covid_19_restriction_of_guests?: boolean;
    covid_19_extra_cleaning?: boolean;
    covid_19_only_essential_travellers?: boolean;
    covid_19_reduced_services?: boolean;
    covid_19_extra_documentation?: boolean;
    covid_19_reduced_facilities?: boolean;
}

export interface BookingComPropertyUpdateParams {
    id: number;
    synchronization_category: "sync_all" | "sync_rates_and_availability";
    cancellation_policy: "1" | "12" | "13" | "14" | "16" | "29" | "55" | "62" | "68" | "72" | "74" | "115" | "121" | "152" | "168";
    cancellation_grace_period?: {
            hours_after_booking?: "0" | "1" | "4" | "24",
            weeks_before_checkin?: "0" | "4" | "8" | "12"
        };
    require_guest_address?: boolean;
    require_guest_contact_number?: boolean;
    guest_identification?: boolean;
    inform_arrival_time?: boolean;
    key_collection?: {
            address?: string,
            city?: string,
            postal_code?: string
        };
    pay_before_stay?: boolean;
    require_invoice?: boolean;
    early_departure?: boolean;
    pedestrian_zone_only?: boolean;
    limited_parking?: boolean;
    access_by_unpaved_road?: boolean;
    onsite_functions?: boolean;
    residential_area?: boolean;
    busy_area?: boolean;
    no_public_transport?: boolean;
    prevent_likely_to_be_cancelled_bookings?: boolean;
    covid_19_restriction_of_guests?: boolean;
    covid_19_extra_cleaning?: boolean;
    covid_19_only_essential_travellers?: boolean;
    covid_19_reduced_services?: boolean;
    covid_19_extra_documentation?: boolean;
    covid_19_reduced_facilities?: boolean;
}

export interface BookingComPropertyUnlinkParams {
    id: number;
}

export interface BookingComPropertyFetchRoomsParams {
    listing_id: number;
}

export interface BookingComPropertyFetchRoomProductsParams {
    listing_id: number;
    room_id: number;
}

export interface BookingComPropertyQueryReviewsParams {
    id: number;
}
