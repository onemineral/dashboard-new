import { TranslatedText } from "./shared";
import { Property } from "./property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface PropertyType {
    id: number;
    name: TranslatedText;
    original_name: string;
    properties?: Property[];
}

export class PropertyTypeClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'property-type';

    public async query(params?: PropertyTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PropertyType>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: PropertyTypeFetchParams, options?: RequestOptions): Promise<Response<PropertyType>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params?: PropertyTypeCreateParams, options?: RequestOptions): Promise<Response<PropertyType>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PropertyTypeUpdateParams, options?: RequestOptions): Promise<Response<PropertyType>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: PropertyTypeDeleteParams, options?: RequestOptions): Promise<Response<PropertyType>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: PropertyTypeHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface PropertyTypeQueryParams {
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

export interface PropertyTypeFetchParams {
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

export interface PropertyTypeCreateParams {
    name?: TranslatedText;
}

export interface PropertyTypeUpdateParams {
    id: number;
    name?: TranslatedText;
}

export interface PropertyTypeDeleteParams {
    id: number;
}

export interface PropertyTypeHistoryParams {
    id?: number;
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
    paginate?: {
            page?: number,
            perpage?: number
        };
}
