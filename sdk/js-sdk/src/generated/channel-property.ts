import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface ChannelProperty {
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

export class ChannelPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'channel-property';

    public async fetch(params: ChannelPropertyFetchParams, options?: RequestOptions): Promise<Response<ChannelProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async sync(params: ChannelPropertySyncParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync`,{params,options});
    }
}

export interface ChannelPropertyFetchParams {
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

export interface ChannelPropertySyncParams {
    id: number;
    exclude_events?: string[];
}
