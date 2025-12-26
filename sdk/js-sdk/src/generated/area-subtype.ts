import { AreaType } from './area-type';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface AreaSubtype {
    id: number;
    name: string;
    type: AreaType;
    created_at: string;
    updated_at: string;
}

export class AreaSubtypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'area-subtype';

    public async query(params?: AreaSubtypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<AreaSubtype>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: AreaSubtypeFetchParams, options?: RequestOptions): Promise<Response<AreaSubtype>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: AreaSubtypeCreateParams, options?: RequestOptions): Promise<Response<AreaSubtype>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: AreaSubtypeUpdateParams, options?: RequestOptions): Promise<Response<AreaSubtype>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: AreaSubtypeDeleteParams, options?: RequestOptions): Promise<Response<AreaSubtype>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface AreaSubtypeQueryParams {
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

export interface AreaSubtypeFetchParams {
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

export interface AreaSubtypeCreateParams {
    name: string;
    type: number;
}

export interface AreaSubtypeUpdateParams {
    id: number;
    name?: string;
    type?: number;
}

export interface AreaSubtypeDeleteParams {
    id: number;
}
