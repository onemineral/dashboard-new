import { Account } from './account';
import { ChannelProperty } from './channel-property';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface Hirum {
    id: number;
    name: string;
    external_id: string;
    status: 'enabled' | 'pending' | 'disabled';
    options: any;
    provider: string;
    logo_url: string;
    icon_url: string;
    account?: Account;
    markup: number;
    connection: ChannelProperty;
    created_at: string;
    updated_at: string;
}

export class HirumClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'hirum';

    public async query(params?: HirumQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Hirum>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: HirumFetchParams, options?: RequestOptions): Promise<Response<Hirum>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async update(params: HirumUpdateParams, options?: RequestOptions): Promise<Response<Hirum>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async disable(params: HirumDisableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/disable`, {
            params,
            options,
        });
    }

    public async enable(params: HirumEnableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/enable`, {
            params,
            options,
        });
    }

    public async sync(params: HirumSyncParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync`, { params, options });
    }

    public async create(params: HirumCreateParams, options?: RequestOptions): Promise<Response<Hirum>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }
}

export interface HirumQueryParams {
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
    property?: number;
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

export interface HirumFetchParams {
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

export interface HirumUpdateParams {
    id: number;
    name: string;
    markup?: number;
}

export interface HirumDisableParams {
    id: number;
}

export interface HirumEnableParams {
    id: number;
}

export interface HirumSyncParams {
    id: number;
}

export interface HirumCreateParams {
    name: string;
    external_id: string;
}
