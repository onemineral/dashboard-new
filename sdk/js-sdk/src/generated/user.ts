import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface User {
    id: number;
    name: string;
    email?: string;
    role?: "admin";
    subscribe_financials?: boolean;
    subscribe_reservations?: boolean;
    subscribe_distribution?: boolean;
    subscribe_messages?: boolean;
    created_at: string;
    updated_at: string;
}

export class UserClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'user';

    public async query(params?: UserQueryParams, options?: RequestOptions): Promise<PaginatedResponse<User>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: UserFetchParams, options?: RequestOptions): Promise<Response<User>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: UserCreateParams, options?: RequestOptions): Promise<Response<User>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: UserUpdateParams, options?: RequestOptions): Promise<Response<User>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: UserDeleteParams, options?: RequestOptions): Promise<Response<User>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async changePassword(params: UserChangePasswordParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/change-password`,{params,options});
    }

    public async history(params?: UserHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface UserQueryParams {
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

export interface UserFetchParams {
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

export interface UserCreateParams {
    name: string;
    email: string;
    role: "admin";
    subscribe_financials?: boolean;
    subscribe_reservations?: boolean;
    subscribe_distribution?: boolean;
    subscribe_messages?: boolean;
}

export interface UserUpdateParams {
    id: number;
    name?: string;
    email?: string;
    role?: "admin";
    subscribe_financials?: boolean;
    subscribe_reservations?: boolean;
    subscribe_distribution?: boolean;
    subscribe_messages?: boolean;
}

export interface UserDeleteParams {
    id: number;
}

export interface UserChangePasswordParams {
    id: number;
    password: string;
    password_confirmation: string;
}

export interface UserHistoryParams {
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
