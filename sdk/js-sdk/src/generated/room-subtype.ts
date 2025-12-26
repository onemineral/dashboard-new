import { RoomType } from './room-type';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface RoomSubtype {
    id: number;
    name?: string;
    type?: RoomType;
    created_at: string;
    updated_at: string;
}

export class RoomSubtypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'room-subtype';

    public async query(params?: RoomSubtypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<RoomSubtype>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: RoomSubtypeFetchParams, options?: RequestOptions): Promise<Response<RoomSubtype>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: RoomSubtypeCreateParams, options?: RequestOptions): Promise<Response<RoomSubtype>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: RoomSubtypeUpdateParams, options?: RequestOptions): Promise<Response<RoomSubtype>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: RoomSubtypeDeleteParams, options?: RequestOptions): Promise<Response<RoomSubtype>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface RoomSubtypeQueryParams {
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

export interface RoomSubtypeFetchParams {
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

export interface RoomSubtypeCreateParams {
    name: string;
    type: number;
}

export interface RoomSubtypeUpdateParams {
    id: number;
    name?: string;
    type?: number;
}

export interface RoomSubtypeDeleteParams {
    id: number;
}
