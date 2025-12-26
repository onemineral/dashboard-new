import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface BreezewayProperty {
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

export class BreezewayPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'breezeway-property';

    public async fetch(params: BreezewayPropertyFetchParams, options?: RequestOptions): Promise<Response<BreezewayProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: BreezewayPropertyCreateParams, options?: RequestOptions): Promise<Response<BreezewayProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async attach(params: BreezewayPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async unlink(params: BreezewayPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface BreezewayPropertyFetchParams {
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

export interface BreezewayPropertyCreateParams {
    property: number;
    channel: number;
}

export interface BreezewayPropertyAttachParams {
    property: number;
    channel: number;
    external_id: number;
}

export interface BreezewayPropertyUnlinkParams {
    id: number;
}
