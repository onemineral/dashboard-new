import { RoomSubtype } from './room-subtype';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface RoomType {
    id: number;
    name?: string;
    subtypes?: RoomSubtype[];
    created_at: string;
    updated_at: string;
}

export class RoomTypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'room-type';

    public async query(params?: RoomTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<RoomType>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: RoomTypeFetchParams, options?: RequestOptions): Promise<Response<RoomType>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: RoomTypeCreateParams, options?: RequestOptions): Promise<Response<RoomType>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: RoomTypeUpdateParams, options?: RequestOptions): Promise<Response<RoomType>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: RoomTypeDeleteParams, options?: RequestOptions): Promise<Response<RoomType>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface RoomTypeQueryParams {
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

export interface RoomTypeFetchParams {
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

export interface RoomTypeCreateParams {
    name: string;
}

export interface RoomTypeUpdateParams {
    id: number;
    name?: string;
}

export interface RoomTypeDeleteParams {
    id: number;
}
