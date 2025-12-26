import { TranslatedText } from "./shared";
import { ServiceType } from "./service-type";
import { TaxClass } from "./tax-class";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Service {
    id: number;
    name?: TranslatedText;
    service_type?: ServiceType;
    description?: TranslatedText | null;
    is_featured?: boolean | null;
    price?: number | null;
    pricing_notes?: TranslatedText | null;
    tax_class?: TaxClass;
    created_at: string;
    updated_at: string;
}

export class ServiceClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'service';

    public async create(params: ServiceCreateParams, options?: RequestOptions): Promise<Response<Service>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: ServiceUpdateParams, options?: RequestOptions): Promise<Response<Service>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: ServiceFetchParams, options?: RequestOptions): Promise<Response<Service>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: ServiceQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Service>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async del(params: ServiceDeleteParams, options?: RequestOptions): Promise<Response<Service>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface ServiceCreateParams {
    name?: TranslatedText;
    service_type: number;
    description?: TranslatedText | null;
    is_featured?: boolean | null;
    price?: number | null;
    pricing_notes?: TranslatedText | null;
    tax_class?: number;
}

export interface ServiceUpdateParams {
    id: number;
    name?: TranslatedText;
    service_type?: number;
    description?: TranslatedText | null;
    is_featured?: boolean | null;
    price?: number | null;
    pricing_notes?: TranslatedText | null;
    tax_class?: number;
}

export interface ServiceFetchParams {
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

export interface ServiceQueryParams {
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

export interface ServiceDeleteParams {
    id: number;
}
