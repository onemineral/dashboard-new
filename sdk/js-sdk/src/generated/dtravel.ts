import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Dtravel {
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

export class DtravelClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'dtravel';

    public async create(params: DtravelCreateParams, options?: RequestOptions): Promise<Response<Dtravel>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: DtravelFetchParams, options?: RequestOptions): Promise<Response<Dtravel>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async getAllListings(params: DtravelGetAllListingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-all-listings`,{params,options});
    }
}

export interface DtravelCreateParams {
    name: string;
    client_id: string;
    client_secret: string;
}

export interface DtravelFetchParams {
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

export interface DtravelGetAllListingsParams {
    channel: number;
}
