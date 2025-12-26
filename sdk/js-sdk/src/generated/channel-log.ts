import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response, PaginatedResponse } from '../response';

export interface ChannelLog {
    id: number;
    job_name: string;
    status: 'waiting' | 'failed' | 'processing' | 'finished';
    tries: number;
    execution_time: number;
    error_message?: string;
    error_trace?: string;
    created_at: string;
    updated_at: string;
}

export class ChannelLogClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'channel-log';

    public async retry(params: ChannelLogRetryParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/retry`, {
            params,
            options,
        });
    }

    public async query(params?: ChannelLogQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ChannelLog>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: ChannelLogFetchParams, options?: RequestOptions): Promise<Response<ChannelLog>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }
}

export interface ChannelLogRetryParams {
    id: number;
}

export interface ChannelLogQueryParams {
    sort?: Array<{
        field?: string;
        direction?: 'asc' | 'desc';
        locale?: string | null;
    }>;
    where?: {
        conditions?: any;
        conditions_logic?: string | null;
        aggregate_conditions?: any;
        aggregate_conditions_logic?: string | null;
    };
    paginate?: {
        page?: number;
        perpage?: number;
    };
    with?: string[];
    with_aggregations?: Array<{
        type?: 'count' | 'avg' | 'sum' | 'min' | 'max';
        as?: string;
        relation?: string;
        field?: string;
        where?: {
            conditions?: any;
            conditions_logic?: string | null;
        };
    }>;
}

export interface ChannelLogFetchParams {
    id: number;
    with?: string[];
    with_aggregations?: Array<{
        type?: 'count' | 'avg' | 'sum' | 'min' | 'max';
        as?: string;
        relation?: string;
        field?: string;
        where?: {
            conditions?: any;
            conditions_logic?: string | null;
        };
    }>;
}
