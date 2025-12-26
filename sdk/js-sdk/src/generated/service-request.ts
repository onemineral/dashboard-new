import { Booking } from "./booking";
import { TranslatedText } from "./shared";
import { Service } from "./service";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface ServiceRequest {
    id: number;
    booking: Booking;
    name?: TranslatedText;
    service?: Service;
    quantity?: number;
    pricing_notes?: TranslatedText | null;
    guest_request?: TranslatedText | null;
    price?: number | null;
    total?: number | null;
    status?: string;
    created_at: string;
    updated_at: string;
}

export class ServiceRequestClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'service-request';

    public async create(params: ServiceRequestCreateParams, options?: RequestOptions): Promise<Response<ServiceRequest>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: ServiceRequestUpdateParams, options?: RequestOptions): Promise<Response<ServiceRequest>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: ServiceRequestFetchParams, options?: RequestOptions): Promise<Response<ServiceRequest>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: ServiceRequestQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ServiceRequest>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async del(params: ServiceRequestDeleteParams, options?: RequestOptions): Promise<Response<ServiceRequest>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async close(params: ServiceRequestCloseParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/close`,{params,options});
    }

    public async open(params: ServiceRequestOpenParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/open`,{params,options});
    }

    public async confirm(params: ServiceRequestConfirmParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/confirm`,{params,options});
    }
}

export interface ServiceRequestCreateParams {
    booking: number;
    name?: TranslatedText;
    service?: number | null;
    quantity: number;
    pricing_notes?: TranslatedText | null;
    guest_request?: TranslatedText | null;
    price?: number | null;
}

export interface ServiceRequestUpdateParams {
    id: number;
    booking?: number;
    name?: TranslatedText;
    service?: number | null;
    quantity: number;
    pricing_notes?: TranslatedText | null;
    guest_request?: TranslatedText | null;
    price?: number | null;
}

export interface ServiceRequestFetchParams {
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

export interface ServiceRequestQueryParams {
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

export interface ServiceRequestDeleteParams {
    id: number;
}

export interface ServiceRequestCloseParams {
    id: number;
}

export interface ServiceRequestOpenParams {
    id: number;
}

export interface ServiceRequestConfirmParams {
    service_request: number;
}
