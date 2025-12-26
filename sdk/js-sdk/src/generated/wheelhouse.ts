import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Wheelhouse {
    id: number;
    name: string;
    external_id: string;
    status: "enabled" | "pending" | "disabled";
    options: any;
    provider: string;
    logo_url: string;
    icon_url: string;
    account?: Account;
    markup: number;
    connection: ChannelProperty;
    created_at: string;
    updated_at: string;
}

export class WheelhouseClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'wheelhouse';

    public async create(params: WheelhouseCreateParams, options?: RequestOptions): Promise<Response<Wheelhouse>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: WheelhouseFetchParams, options?: RequestOptions): Promise<Response<Wheelhouse>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async getAllListings(params: WheelhouseGetAllListingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-all-listings`,{params,options});
    }
}

export interface WheelhouseCreateParams {
    name: string;
    user_api_key: string;
}

export interface WheelhouseFetchParams {
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

export interface WheelhouseGetAllListingsParams {
    channel: number;
}
