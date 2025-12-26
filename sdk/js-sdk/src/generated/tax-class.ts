import { Tax } from "./tax";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface TaxClass {
    id: number;
    name: string;
    taxes?: Tax[];
    created_at: string;
    updated_at: string;
}

export class TaxClassClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'tax-class';

    public async create(params: TaxClassCreateParams, options?: RequestOptions): Promise<Response<TaxClass>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: TaxClassUpdateParams, options?: RequestOptions): Promise<Response<TaxClass>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: TaxClassFetchParams, options?: RequestOptions): Promise<Response<TaxClass>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: TaxClassQueryParams, options?: RequestOptions): Promise<PaginatedResponse<TaxClass>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async history(params?: TaxClassHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface TaxClassCreateParams {
    name: string;
    taxes: Array<{
            tax_type: "VAT/GST" | "Local tax" | "Tourist tax (%)" | "Tourist tax (flat)" | "State tax" | "Room tax",
            amount: number,
            amount_type: "per_guest_per_night" | "per_guest_per_stay" | "per_night",
            percent: number,
            is_excluded: boolean
        }>;
}

export interface TaxClassUpdateParams {
    id: number;
    name: string;
    taxes?: Array<{
            tax_type: "VAT/GST" | "Local tax" | "Tourist tax (%)" | "Tourist tax (flat)" | "State tax" | "Room tax",
            amount: number,
            amount_type: "per_guest_per_night" | "per_guest_per_stay" | "per_night",
            percent: number,
            is_excluded: boolean
        }>;
}

export interface TaxClassFetchParams {
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

export interface TaxClassQueryParams {
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

export interface TaxClassHistoryParams {
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
