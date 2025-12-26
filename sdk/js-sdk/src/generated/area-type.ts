import { AreaSubtype } from './area-subtype';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface AreaType {
    id: number;
    name: string;
    subtypes?: AreaSubtype[];
    created_at: string;
    updated_at: string;
}

export class AreaTypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'area-type';

    public async query(params?: AreaTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<AreaType>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: AreaTypeFetchParams, options?: RequestOptions): Promise<Response<AreaType>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: AreaTypeCreateParams, options?: RequestOptions): Promise<Response<AreaType>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: AreaTypeUpdateParams, options?: RequestOptions): Promise<Response<AreaType>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: AreaTypeDeleteParams, options?: RequestOptions): Promise<Response<AreaType>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface AreaTypeQueryParams {
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

export interface AreaTypeFetchParams {
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

export interface AreaTypeCreateParams {
    name: string;
}

export interface AreaTypeUpdateParams {
    id: number;
    name?: string;
}

export interface AreaTypeDeleteParams {
    id: number;
}
