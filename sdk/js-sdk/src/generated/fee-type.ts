import { TranslatedText } from "./shared";
import { TaxClass } from "./tax-class";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface FeeType {
    id: number;
    name: TranslatedText;
    category: "Cleaning fee" | "Pet fee" | "Linen fee" | "Flat fee" | "Percentage fee";
    value_type: "flat" | "percent";
    providers?: Array<"direct" | "makemytrip" | "cloud-website" | "airbnb" | "homeaway" | "api-partner" | "booking-com" | "rentals-united" | "google-vr" | "holidu" | "managed-sensei" | "dtravel">;
    tax_class?: TaxClass;
    include_in_rent_subtotal: boolean;
    read_only: boolean;
    apply_to_homeowner_bookings: boolean;
    created_at: string;
    updated_at: string;
}

export class FeeTypeClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'fee-type';

    public async create(params: FeeTypeCreateParams, options?: RequestOptions): Promise<Response<FeeType>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: FeeTypeUpdateParams, options?: RequestOptions): Promise<Response<FeeType>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async query(params?: FeeTypeQueryParams, options?: RequestOptions): Promise<PaginatedResponse<FeeType>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: FeeTypeFetchParams, options?: RequestOptions): Promise<Response<FeeType>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: FeeTypeDeleteParams, options?: RequestOptions): Promise<Response<FeeType>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: FeeTypeHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface FeeTypeCreateParams {
    name?: TranslatedText;
    providers?: Array<"direct" | "makemytrip" | "cloud-website" | "airbnb" | "homeaway" | "api-partner" | "booking-com" | "rentals-united" | "google-vr" | "holidu" | "managed-sensei" | "dtravel">;
    tax_class?: number | null;
    include_in_rent_subtotal?: boolean;
    apply_to_homeowner_bookings?: boolean;
    category: "Flat fee" | "Percentage fee";
}

export interface FeeTypeUpdateParams {
    id: number;
    name?: TranslatedText;
    providers?: Array<"direct" | "makemytrip" | "cloud-website" | "airbnb" | "homeaway" | "api-partner" | "booking-com" | "rentals-united" | "google-vr" | "holidu" | "managed-sensei" | "dtravel">;
    tax_class?: number | null;
    include_in_rent_subtotal?: boolean;
    apply_to_homeowner_bookings?: boolean;
}

export interface FeeTypeQueryParams {
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

export interface FeeTypeFetchParams {
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

export interface FeeTypeDeleteParams {
    id: number;
}

export interface FeeTypeHistoryParams {
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
