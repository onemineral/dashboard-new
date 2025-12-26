import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Zapier {
}

export class ZapierClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'zapier';

    public async resourceOutput(params: ZapierResourceOutputParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/resource-output`,{params,options});
    }

    public async queryBookingPayments(params?: ZapierQueryBookingPaymentsParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/query-booking-payments`,{params,options});
    }
}

export interface ZapierResourceOutputParams {
    resource: string;
    with?: string[];
}

export interface ZapierQueryBookingPaymentsParams {
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
