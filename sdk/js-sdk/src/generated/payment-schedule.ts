import { PaymentScheduleStep } from "./payment-schedule-step";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface PaymentSchedule {
    id: number;
    name: string;
    short_description?: string | null;
    payment_schedule_steps?: PaymentScheduleStep[];
    created_at: string;
    updated_at: string;
}

export class PaymentScheduleClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'payment-schedule';

    public async create(params: PaymentScheduleCreateParams, options?: RequestOptions): Promise<Response<PaymentSchedule>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: PaymentScheduleFetchParams, options?: RequestOptions): Promise<Response<PaymentSchedule>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: PaymentScheduleQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PaymentSchedule>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async update(params: PaymentScheduleUpdateParams, options?: RequestOptions): Promise<Response<PaymentSchedule>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: PaymentScheduleDeleteParams, options?: RequestOptions): Promise<Response<PaymentSchedule>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: PaymentScheduleHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface PaymentScheduleCreateParams {
    name: string;
    short_description?: string | null;
}

export interface PaymentScheduleFetchParams {
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

export interface PaymentScheduleQueryParams {
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

export interface PaymentScheduleUpdateParams {
    id: number;
    name?: string;
    short_description?: string | null;
}

export interface PaymentScheduleDeleteParams {
    id: number;
}

export interface PaymentScheduleHistoryParams {
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
