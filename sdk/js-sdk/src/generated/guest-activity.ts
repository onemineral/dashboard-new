import { TranslatedText, Geo } from './shared';
import { Location } from './location';
import { Property } from './property';
import { ActivityType } from './activity-type';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface GuestActivity {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    location?: Location;
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

export class GuestActivityClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'guest-activity';

    public async query(params?: GuestActivityQueryParams, options?: RequestOptions): Promise<PaginatedResponse<GuestActivity>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: GuestActivityFetchParams, options?: RequestOptions): Promise<Response<GuestActivity>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: GuestActivityCreateParams, options?: RequestOptions): Promise<Response<GuestActivity>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: GuestActivityUpdateParams, options?: RequestOptions): Promise<Response<GuestActivity>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: GuestActivityDeleteParams, options?: RequestOptions): Promise<Response<GuestActivity>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: GuestActivityUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async updateImage(params: GuestActivityUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: GuestActivityOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async deleteImage(params: GuestActivityDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }
}

export interface GuestActivityQueryParams {
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

export interface GuestActivityFetchParams {
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

export interface GuestActivityCreateParams {
    external_id?: string | null;
    name?: TranslatedText;
    location?: number;
    property?: number;
    activity_type: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface GuestActivityUpdateParams {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    location?: number;
    property?: number;
    activity_type?: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface GuestActivityDeleteParams {
    id: number;
}

export interface GuestActivityUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface GuestActivityUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface GuestActivityOrderImagesParams {
    id: number;
    order: number[];
}

export interface GuestActivityDeleteImageParams {
    id: number;
}
