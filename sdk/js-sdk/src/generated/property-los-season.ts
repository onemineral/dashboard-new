import { Property } from "./property";
import { DateRange } from "./shared";
import { PropertyLosSeasonDiscount } from "./property-los-season-discount";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface PropertyLosSeason {
    id: number;
    property: Property;
    daterange: DateRange;
    start_date: string;
    end_date: string;
    is_incremental: boolean;
    property_los_season_discounts: PropertyLosSeasonDiscount[];
    created_at: string;
    updated_at: string;
}

export class PropertyLosSeasonClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'property-los-season';

    public async create(params: PropertyLosSeasonCreateParams, options?: RequestOptions): Promise<Response<PropertyLosSeason>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PropertyLosSeasonUpdateParams, options?: RequestOptions): Promise<Response<PropertyLosSeason>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: PropertyLosSeasonFetchParams, options?: RequestOptions): Promise<Response<PropertyLosSeason>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: PropertyLosSeasonDeleteParams, options?: RequestOptions): Promise<Response<PropertyLosSeason>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface PropertyLosSeasonCreateParams {
    property: number;
    daterange: DateRange;
}

export interface PropertyLosSeasonUpdateParams {
    id: number;
    property?: number;
    daterange?: DateRange;
}

export interface PropertyLosSeasonFetchParams {
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

export interface PropertyLosSeasonDeleteParams {
    id: number;
}
