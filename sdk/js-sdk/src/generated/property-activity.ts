import { TranslatedText, Geo } from './shared';
import { Property } from './property';
import { ActivityType } from './activity-type';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface PropertyActivity {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    property?: Property;
    activity_type?: ActivityType;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
    images?: Image[];
    created_at: string;
    updated_at: string;
}

export class PropertyActivityClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-activity';

    public async query(params?: PropertyActivityQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PropertyActivity>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: PropertyActivityFetchParams, options?: RequestOptions): Promise<Response<PropertyActivity>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: PropertyActivityCreateParams, options?: RequestOptions): Promise<Response<PropertyActivity>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: PropertyActivityUpdateParams, options?: RequestOptions): Promise<Response<PropertyActivity>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: PropertyActivityDeleteParams, options?: RequestOptions): Promise<Response<PropertyActivity>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: PropertyActivityUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async updateImage(params: PropertyActivityUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: PropertyActivityOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async deleteImage(params: PropertyActivityDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }
}

export interface PropertyActivityQueryParams {
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

export interface PropertyActivityFetchParams {
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

export interface PropertyActivityCreateParams {
    external_id?: string | null;
    name?: TranslatedText;
    property?: number;
    activity_type: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface PropertyActivityUpdateParams {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    property?: number;
    activity_type?: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface PropertyActivityDeleteParams {
    id: number;
}

export interface PropertyActivityUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface PropertyActivityUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface PropertyActivityOrderImagesParams {
    id: number;
    order: number[];
}

export interface PropertyActivityDeleteImageParams {
    id: number;
}
