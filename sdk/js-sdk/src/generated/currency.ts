import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Currency {
    id: number;
    iso_code: string;
    symbol: string;
    html_code: string;
    html_entity: string;
    name: TranslatedText;
    created_at: string;
    updated_at: string;
}

export class CurrencyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'currency';

    public async query(params?: CurrencyQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Currency>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: CurrencyFetchParams, options?: RequestOptions): Promise<Response<Currency>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async conversionRates(params?: CurrencyConversionRatesParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/conversion-rates`,{params,options});
    }
}

export interface CurrencyQueryParams {
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

export interface CurrencyFetchParams {
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

export interface CurrencyConversionRatesParams {
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
