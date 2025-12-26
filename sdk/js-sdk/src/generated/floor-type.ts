import { FloorSubtype } from './floor-subtype';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface FloorType {
    id: number;
    name?: string;
    subtypes?: FloorSubtype[];
    created_at: string;
    updated_at: string;
}

export class FloorTypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'floor-type';

    public async query(params?: FloorTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<FloorType>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: FloorTypeFetchParams, options?: RequestOptions): Promise<Response<FloorType>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: FloorTypeCreateParams, options?: RequestOptions): Promise<Response<FloorType>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: FloorTypeUpdateParams, options?: RequestOptions): Promise<Response<FloorType>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: FloorTypeDeleteParams, options?: RequestOptions): Promise<Response<FloorType>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface FloorTypeQueryParams {
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

export interface FloorTypeFetchParams {
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

export interface FloorTypeCreateParams {
    name: string;
}

export interface FloorTypeUpdateParams {
    id: number;
    name?: string;
}

export interface FloorTypeDeleteParams {
    id: number;
}
