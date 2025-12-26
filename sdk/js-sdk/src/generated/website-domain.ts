import { Channel } from "./channel";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface WebsiteDomain {
    id: number;
    channel: Channel;
    domain: string;
    is_verified: boolean;
    is_readonly: boolean;
    is_default: boolean;
    is_search_engine_indexable: boolean;
    verification_errors: any;
    created_at: string;
    updated_at: string;
}

export class WebsiteDomainClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'website-domain';

    public async create(params: WebsiteDomainCreateParams, options?: RequestOptions): Promise<Response<WebsiteDomain>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: WebsiteDomainUpdateParams, options?: RequestOptions): Promise<Response<WebsiteDomain>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: WebsiteDomainFetchParams, options?: RequestOptions): Promise<Response<WebsiteDomain>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params: WebsiteDomainQueryParams, options?: RequestOptions): Promise<PaginatedResponse<WebsiteDomain>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async del(params: WebsiteDomainDeleteParams, options?: RequestOptions): Promise<Response<WebsiteDomain>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async getVerificationBody(params: WebsiteDomainGetVerificationBodyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-verification-body`,{params,options});
    }

    public async changeSubdomain(params: WebsiteDomainChangeSubdomainParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/change-subdomain`,{params,options});
    }
}

export interface WebsiteDomainCreateParams {
    channel: number;
    domain: string;
}

export interface WebsiteDomainUpdateParams {
    id: number;
    channel?: number;
    domain?: string;
    is_search_engine_indexable?: boolean;
}

export interface WebsiteDomainFetchParams {
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

export interface WebsiteDomainQueryParams {
    channel: number;
}

export interface WebsiteDomainDeleteParams {
    id: number;
}

export interface WebsiteDomainGetVerificationBodyParams {
    external_id: string;
}

export interface WebsiteDomainChangeSubdomainParams {
    id: number;
    subdomain: string;
}
