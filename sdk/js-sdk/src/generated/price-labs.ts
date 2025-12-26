import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface PriceLabs {
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

export class PriceLabsClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'price-labs';

    public async create(params: PriceLabsCreateParams, options?: RequestOptions): Promise<Response<PriceLabs>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: PriceLabsFetchParams, options?: RequestOptions): Promise<Response<PriceLabs>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async updateUserToken(params: PriceLabsUpdateUserTokenParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-user-token`,{params,options});
    }
}

export interface PriceLabsCreateParams {
    name: string;
    user_token: string;
}

export interface PriceLabsFetchParams {
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

export interface PriceLabsUpdateUserTokenParams {
    channel: number;
    user_token: string;
}
