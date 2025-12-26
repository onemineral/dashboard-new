import { Area } from './area';
import { FloorType } from './floor-type';
import { FloorSubtype } from './floor-subtype';
import { Room } from './room';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface Floor {
    id: number;
    name?: string;
    area?: Area;
    type?: FloorType;
    subtype?: FloorSubtype;
    description?: string | null;
    notes?: string | null;
    order?: number;
    size_sq_m?: number | null;
    rooms?: Room[];
    created_at: string;
    updated_at: string;
}

export class FloorClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'floor';

    public async query(params?: FloorQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Floor>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: FloorFetchParams, options?: RequestOptions): Promise<Response<Floor>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: FloorCreateParams, options?: RequestOptions): Promise<Response<Floor>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: FloorUpdateParams, options?: RequestOptions): Promise<Response<Floor>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: FloorDeleteParams, options?: RequestOptions): Promise<Response<Floor>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async orderRooms(params: FloorOrderRoomsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-rooms`, {
            params,
            options,
        });
    }
}

export interface FloorQueryParams {
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

export interface FloorFetchParams {
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

export interface FloorCreateParams {
    area: number;
    type: number;
    subtype?: number | null;
    description?: string | null;
    notes?: string | null;
    order?: number;
    size_sq_m?: number | null;
}

export interface FloorUpdateParams {
    id: number;
    area?: number;
    type?: number;
    subtype?: number | null;
    description?: string | null;
    notes?: string | null;
    order?: number;
    size_sq_m?: number | null;
}

export interface FloorDeleteParams {
    id: number;
}

export interface FloorOrderRoomsParams {
    id: number;
    order: number[];
}
