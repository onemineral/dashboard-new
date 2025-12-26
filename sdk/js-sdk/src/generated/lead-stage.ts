import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response, PaginatedResponse } from '../response';

export interface LeadStage {
    id: number;
    name?: string;
    stage_type?: 'open' | 'closed_lost';
    is_default_open: boolean;
    is_default_closed_won: boolean;
    color: string;
    created_at: string;
    updated_at: string;
}

export class LeadStageClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'lead-stage';

    public async create(params: LeadStageCreateParams, options?: RequestOptions): Promise<Response<LeadStage>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async query(params?: LeadStageQueryParams, options?: RequestOptions): Promise<PaginatedResponse<LeadStage>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async update(params: LeadStageUpdateParams, options?: RequestOptions): Promise<Response<LeadStage>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async fetch(params: LeadStageFetchParams, options?: RequestOptions): Promise<Response<LeadStage>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async del(params: LeadStageDeleteParams, options?: RequestOptions): Promise<Response<LeadStage>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async order(params: LeadStageOrderParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order`, {
            params,
            options,
        });
    }
}

export interface LeadStageCreateParams {
    name: string;
    stage_type: 'open' | 'closed_lost';
    is_default_open?: boolean;
    is_default_closed_won?: boolean;
    color: string;
}

export interface LeadStageQueryParams {
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
    no_auto_relations?: boolean | null;
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

export interface LeadStageUpdateParams {
    id: number;
    name: string;
    stage_type: 'open' | 'closed_lost';
    is_default_open?: boolean;
    is_default_closed_won?: boolean;
    color: string;
}

export interface LeadStageFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
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

export interface LeadStageDeleteParams {
    id: number;
}

export interface LeadStageOrderParams {
    order: number[];
}
