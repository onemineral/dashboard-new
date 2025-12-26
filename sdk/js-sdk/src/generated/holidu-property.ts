import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface HoliduProperty {
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

export class HoliduPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'holidu-property';

    public async fetch(params: HoliduPropertyFetchParams, options?: RequestOptions): Promise<Response<HoliduProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: HoliduPropertyCreateParams, options?: RequestOptions): Promise<Response<HoliduProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: HoliduPropertyUpdateParams, options?: RequestOptions): Promise<Response<HoliduProperty>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface HoliduPropertyFetchParams {
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

export interface HoliduPropertyCreateParams {
    property: number;
    channel: number;
    cancellation_policy: "flexible" | "moderate" | "super_strict_15" | "super_strict_30" | "super_strict_60" | "no_refund";
}

export interface HoliduPropertyUpdateParams {
    id: number;
    cancellation_policy: "flexible" | "moderate" | "super_strict_15" | "super_strict_30" | "super_strict_60" | "no_refund";
}
