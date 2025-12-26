import { Property } from "./property";
import { Location } from "./location";
import { Collection } from "./collection";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Tag {
    id: number;
    name: string;
    properties?: Property[];
    locations?: Location[];
    collections?: Collection[];
    created_at: string;
    updated_at: string;
}

export class TagClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'tag';

    public async create(params: TagCreateParams, options?: RequestOptions): Promise<Response<Tag>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: TagUpdateParams, options?: RequestOptions): Promise<Response<Tag>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: TagFetchParams, options?: RequestOptions): Promise<Response<Tag>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: TagQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Tag>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async history(params?: TagHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async del(params: TagDeleteParams, options?: RequestOptions): Promise<Response<Tag>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface TagCreateParams {
    name: string;
}

export interface TagUpdateParams {
    id: number;
    name: string;
}

export interface TagFetchParams {
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

export interface TagQueryParams {
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

export interface TagHistoryParams {
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

export interface TagDeleteParams {
    id: number;
}
