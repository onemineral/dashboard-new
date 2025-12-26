import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Language {
    id: number;
    original_name: string;
    international_name: string;
    locale: string;
    iso_locale: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export class LanguageClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'language';

    public async query(params?: LanguageQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Language>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: LanguageFetchParams, options?: RequestOptions): Promise<Response<Language>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: LanguageCreateParams, options?: RequestOptions): Promise<Response<Language>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: LanguageUpdateParams, options?: RequestOptions): Promise<Response<Language>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async activate(params: LanguageActivateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/activate`,{params,options});
    }

    public async history(params?: LanguageHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface LanguageQueryParams {
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

export interface LanguageFetchParams {
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

export interface LanguageCreateParams {
    locale: "bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fi" | "fr" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "lt" | "lv" | "nb" | "nl" | "nn" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "sv" | "th" | "tr" | "uk";
}

export interface LanguageUpdateParams {
    id: number;
    international_name: string;
    original_name: string;
}

export interface LanguageActivateParams {
    locales?: Array<"bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fi" | "fr" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "lt" | "lv" | "nb" | "nl" | "nn" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "sv" | "th" | "tr" | "uk">;
    default_locale: "bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fi" | "fr" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "lt" | "lv" | "nb" | "nl" | "nn" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "sv" | "th" | "tr" | "uk";
}

export interface LanguageHistoryParams {
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
