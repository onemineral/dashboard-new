import { ItemType } from './item-type';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface ItemSubtype {
    id: number;
    name?: string;
    type?: ItemType;
    created_at: string;
    updated_at: string;
}

export class ItemSubtypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'item-subtype';

    public async query(params?: ItemSubtypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ItemSubtype>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: ItemSubtypeFetchParams, options?: RequestOptions): Promise<Response<ItemSubtype>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: ItemSubtypeCreateParams, options?: RequestOptions): Promise<Response<ItemSubtype>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: ItemSubtypeUpdateParams, options?: RequestOptions): Promise<Response<ItemSubtype>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: ItemSubtypeDeleteParams, options?: RequestOptions): Promise<Response<ItemSubtype>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface ItemSubtypeQueryParams {
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

export interface ItemSubtypeFetchParams {
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

export interface ItemSubtypeCreateParams {
    name: string;
    type: number;
}

export interface ItemSubtypeUpdateParams {
    id: number;
    name?: string;
    type?: number;
}

export interface ItemSubtypeDeleteParams {
    id: number;
}
