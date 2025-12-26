import { TranslatedText } from './shared';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface LocationCategory {
    id: number;
    name: TranslatedText;
}

export class LocationCategoryClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'location-category';

    public async query(params?: LocationCategoryQueryParams, options?: RequestOptions): Promise<PaginatedResponse<LocationCategory>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: LocationCategoryFetchParams, options?: RequestOptions): Promise<Response<LocationCategory>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: LocationCategoryCreateParams, options?: RequestOptions): Promise<Response<LocationCategory>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: LocationCategoryUpdateParams, options?: RequestOptions): Promise<Response<LocationCategory>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: LocationCategoryDeleteParams, options?: RequestOptions): Promise<Response<LocationCategory>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async history(params?: LocationCategoryHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`, {
            params,
            options,
        });
    }
}

export interface LocationCategoryQueryParams {
    sort?: {
        id?: {
            direction?: 'asc' | 'desc';
        };
        name?: {
            direction?: 'asc' | 'desc';
            locale?: 'en';
        };
    };
    where?: {
        conditions?: any;
        conditions_logic?: string | null;
    };
    paginate?: {
        page?: number;
        perpage?: number;
    };
    with?: string[];
}

export interface LocationCategoryFetchParams {
    id: number;
    with?: string[];
}

export interface LocationCategoryCreateParams {
    name: TranslatedText;
}

export interface LocationCategoryUpdateParams {
    id: number;
    name: TranslatedText;
}

export interface LocationCategoryDeleteParams {
    id: number;
}

export interface LocationCategoryHistoryParams {
    id?: number;
    with?: string[];
    paginate?: {
        page?: number;
        perpage?: number;
    };
}
