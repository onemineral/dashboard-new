import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface AirbnbProperty {
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

export class AirbnbPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'airbnb-property';

    public async fetch(params: AirbnbPropertyFetchParams, options?: RequestOptions): Promise<Response<AirbnbProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async attach(params: AirbnbPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async autoAttach(params: AirbnbPropertyAutoAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/auto-attach`,{params,options});
    }

    public async create(params: AirbnbPropertyCreateParams, options?: RequestOptions): Promise<Response<AirbnbProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: AirbnbPropertyUpdateParams, options?: RequestOptions): Promise<Response<AirbnbProperty>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async unlink(params: AirbnbPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }

    public async queryReviews(params: AirbnbPropertyQueryReviewsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/query-reviews`,{params,options});
    }
}

export interface AirbnbPropertyFetchParams {
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

export interface AirbnbPropertyAttachParams {
    property: number;
    channel: number;
    listing_id: string;
    synchronization_category: "sync_all" | "sync_rates_and_availability";
    cancellation_policy: "flexible" | "moderate" | "better_strict_with_grace_period" | "strict_14_with_grace_period" | "super_strict_30" | "super_strict_60" | "luxury_moderate" | "luxury_super_strict_95" | "luxury_super_strict_125" | "luxury_moderate_14" | "luxury_no_refund";
    long_stay_cancellation_policy: "CANCEL_LONG_TERM_FAIR" | "CANCEL_LONG_TERM_WITH_GRACE_PERIOD";
    non_refundable_discount?: number | null;
    instant_booking_allowed_category: "everyone" | "well_reviewed_guests" | "off";
    offline_security_deposit?: boolean;
    taxes_sync: "auto" | "disabled";
}

export interface AirbnbPropertyAutoAttachParams {
    property: number;
    channel: number;
    listing_id: string;
}

export interface AirbnbPropertyCreateParams {
    property: number;
    channel: number;
    cancellation_policy: "flexible" | "moderate" | "better_strict_with_grace_period" | "strict_14_with_grace_period" | "super_strict_30" | "super_strict_60";
    long_stay_cancellation_policy: "CANCEL_LONG_TERM_FAIR" | "CANCEL_LONG_TERM_WITH_GRACE_PERIOD";
    non_refundable_discount?: number | null;
    instant_booking_allowed_category: "everyone" | "well_reviewed_guests" | "off";
    offline_security_deposit?: boolean;
    taxes_sync: "auto" | "disabled";
}

export interface AirbnbPropertyUpdateParams {
    id: number;
    cancellation_policy: "flexible" | "moderate" | "better_strict_with_grace_period" | "strict_14_with_grace_period" | "super_strict_30" | "super_strict_60" | "luxury_moderate" | "luxury_super_strict_95" | "luxury_super_strict_125" | "luxury_moderate_14" | "luxury_no_refund";
    long_stay_cancellation_policy: "CANCEL_LONG_TERM_FAIR" | "CANCEL_LONG_TERM_WITH_GRACE_PERIOD";
    non_refundable_discount?: number | null;
    synchronization_category: "sync_all" | "sync_rates_and_availability";
    instant_booking_allowed_category: "everyone" | "well_reviewed_guests" | "off";
    taxes_sync: "auto" | "disabled";
    offline_security_deposit?: boolean;
}

export interface AirbnbPropertyUnlinkParams {
    id: number;
}

export interface AirbnbPropertyQueryReviewsParams {
    id: number;
}
