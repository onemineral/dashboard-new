import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface AvailabilityStatus {
    id: number;
    name?: string;
    type?: "available" | "unavailable" | "booked";
    calendar_color?: string;
}

export class AvailabilityStatusClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'availability-status';

    public async create(params: AvailabilityStatusCreateParams, options?: RequestOptions): Promise<Response<AvailabilityStatus>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: AvailabilityStatusUpdateParams, options?: RequestOptions): Promise<Response<AvailabilityStatus>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: AvailabilityStatusFetchParams, options?: RequestOptions): Promise<Response<AvailabilityStatus>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: AvailabilityStatusQueryParams, options?: RequestOptions): Promise<PaginatedResponse<AvailabilityStatus>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async history(params?: AvailabilityStatusHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface AvailabilityStatusCreateParams {
    name: string;
    calendar_color: string;
    type: "available" | "unavailable";
}

export interface AvailabilityStatusUpdateParams {
    id: number;
    name: string;
    calendar_color: string;
}

export interface AvailabilityStatusFetchParams {
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

export interface AvailabilityStatusQueryParams {
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

export interface AvailabilityStatusHistoryParams {
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
