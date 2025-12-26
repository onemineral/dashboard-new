import { FloorType } from './floor-type';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface FloorSubtype {
    id: number;
    name?: string;
    type?: FloorType;
    created_at: string;
    updated_at: string;
}

export class FloorSubtypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'floor-subtype';

    public async query(params?: FloorSubtypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<FloorSubtype>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: FloorSubtypeFetchParams, options?: RequestOptions): Promise<Response<FloorSubtype>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: FloorSubtypeCreateParams, options?: RequestOptions): Promise<Response<FloorSubtype>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: FloorSubtypeUpdateParams, options?: RequestOptions): Promise<Response<FloorSubtype>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: FloorSubtypeDeleteParams, options?: RequestOptions): Promise<Response<FloorSubtype>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface FloorSubtypeQueryParams {
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

export interface FloorSubtypeFetchParams {
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

export interface FloorSubtypeCreateParams {
    name: string;
    type: number;
}

export interface FloorSubtypeUpdateParams {
    id: number;
    name?: string;
    type?: number;
}

export interface FloorSubtypeDeleteParams {
    id: number;
}
