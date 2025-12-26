import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface ServiceType {
    id: number;
    name: TranslatedText;
    description?: TranslatedText | null;
    created_at: string;
    updated_at: string;
}

export class ServiceTypeClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'service-type';

    public async create(params?: ServiceTypeCreateParams, options?: RequestOptions): Promise<Response<ServiceType>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: ServiceTypeUpdateParams, options?: RequestOptions): Promise<Response<ServiceType>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async query(params?: ServiceTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ServiceType>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: ServiceTypeFetchParams, options?: RequestOptions): Promise<Response<ServiceType>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: ServiceTypeDeleteParams, options?: RequestOptions): Promise<Response<ServiceType>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface ServiceTypeCreateParams {
    name?: TranslatedText;
    description?: TranslatedText | null;
}

export interface ServiceTypeUpdateParams {
    id: number;
    name?: TranslatedText;
    description?: TranslatedText | null;
}

export interface ServiceTypeQueryParams {
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

export interface ServiceTypeFetchParams {
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

export interface ServiceTypeDeleteParams {
    id: number;
}
