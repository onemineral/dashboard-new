import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface ApiPartner {
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

export class ApiPartnerClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'api-partner';

    public async create(params: ApiPartnerCreateParams, options?: RequestOptions): Promise<Response<ApiPartner>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: ApiPartnerFetchParams, options?: RequestOptions): Promise<Response<ApiPartner>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async fetchAuth(params: ApiPartnerFetchAuthParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-auth`,{params,options});
    }
}

export interface ApiPartnerCreateParams {
    name: string;
    account: number;
    webhook_url_property_changed?: string | null;
}

export interface ApiPartnerFetchParams {
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

export interface ApiPartnerFetchAuthParams {
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
