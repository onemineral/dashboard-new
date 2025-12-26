import { Country } from './country';
import { LegalEntity } from './legal-entity';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response, PaginatedResponse } from '../response';

export interface TenantContact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    type?: 'general' | 'invoice' | 'availability' | 'reservations';
    country?: Country;
    legal_entity?: LegalEntity;
}

export class TenantContactClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'tenant-contact';

    public async update(params: TenantContactUpdateParams, options?: RequestOptions): Promise<Response<TenantContact>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async create(params: TenantContactCreateParams, options?: RequestOptions): Promise<Response<TenantContact>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async del(params: TenantContactDeleteParams, options?: RequestOptions): Promise<Response<TenantContact>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async query(params?: TenantContactQueryParams, options?: RequestOptions): Promise<PaginatedResponse<TenantContact>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: TenantContactFetchParams, options?: RequestOptions): Promise<Response<TenantContact>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }
}

export interface TenantContactUpdateParams {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    type: 'general' | 'invoice' | 'availability' | 'reservations';
    country: number;
    legal_entity: number;
}

export interface TenantContactCreateParams {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    type: 'general' | 'invoice' | 'availability' | 'reservations';
    country: number;
    legal_entity: number;
}

export interface TenantContactDeleteParams {
    id: number;
}

export interface TenantContactQueryParams {
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
    picklist?: boolean;
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

export interface TenantContactFetchParams {
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
