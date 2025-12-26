import { Channel } from "./channel";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Webhook {
    id: number;
    provider_code: string;
    name: string;
    channel?: Channel;
    events: Array<"property-updated" | "property-created" | "booking-created" | "booking-stay-updated" | "booking-status-changed" | "account-updated" | "online-checkin-completed" | "payment-created" | "payment-refunded" | "message-sent" | "message-received">;
    url: string;
    auth_method: "basic_auth" | "api_token" | "none";
}

export class WebhookClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'webhook';

    public async create(params: WebhookCreateParams, options?: RequestOptions): Promise<Response<Webhook>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: WebhookUpdateParams, options?: RequestOptions): Promise<Response<Webhook>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async query(params?: WebhookQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Webhook>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: WebhookFetchParams, options?: RequestOptions): Promise<Response<Webhook>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: WebhookDeleteParams, options?: RequestOptions): Promise<Response<Webhook>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async upsert(params: WebhookUpsertParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upsert`,{params,options});
    }
}

export interface WebhookCreateParams {
    provider_code?: string;
    name: string;
    channel?: number;
    events: Array<"property-updated" | "property-created" | "booking-created" | "booking-stay-updated" | "booking-status-changed" | "account-updated" | "online-checkin-completed" | "payment-created" | "payment-refunded" | "message-sent" | "message-received">;
    url: string;
    auth_method: "basic_auth" | "api_token" | "none";
    auth_data?: any;
}

export interface WebhookUpdateParams {
    id: number;
    provider_code?: string;
    name: string;
    channel?: number;
    events: Array<"property-updated" | "property-created" | "booking-created" | "booking-stay-updated" | "booking-status-changed" | "account-updated" | "online-checkin-completed" | "payment-created" | "payment-refunded" | "message-sent" | "message-received">;
    url: string;
    auth_method?: "basic_auth" | "api_token" | "none";
    auth_data?: any;
}

export interface WebhookQueryParams {
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

export interface WebhookFetchParams {
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

export interface WebhookDeleteParams {
    id: number;
}

export interface WebhookUpsertParams {
    provider_code: string;
    name: string;
    channel?: number;
    events: Array<"property-updated" | "property-created" | "booking-created" | "booking-stay-updated" | "booking-status-changed" | "account-updated" | "online-checkin-completed" | "payment-created" | "payment-refunded" | "message-sent" | "message-received">;
    url: string;
    auth_method: "basic_auth" | "api_token" | "none";
    auth_data?: any;
}
