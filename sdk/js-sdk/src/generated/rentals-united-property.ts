import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface RentalsUnitedProperty {
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

export class RentalsUnitedPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'rentals-united-property';

    public async fetch(params: RentalsUnitedPropertyFetchParams, options?: RequestOptions): Promise<Response<RentalsUnitedProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: RentalsUnitedPropertyCreateParams, options?: RequestOptions): Promise<Response<RentalsUnitedProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async attach(params: RentalsUnitedPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async unlink(params: RentalsUnitedPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }

    public async update(params: RentalsUnitedPropertyUpdateParams, options?: RequestOptions): Promise<Response<RentalsUnitedProperty>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface RentalsUnitedPropertyFetchParams {
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

export interface RentalsUnitedPropertyCreateParams {
    property: number;
    channel: number;
    cancellation_policy: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13";
}

export interface RentalsUnitedPropertyAttachParams {
    property: number;
    channel: number;
    listing_id: string;
    cancellation_policy: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13";
}

export interface RentalsUnitedPropertyUnlinkParams {
    id: number;
}

export interface RentalsUnitedPropertyUpdateParams {
    id: number;
    cancellation_policy: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13";
}
