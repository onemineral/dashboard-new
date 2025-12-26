import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface GoogleVr {
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

export class GoogleVrClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'google-vr';

    public async activate(params: GoogleVrActivateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/activate`,{params,options});
    }

    public async fetch(params: GoogleVrFetchParams, options?: RequestOptions): Promise<Response<GoogleVr>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: GoogleVrCreateParams, options?: RequestOptions): Promise<Response<GoogleVr>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: GoogleVrUpdateParams, options?: RequestOptions): Promise<Response<GoogleVr>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface GoogleVrActivateParams {
    credentials: any;
}

export interface GoogleVrFetchParams {
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

export interface GoogleVrCreateParams {
    name: string;
    brand: string;
    domain: number;
}

export interface GoogleVrUpdateParams {
    id: number;
    name: string;
    brand: string;
    property_url: string;
    checkin_field: string;
    checkout_field: string;
    checkin_checkout_format: "Y-m-d" | "m-d-Y" | "d-m-Y";
    adults_field: string;
    children_field: string;
}
