import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Region {
    id: number;
    name: TranslatedText;
}

export class RegionClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'region';

    public async query(params?: RegionQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Region>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: RegionFetchParams, options?: RequestOptions): Promise<Response<Region>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params?: RegionCreateParams, options?: RequestOptions): Promise<Response<Region>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: RegionUpdateParams, options?: RequestOptions): Promise<Response<Region>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: RegionDeleteParams, options?: RequestOptions): Promise<Response<Region>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface RegionQueryParams {
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

export interface RegionFetchParams {
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

export interface RegionCreateParams {
    name?: TranslatedText;
}

export interface RegionUpdateParams {
    id: number;
    name?: TranslatedText;
}

export interface RegionDeleteParams {
    id: number;
}
