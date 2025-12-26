import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Holidu {
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

export class HoliduClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'holidu';

    public async create(params: HoliduCreateParams, options?: RequestOptions): Promise<Response<Holidu>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: HoliduFetchParams, options?: RequestOptions): Promise<Response<Holidu>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface HoliduCreateParams {
    name: string;
    provider: string;
}

export interface HoliduFetchParams {
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
