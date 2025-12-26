import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface LosTemplate {
    id: number;
    name: string;
    config: number[];
    nights: number[];
    created_at: string;
    updated_at: string;
}

export class LosTemplateClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'los-template';

    public async query(params?: LosTemplateQueryParams, options?: RequestOptions): Promise<PaginatedResponse<LosTemplate>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: LosTemplateFetchParams, options?: RequestOptions): Promise<Response<LosTemplate>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: LosTemplateCreateParams, options?: RequestOptions): Promise<Response<LosTemplate>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }
}

export interface LosTemplateQueryParams {
    sort?: Array<{
            field?: string,
            direction?: "asc" | "desc",
            locale?: string | null
        }>;
    where?: {
            conditions?: any,
            conditions_logic?: string | null,
            aggregate_conditions?: any,
            aggregate_conditions_logic?: string | null
        };
    picklist?: boolean;
    no_auto_relations?: boolean | null;
    paginate?: {
            page?: number,
            perpage?: number
        };
    with?: string[];
    with_aggregations?: Array<{
            type?: "count" | "avg" | "sum" | "min" | "max",
            as?: string,
            relation?: string,
            field?: string,
            where?: {
                conditions?: any,
                conditions_logic?: string | null
            }
        }>;
}

export interface LosTemplateFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
    with?: string[];
    with_aggregations?: Array<{
            type?: "count" | "avg" | "sum" | "min" | "max",
            as?: string,
            relation?: string,
            field?: string,
            where?: {
                conditions?: any,
                conditions_logic?: string | null
            }
        }>;
}

export interface LosTemplateCreateParams {
    name: string;
    config: number[];
}
