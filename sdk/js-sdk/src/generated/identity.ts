import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Identity {
    id: number;
    scope: "admin" | "partners-portal";
    role: "admin" | "cloud-website" | "managed-rates" | "managed-operations" | "managed-website-builder" | "managed-accounting";
    provider: string;
    external_id?: string;
    created_at: string;
    updated_at: string;
}

export class IdentityClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'identity';

    public async del(params: IdentityDeleteParams, options?: RequestOptions): Promise<Response<Identity>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async fetch(params: IdentityFetchParams, options?: RequestOptions): Promise<Response<Identity>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async impersonate(params?: IdentityImpersonateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/impersonate`,{params,options});
    }

    public async attemptEmailLogin(params: IdentityAttemptEmailLoginParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attempt-email-login`,{params,options});
    }
}

export interface IdentityDeleteParams {
    id: number;
}

export interface IdentityFetchParams {
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

export interface IdentityImpersonateParams {
    user?: number;
    tenant?: string;
}

export interface IdentityAttemptEmailLoginParams {
    email: string;
}
