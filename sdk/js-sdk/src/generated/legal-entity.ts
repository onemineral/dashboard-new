import { Country } from "./country";
import { PaymentMethod } from "./payment-method";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface LegalEntity {
    id: number;
    legal_name: string;
    business_name?: string | null;
    first_name: string;
    last_name: string;
    address: string;
    tax_id?: string | null;
    phone: string;
    email: string;
    city: string;
    postcode: string;
    country: Country;
    payment_methods?: PaymentMethod[];
}

export class LegalEntityClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'legal-entity';

    public async create(params: LegalEntityCreateParams, options?: RequestOptions): Promise<Response<LegalEntity>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: LegalEntityUpdateParams, options?: RequestOptions): Promise<Response<LegalEntity>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: LegalEntityDeleteParams, options?: RequestOptions): Promise<Response<LegalEntity>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async fetch(params: LegalEntityFetchParams, options?: RequestOptions): Promise<Response<LegalEntity>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: LegalEntityQueryParams, options?: RequestOptions): Promise<PaginatedResponse<LegalEntity>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }
}

export interface LegalEntityCreateParams {
    legal_name: string;
    business_name?: string | null;
    first_name: string;
    last_name: string;
    address: string;
    tax_id?: string | null;
    phone?: string;
    email?: string;
    city: string;
    postcode: string;
    country: number;
}

export interface LegalEntityUpdateParams {
    id: number;
    legal_name: string;
    business_name?: string | null;
    first_name: string;
    last_name: string;
    address: string;
    tax_id?: string | null;
    phone: string;
    email: string;
    city: string;
    postcode: string;
    country?: number;
}

export interface LegalEntityDeleteParams {
    id: number;
}

export interface LegalEntityFetchParams {
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

export interface LegalEntityQueryParams {
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
