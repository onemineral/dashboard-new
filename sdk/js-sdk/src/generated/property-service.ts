import { Property } from './property';
import { TranslatedText } from './shared';
import { ServiceType } from './service-type';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface PropertyService {
    id: number;
    property?: Property;
    external_id?: string | null;
    name?: TranslatedText;
    service_type?: ServiceType;
    description?: TranslatedText | null;
    is_featured?: boolean;
    applies?: 'per_day' | 'per_stay' | 'per_person' | 'per_person_per_day';
    amount?: number;
    is_included?: boolean;
}

export class PropertyServiceClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-service';

    public async query(params?: PropertyServiceQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PropertyService>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: PropertyServiceFetchParams, options?: RequestOptions): Promise<Response<PropertyService>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: PropertyServiceCreateParams, options?: RequestOptions): Promise<Response<PropertyService>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: PropertyServiceUpdateParams, options?: RequestOptions): Promise<Response<PropertyService>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: PropertyServiceDeleteParams, options?: RequestOptions): Promise<Response<PropertyService>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }
}

export interface PropertyServiceQueryParams {
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

export interface PropertyServiceFetchParams {
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

export interface PropertyServiceCreateParams {
    property: number;
    external_id?: string | null;
    name?: TranslatedText;
    service_type: number | null;
    description?: TranslatedText | null;
    is_featured?: boolean;
    applies: 'per_day' | 'per_stay' | 'per_person' | 'per_person_per_day';
    amount: number;
    is_included?: boolean;
}

export interface PropertyServiceUpdateParams {
    id: number;
    property?: number;
    external_id?: string | null;
    name?: TranslatedText;
    service_type?: number | null;
    description?: TranslatedText | null;
    is_featured?: boolean;
    applies?: 'per_day' | 'per_stay' | 'per_person' | 'per_person_per_day';
    amount?: number;
    is_included?: boolean;
}

export interface PropertyServiceDeleteParams {
    id: number;
}
