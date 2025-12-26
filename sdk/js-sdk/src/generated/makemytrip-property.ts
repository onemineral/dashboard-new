import { Channel } from "./channel";
import { Property } from "./property";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface MakemytripProperty {
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

export class MakemytripPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'makemytrip-property';

    public async fetchHotelInfo(params: MakemytripPropertyFetchHotelInfoParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-hotel-info`,{params,options});
    }

    public async attach(params: MakemytripPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`,{params,options});
    }

    public async fetch(params: MakemytripPropertyFetchParams, options?: RequestOptions): Promise<Response<MakemytripProperty>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async unlink(params: MakemytripPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`,{params,options});
    }
}

export interface MakemytripPropertyFetchHotelInfoParams {
    access_token: string;
    listing_id: string;
}

export interface MakemytripPropertyAttachParams {
    property: number;
    channel: number;
    access_token: string;
    listing_id: string;
    room_id: string;
    rate_plan_id: string;
}

export interface MakemytripPropertyFetchParams {
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

export interface MakemytripPropertyUnlinkParams {
    id: number;
}
