import { Property } from './property';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface PropertyHighlight {
    id: number;
    name?: string | null;
    property?: Property;
    description?: string | null;
    image?: Image;
}

export class PropertyHighlightClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-highlight';

    public async query(params?: PropertyHighlightQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PropertyHighlight>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: PropertyHighlightFetchParams, options?: RequestOptions): Promise<Response<PropertyHighlight>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: PropertyHighlightCreateParams, options?: RequestOptions): Promise<Response<PropertyHighlight>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: PropertyHighlightUpdateParams, options?: RequestOptions): Promise<Response<PropertyHighlight>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: PropertyHighlightDeleteParams, options?: RequestOptions): Promise<Response<PropertyHighlight>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: PropertyHighlightUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }
}

export interface PropertyHighlightQueryParams {
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

export interface PropertyHighlightFetchParams {
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

export interface PropertyHighlightCreateParams {
    name: string | null;
    property: number;
    description?: string | null;
}

export interface PropertyHighlightUpdateParams {
    id: number;
    name?: string | null;
    property?: number;
    description?: string | null;
}

export interface PropertyHighlightDeleteParams {
    id: number;
}

export interface PropertyHighlightUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}
