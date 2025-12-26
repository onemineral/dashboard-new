import { TranslatedText, Geo } from './shared';
import { Property } from './property';
import { NearbyType } from './nearby-type';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface PropertyNearby {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    property?: Property;
    nearby_type?: NearbyType;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
    images?: Image[];
}

export class PropertyNearbyClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-nearby';

    public async query(params?: PropertyNearbyQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PropertyNearby>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: PropertyNearbyFetchParams, options?: RequestOptions): Promise<Response<PropertyNearby>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: PropertyNearbyCreateParams, options?: RequestOptions): Promise<Response<PropertyNearby>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: PropertyNearbyUpdateParams, options?: RequestOptions): Promise<Response<PropertyNearby>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: PropertyNearbyDeleteParams, options?: RequestOptions): Promise<Response<PropertyNearby>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: PropertyNearbyUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async updateImage(params: PropertyNearbyUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: PropertyNearbyOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async uploadMainImage(params: PropertyNearbyUploadMainImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-main-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async deleteImage(params: PropertyNearbyDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }
}

export interface PropertyNearbyQueryParams {
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

export interface PropertyNearbyFetchParams {
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

export interface PropertyNearbyCreateParams {
    external_id?: string | null;
    name?: TranslatedText;
    property?: number;
    nearby_type: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface PropertyNearbyUpdateParams {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    property?: number;
    nearby_type?: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface PropertyNearbyDeleteParams {
    id: number;
}

export interface PropertyNearbyUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface PropertyNearbyUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface PropertyNearbyOrderImagesParams {
    id: number;
    order: number[];
}

export interface PropertyNearbyUploadMainImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface PropertyNearbyDeleteImageParams {
    id: number;
}
