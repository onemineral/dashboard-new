import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Makemytrip {
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

export class MakemytripClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'makemytrip';

    public async create(params: MakemytripCreateParams, options?: RequestOptions): Promise<Response<Makemytrip>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: MakemytripFetchParams, options?: RequestOptions): Promise<Response<Makemytrip>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface MakemytripCreateParams {
    name: string;
}

export interface MakemytripFetchParams {
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
