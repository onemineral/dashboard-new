import { TranslatedText } from './shared';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface ActivityType {
    id: number;
    name?: TranslatedText;
    created_at: string;
    updated_at: string;
}

export class ActivityTypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'activity-type';

    public async query(params?: ActivityTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ActivityType>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: ActivityTypeFetchParams, options?: RequestOptions): Promise<Response<ActivityType>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params?: ActivityTypeCreateParams, options?: RequestOptions): Promise<Response<ActivityType>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: ActivityTypeUpdateParams, options?: RequestOptions): Promise<Response<ActivityType>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: ActivityTypeDeleteParams, options?: RequestOptions): Promise<Response<ActivityType>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface ActivityTypeQueryParams {
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

export interface ActivityTypeFetchParams {
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

export interface ActivityTypeCreateParams {
    name?: TranslatedText;
}

export interface ActivityTypeUpdateParams {
    id: number;
    name?: TranslatedText;
}

export interface ActivityTypeDeleteParams {
    id: number;
}
