import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface SuperhogProperty {
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

export class SuperhogPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'superhog-property';

    public async fetch(params: SuperhogPropertyFetchParams, options?: RequestOptions): Promise<Response<SuperhogProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: SuperhogPropertyCreateParams, options?: RequestOptions): Promise<Response<SuperhogProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async attach(params: SuperhogPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async unlink(params: SuperhogPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface SuperhogPropertyFetchParams {
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

export interface SuperhogPropertyCreateParams {
    property: number;
    channel: number;
}

export interface SuperhogPropertyAttachParams {
    property: number;
    listing_id: string;
    channel: number;
}

export interface SuperhogPropertyUnlinkParams {
    id: number;
}
