import { TranslatedText, Geo } from './shared';
import { Location } from './location';
import { ActivityType } from './activity-type';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface LocationActivity {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    location?: Location;
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

export class LocationActivityClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'location-activity';

    public async query(params?: LocationActivityQueryParams, options?: RequestOptions): Promise<PaginatedResponse<LocationActivity>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: LocationActivityFetchParams, options?: RequestOptions): Promise<Response<LocationActivity>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: LocationActivityCreateParams, options?: RequestOptions): Promise<Response<LocationActivity>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: LocationActivityUpdateParams, options?: RequestOptions): Promise<Response<LocationActivity>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: LocationActivityDeleteParams, options?: RequestOptions): Promise<Response<LocationActivity>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: LocationActivityUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async updateImage(params: LocationActivityUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: LocationActivityOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async deleteImage(params: LocationActivityDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }
}

export interface LocationActivityQueryParams {
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

export interface LocationActivityFetchParams {
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

export interface LocationActivityCreateParams {
    external_id?: string | null;
    name?: TranslatedText;
    location?: number;
    activity_type: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface LocationActivityUpdateParams {
    id: number;
    external_id?: string | null;
    name?: TranslatedText;
    location?: number;
    activity_type?: number;
    description?: TranslatedText | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    order?: number;
    is_featured?: boolean;
}

export interface LocationActivityDeleteParams {
    id: number;
}

export interface LocationActivityUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface LocationActivityUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface LocationActivityOrderImagesParams {
    id: number;
    order: number[];
}

export interface LocationActivityDeleteImageParams {
    id: number;
}
