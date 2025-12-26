import { Country } from "./country";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface GuestAccount {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    type: "partner" | "guest";
    email?: string | null;
    secondary_email?: string | null;
    phone?: string | null;
    secondary_phone?: string | null;
    sanitized_phone?: string | null;
    sanitized_secondary_phone?: string;
    company?: string | null;
    vat_id?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: Country;
    citizenship_country?: Country;
    gender?: "female" | "male";
    birthdate?: string | null;
    birth_year?: number | null;
    notes?: string | null;
    external_id?: string | null;
    source?: string | null;
    id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit";
    id_number?: string | null;
    id_issue_date?: string | null;
    preferred_language?: "bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fi" | "fr" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "lt" | "lv" | "nb" | "nl" | "nn" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "sv" | "th" | "tr" | "uk";
    created_at: string;
    updated_at: string;
}

export class GuestAccountClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'guest-account';

    public async del(params: GuestAccountDeleteParams, options?: RequestOptions): Promise<Response<GuestAccount>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async query(params?: GuestAccountQueryParams, options?: RequestOptions): Promise<PaginatedResponse<GuestAccount>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: GuestAccountFetchParams, options?: RequestOptions): Promise<Response<GuestAccount>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async history(params?: GuestAccountHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async autocomplete(params?: GuestAccountAutocompleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/autocomplete`,{params,options});
    }

    public async update(params: GuestAccountUpdateParams, options?: RequestOptions): Promise<Response<GuestAccount>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async getRolesAndScopes(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-roles-and-scopes`,{options});
    }

    public async create(params?: GuestAccountCreateParams, options?: RequestOptions): Promise<Response<GuestAccount>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }
}

export interface GuestAccountDeleteParams {
    id: number;
}

export interface GuestAccountQueryParams {
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

export interface GuestAccountFetchParams {
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

export interface GuestAccountHistoryParams {
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

export interface GuestAccountAutocompleteParams {
    q?: string | null;
    limit?: number | null;
    type?: "partner" | "guest";
}

export interface GuestAccountUpdateParams {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    secondary_email?: string | null;
    phone?: string | null;
    secondary_phone?: string | null;
    company?: string | null;
    vat_id?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: number | null;
    citizenship_country?: number | null;
    gender?: "female" | "male";
    birthdate?: string | null;
    birth_year?: number | null;
    notes?: string | null;
    external_id?: string | null;
    source?: string | null;
    id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit";
    id_number?: string | null;
    id_issue_date?: string | null;
    preferred_language?: "bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fi" | "fr" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "lt" | "lv" | "nb" | "nl" | "nn" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "sv" | "th" | "tr" | "uk";
}

export interface GuestAccountCreateParams {
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    email?: string | null;
    secondary_email?: string | null;
    phone?: string | null;
    secondary_phone?: string | null;
    company?: string | null;
    vat_id?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: number | null;
    citizenship_country?: number | null;
    gender?: "female" | "male";
    birthdate?: string | null;
    birth_year?: number | null;
    notes?: string | null;
    external_id?: string | null;
    source?: string | null;
    id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit";
    id_number?: string | null;
    id_issue_date?: string | null;
    preferred_language?: "bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fi" | "fr" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "lt" | "lv" | "nb" | "nl" | "nn" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "sv" | "th" | "tr" | "uk";
}
