import { PropertyLosSeason } from "./property-los-season";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface PropertyLosSeasonDiscount {
    id: number;
    property_los_season: PropertyLosSeason;
    min_stay: number;
    percent: number;
    created_at: string;
    updated_at: string;
}

export class PropertyLosSeasonDiscountClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'property-los-season-discount';

    public async create(params: PropertyLosSeasonDiscountCreateParams, options?: RequestOptions): Promise<Response<PropertyLosSeasonDiscount>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PropertyLosSeasonDiscountUpdateParams, options?: RequestOptions): Promise<Response<PropertyLosSeasonDiscount>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: PropertyLosSeasonDiscountFetchParams, options?: RequestOptions): Promise<Response<PropertyLosSeasonDiscount>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: PropertyLosSeasonDiscountDeleteParams, options?: RequestOptions): Promise<Response<PropertyLosSeasonDiscount>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface PropertyLosSeasonDiscountCreateParams {
    property_los_season: number;
    min_stay: number;
    percent: number;
}

export interface PropertyLosSeasonDiscountUpdateParams {
    id: number;
    property_los_season?: number;
    min_stay?: number;
    percent?: number;
}

export interface PropertyLosSeasonDiscountFetchParams {
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

export interface PropertyLosSeasonDiscountDeleteParams {
    id: number;
}
