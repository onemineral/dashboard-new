import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface GoogleVrProperty {
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

export class GoogleVrPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'google-vr-property';

    public async fetch(params: GoogleVrPropertyFetchParams, options?: RequestOptions): Promise<Response<GoogleVrProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: GoogleVrPropertyCreateParams, options?: RequestOptions): Promise<Response<GoogleVrProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async unlink(params: GoogleVrPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface GoogleVrPropertyFetchParams {
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

export interface GoogleVrPropertyCreateParams {
    property: number;
    channel: number;
    property_url?: string | null;
}

export interface GoogleVrPropertyUnlinkParams {
    id: number;
}
