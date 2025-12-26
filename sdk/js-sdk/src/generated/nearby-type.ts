import { TranslatedText } from './shared';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface NearbyType {
    id: number;
    name?: TranslatedText;
}

export class NearbyTypeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'nearby-type';

    public async query(params?: NearbyTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<NearbyType>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: NearbyTypeFetchParams, options?: RequestOptions): Promise<Response<NearbyType>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params?: NearbyTypeCreateParams, options?: RequestOptions): Promise<Response<NearbyType>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: NearbyTypeUpdateParams, options?: RequestOptions): Promise<Response<NearbyType>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: NearbyTypeDeleteParams, options?: RequestOptions): Promise<Response<NearbyType>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface NearbyTypeQueryParams {
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

export interface NearbyTypeFetchParams {
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

export interface NearbyTypeCreateParams {
    name?: TranslatedText;
}

export interface NearbyTypeUpdateParams {
    id: number;
    name?: TranslatedText;
}

export interface NearbyTypeDeleteParams {
    id: number;
}
