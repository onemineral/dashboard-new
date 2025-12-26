import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface DtravelProperty {
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

export class DtravelPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'dtravel-property';

    public async fetch(params: DtravelPropertyFetchParams, options?: RequestOptions): Promise<Response<DtravelProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: DtravelPropertyCreateParams, options?: RequestOptions): Promise<Response<DtravelProperty>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async attach(params: DtravelPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async unlink(params: DtravelPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface DtravelPropertyFetchParams {
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

export interface DtravelPropertyCreateParams {
    property: number;
    channel: number;
    cancellation_policy: "flexible" | "firm" | "moderate" | "strict" | "no_refund";
}

export interface DtravelPropertyAttachParams {
    property: number;
    channel: number;
    cancellation_policy: "flexible" | "firm" | "moderate" | "strict" | "no_refund";
    listing_id: string;
}

export interface DtravelPropertyUnlinkParams {
    id: number;
}
