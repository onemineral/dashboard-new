import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Channel {
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

export class ChannelClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'channel';

    public async query(params?: ChannelQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Channel>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: ChannelFetchParams, options?: RequestOptions): Promise<Response<Channel>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: ChannelUpdateParams, options?: RequestOptions): Promise<Response<Channel>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async disable(params: ChannelDisableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/disable`,{params,options});
    }

    public async enable(params: ChannelEnableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/enable`,{params,options});
    }

    public async sync(params: ChannelSyncParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync`,{params,options});
    }

    public async integrations(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/integrations`,{options});
    }
}

export interface ChannelQueryParams {
    sort?: Array<{
            field?: string,
            direction?: "asc" | "desc",
            locale?: string | null
        }>;
    where?: {
            conditions?: any,
            conditions_logic?: string | null,
            aggregate_conditions?: any,
            aggregate_conditions_logic?: string | null
        };
    picklist?: boolean;
    no_auto_relations?: boolean | null;
    property?: number;
    paginate?: {
            page?: number,
            perpage?: number
        };
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

export interface ChannelFetchParams {
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

export interface ChannelUpdateParams {
    id: number;
    name: string;
    markup?: number;
}

export interface ChannelDisableParams {
    id: number;
}

export interface ChannelEnableParams {
    id: number;
}

export interface ChannelSyncParams {
    id: number;
}
