import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface WheelhouseProperty {
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

export class WheelhousePropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'wheelhouse-property';

    public async fetch(params: WheelhousePropertyFetchParams, options?: RequestOptions): Promise<Response<WheelhouseProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: WheelhousePropertyCreateParams, options?: RequestOptions): Promise<Response<WheelhouseProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async forcePullCalendar(params: WheelhousePropertyForcePullCalendarParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/force-pull-calendar`,{params,options});
    }

    public async unlink(params: WheelhousePropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface WheelhousePropertyFetchParams {
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

export interface WheelhousePropertyCreateParams {
    property: number;
    channel: number;
    wheelhouse_id?: number | null;
    automatic_rate_posting_enabled?: boolean;
}

export interface WheelhousePropertyForcePullCalendarParams {
    id: number;
}

export interface WheelhousePropertyUnlinkParams {
    id: number;
}
