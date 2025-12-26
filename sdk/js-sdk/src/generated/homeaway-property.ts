import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface HomeawayProperty {
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

export class HomeawayPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'homeaway-property';

    public async fetch(params: HomeawayPropertyFetchParams, options?: RequestOptions): Promise<Response<HomeawayProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: HomeawayPropertyCreateParams, options?: RequestOptions): Promise<Response<HomeawayProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: HomeawayPropertyUpdateParams, options?: RequestOptions): Promise<Response<HomeawayProperty>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async unlink(params: HomeawayPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface HomeawayPropertyFetchParams {
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

export interface HomeawayPropertyCreateParams {
    property: number;
    channel: number;
    cancellation_policy: "STRICT" | "FIRM" | "MODERATE" | "RELAXED" | "NO_REFUND";
}

export interface HomeawayPropertyUpdateParams {
    id: number;
    cancellation_policy: "STRICT" | "FIRM" | "MODERATE" | "RELAXED" | "NO_REFUND";
}

export interface HomeawayPropertyUnlinkParams {
    id: number;
}
