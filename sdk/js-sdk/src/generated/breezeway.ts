import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Breezeway {
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

export class BreezewayClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'breezeway';

    public async fetch(params: BreezewayFetchParams, options?: RequestOptions): Promise<Response<Breezeway>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: BreezewayCreateParams, options?: RequestOptions): Promise<Response<Breezeway>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async getAllListings(params: BreezewayGetAllListingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-all-listings`,{params,options});
    }
}

export interface BreezewayFetchParams {
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

export interface BreezewayCreateParams {
    name: string;
    company_id: string;
    automatically_sync_homes: boolean;
}

export interface BreezewayGetAllListingsParams {
    channel: number;
}
