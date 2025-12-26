import { ItemSubtype } from './item-subtype';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface ItemType {
    id: number;
    name?: string;
    subtypes?: ItemSubtype[];
    created_at: string;
    updated_at: string;
}

export class ItemTypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'item-type';

    public async query(params?: ItemTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ItemType>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: ItemTypeFetchParams, options?: RequestOptions): Promise<Response<ItemType>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: ItemTypeCreateParams, options?: RequestOptions): Promise<Response<ItemType>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: ItemTypeUpdateParams, options?: RequestOptions): Promise<Response<ItemType>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: ItemTypeDeleteParams, options?: RequestOptions): Promise<Response<ItemType>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface ItemTypeQueryParams {
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

export interface ItemTypeFetchParams {
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

export interface ItemTypeCreateParams {
    name: string;
}

export interface ItemTypeUpdateParams {
    id: number;
    name?: string;
}

export interface ItemTypeDeleteParams {
    id: number;
}
