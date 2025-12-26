import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";
import { DateRange } from "./shared";

export interface Airbnb {
    id: number;
    name: string;
    external_id: string;
    status: "enabled" | "pending" | "disabled";
    options: any;
    provider: string;
    logo_url: string;
    icon_url: string;
    account?: Account;
    markup: number;
    connection: ChannelProperty;
    created_at: string;
    updated_at: string;
}

export class AirbnbClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'airbnb';

    public async redirect(params?: AirbnbRedirectParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/redirect`,{params,options});
    }

    public async callback(params: AirbnbCallbackParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/callback`,{params,options});
    }

    public async getAllListings(params: AirbnbGetAllListingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-all-listings`,{params,options});
    }

    public async fetch(params: AirbnbFetchParams, options?: RequestOptions): Promise<Response<Airbnb>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async import(params: AirbnbImportParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import`,{params,options});
    }

    public async importMultiple(params: AirbnbImportMultipleParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import-multiple`,{params,options});
    }

    public async queryConnectSuggestions(params: AirbnbQueryConnectSuggestionsParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/query-connect-suggestions`,{params,options});
    }
}

export interface AirbnbRedirectParams {
    redirect_to?: string;
}

export interface AirbnbCallbackParams {
    code: string;
}

export interface AirbnbGetAllListingsParams {
    channel: number;
    cursor?: string | null;
    include_cohosted_listings?: boolean;
    detect_fee_structure?: boolean;
}

export interface AirbnbFetchParams {
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

export interface AirbnbImportParams {
    channel: number;
    listing_id: string;
}

export interface AirbnbImportMultipleParams {
    channel: number;
    listing_ids: string[];
    markup?: number | null;
}

export interface AirbnbQueryConnectSuggestionsParams {
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
    with_rates_and_bookings?: {
            daterange?: DateRange,
            length_of_stay?: number | null
        };
    channel?: number;
    channel_filter?: "all" | "connected" | "not_connected";
    id: number;
    ignore_connected_properties?: boolean;
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
    availability?: {
            daterange?: DateRange | null,
            months?: Array<"2025-12" | "2026-01" | "2026-02" | "2026-03" | "2026-04" | "2026-05" | "2026-06" | "2026-07" | "2026-08" | "2026-09" | "2026-10" | "2026-11" | "2026-12" | "2027-01" | "2027-02" | "2027-03" | "2027-04" | "2027-05">,
            over_weekend?: boolean,
            min_stay?: number | null,
            max_stay?: number | null,
            guests?: number,
            pets?: boolean,
            channel?: number,
            ignore: Array<"min_stay" | "max_stay" | "check_in_out" | "min_prior_notify" | "booking_window" | "all">,
            currency?: {
                id?: number,
                iso_code?: string
            },
            sort_direction?: "asc" | "desc",
            sort_by?: "total" | "total_discount" | "total_discount_percent",
            budget?: {
                min?: number | null,
                max?: number | null
            }
        };
}
