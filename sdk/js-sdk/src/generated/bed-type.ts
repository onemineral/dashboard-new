import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface BedType {
    id: number;
    name: TranslatedText;
    original_name: string;
    adults: number;
    children: number;
    babies: number;
}

export class BedTypeClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'bed-type';

    public async create(params?: BedTypeCreateParams, options?: RequestOptions): Promise<Response<BedType>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: BedTypeFetchParams, options?: RequestOptions): Promise<Response<BedType>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: BedTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<BedType>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async update(params: BedTypeUpdateParams, options?: RequestOptions): Promise<Response<BedType>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: BedTypeDeleteParams, options?: RequestOptions): Promise<Response<BedType>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: BedTypeHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface BedTypeCreateParams {
    name?: TranslatedText;
    adults?: number;
    children?: number;
    babies?: number;
}

export interface BedTypeFetchParams {
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

export interface BedTypeQueryParams {
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

export interface BedTypeUpdateParams {
    id: number;
    name?: TranslatedText;
    adults?: number;
    children?: number;
    babies?: number;
}

export interface BedTypeDeleteParams {
    id: number;
}

export interface BedTypeHistoryParams {
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
