import { TranslatedText } from "./shared";
import { Amenity } from "./amenity";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface AmenityGroup {
    id: number;
    name: TranslatedText;
    original_name: string;
    amenities: Amenity[];
}

export class AmenityGroupClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'amenity-group';

    public async create(params?: AmenityGroupCreateParams, options?: RequestOptions): Promise<Response<AmenityGroup>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: AmenityGroupFetchParams, options?: RequestOptions): Promise<Response<AmenityGroup>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: AmenityGroupQueryParams, options?: RequestOptions): Promise<PaginatedResponse<AmenityGroup>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async update(params: AmenityGroupUpdateParams, options?: RequestOptions): Promise<Response<AmenityGroup>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: AmenityGroupDeleteParams, options?: RequestOptions): Promise<Response<AmenityGroup>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: AmenityGroupHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface AmenityGroupCreateParams {
    name?: TranslatedText;
}

export interface AmenityGroupFetchParams {
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

export interface AmenityGroupQueryParams {
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

export interface AmenityGroupUpdateParams {
    id: number;
    name?: TranslatedText;
}

export interface AmenityGroupDeleteParams {
    id: number;
}

export interface AmenityGroupHistoryParams {
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
