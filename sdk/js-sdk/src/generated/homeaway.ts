import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Homeaway {
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

export class HomeawayClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'homeaway';

    public async create(params: HomeawayCreateParams, options?: RequestOptions): Promise<Response<Homeaway>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: HomeawayFetchParams, options?: RequestOptions): Promise<Response<Homeaway>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface HomeawayCreateParams {
    name: string;
    currency: "AUD" | "BRL" | "CAD" | "EUR" | "GBP" | "NZD" | "USD";
}

export interface HomeawayFetchParams {
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
