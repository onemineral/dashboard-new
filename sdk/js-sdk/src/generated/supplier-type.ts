import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface SupplierType {
    id: number;
    name?: string;
    applies_to?: Array<"booking" | "property">;
}

export class SupplierTypeClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'supplier-type';

    public async create(params: SupplierTypeCreateParams, options?: RequestOptions): Promise<Response<SupplierType>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: SupplierTypeUpdateParams, options?: RequestOptions): Promise<Response<SupplierType>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: SupplierTypeFetchParams, options?: RequestOptions): Promise<Response<SupplierType>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: SupplierTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<SupplierType>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async del(params: SupplierTypeDeleteParams, options?: RequestOptions): Promise<Response<SupplierType>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface SupplierTypeCreateParams {
    name: string;
    applies_to?: Array<"booking" | "property">;
}

export interface SupplierTypeUpdateParams {
    id: number;
    name: string;
    applies_to?: Array<"booking" | "property">;
}

export interface SupplierTypeFetchParams {
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

export interface SupplierTypeQueryParams {
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

export interface SupplierTypeDeleteParams {
    id: number;
}
