import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface PersonalAccessToken {
    id: number;
    name: string;
    last_used_at: string;
    token?: string;
    created_at: string;
    updated_at: string;
}

export class PersonalAccessTokenClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'personal-access-token';

    public async create(params: PersonalAccessTokenCreateParams, options?: RequestOptions): Promise<Response<PersonalAccessToken>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async del(params: PersonalAccessTokenDeleteParams, options?: RequestOptions): Promise<Response<PersonalAccessToken>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async query(params?: PersonalAccessTokenQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PersonalAccessToken>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: PersonalAccessTokenFetchParams, options?: RequestOptions): Promise<Response<PersonalAccessToken>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface PersonalAccessTokenCreateParams {
    name: string;
    identity?: number;
}

export interface PersonalAccessTokenDeleteParams {
    id: number;
}

export interface PersonalAccessTokenQueryParams {
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

export interface PersonalAccessTokenFetchParams {
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
