import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Country {
    id: number;
    name: TranslatedText;
    region?: TranslatedText | null;
    iso_code_2: string;
    iso_code_3: string;
    created_at: string;
    updated_at: string;
}

export class CountryClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'country';

    public async query(params?: CountryQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Country>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: CountryFetchParams, options?: RequestOptions): Promise<Response<Country>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: CountryUpdateParams, options?: RequestOptions): Promise<Response<Country>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async history(params?: CountryHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface CountryQueryParams {
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

export interface CountryFetchParams {
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

export interface CountryUpdateParams {
    id: number;
    name?: TranslatedText;
    region?: TranslatedText | null;
}

export interface CountryHistoryParams {
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
