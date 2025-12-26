import { Property } from "./property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface PropertyIcal {
    id: number;
    property: Property;
    url?: string;
    name?: string;
    frequency?: "10" | "30" | "60" | "360" | "720" | "1440";
    last_status_code?: string;
    error_message?: string;
    last_processed_at?: string;
    status?: "disabled" | "enabled";
    created_at: string;
    updated_at: string;
}

export class PropertyIcalClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'property-ical';

    public async create(params: PropertyIcalCreateParams, options?: RequestOptions): Promise<Response<PropertyIcal>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PropertyIcalUpdateParams, options?: RequestOptions): Promise<Response<PropertyIcal>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: PropertyIcalFetchParams, options?: RequestOptions): Promise<Response<PropertyIcal>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async history(params?: PropertyIcalHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async sync(params: PropertyIcalSyncParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync`,{params,options});
    }

    public async del(params: PropertyIcalDeleteParams, options?: RequestOptions): Promise<Response<PropertyIcal>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface PropertyIcalCreateParams {
    property: number;
    url: string;
    name: string;
    frequency?: "10" | "30" | "60" | "360" | "720" | "1440";
    status?: "disabled" | "enabled";
}

export interface PropertyIcalUpdateParams {
    id: number;
    property: number;
    url: string;
    name: string;
    frequency?: "10" | "30" | "60" | "360" | "720" | "1440";
    status?: "disabled" | "enabled";
}

export interface PropertyIcalFetchParams {
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

export interface PropertyIcalHistoryParams {
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

export interface PropertyIcalSyncParams {
    id: number;
}

export interface PropertyIcalDeleteParams {
    id: number;
}
