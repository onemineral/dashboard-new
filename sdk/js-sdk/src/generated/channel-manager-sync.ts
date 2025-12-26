import { Channel } from "./channel";
import { Property } from "./property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface ChannelManagerSync {
    id: number;
    channel?: Channel;
    resource: {
            type: 'property',
            record: Property
        };
    status: "pending" | "running";
    provider: string;
    event: string;
    changes: number;
    last_sync_at: string;
    last_successful_sync_at: string;
    last_sync_error_message: string;
    last_sync_status: "running" | "success" | "skipped" | "failed";
    last_sync_changes: number;
    retries: number;
    warnings: any;
    created_at: string;
    updated_at: string;
}

export class ChannelManagerSyncClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'channel-manager-sync';

    public async query(params?: ChannelManagerSyncQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ChannelManagerSync>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: ChannelManagerSyncFetchParams, options?: RequestOptions): Promise<Response<ChannelManagerSync>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async retry(params?: ChannelManagerSyncRetryParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/retry`,{params,options});
    }
}

export interface ChannelManagerSyncQueryParams {
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

export interface ChannelManagerSyncFetchParams {
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

export interface ChannelManagerSyncRetryParams {
    id?: number;
}
