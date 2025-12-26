import { Property } from "./property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Knowledgebase {
    id: number;
    property: Property;
    is_enabled: boolean;
    is_ai_generated: boolean;
    title: string;
    content_public: string;
    content_sensitive: string;
    ai_content_public: string;
    ai_content_sensitive: string;
    detected_count_in_threads: number;
    created_at: string;
    updated_at: string;
}

export class KnowledgebaseClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'knowledgebase';

    public async fetch(params: KnowledgebaseFetchParams, options?: RequestOptions): Promise<Response<Knowledgebase>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: KnowledgebaseQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Knowledgebase>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async create(params: KnowledgebaseCreateParams, options?: RequestOptions): Promise<Response<Knowledgebase>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: KnowledgebaseUpdateParams, options?: RequestOptions): Promise<Response<Knowledgebase>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async updateStatus(params: KnowledgebaseUpdateStatusParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-status`,{params,options});
    }
}

export interface KnowledgebaseFetchParams {
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

export interface KnowledgebaseQueryParams {
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

export interface KnowledgebaseCreateParams {
    property: number;
    title: string;
    content_public: string;
    content_sensitive?: string;
}

export interface KnowledgebaseUpdateParams {
    id: number;
    property: number;
    title: string;
    content_public?: string;
    content_sensitive?: string;
}

export interface KnowledgebaseUpdateStatusParams {
    id: number;
    enabled?: boolean;
}
