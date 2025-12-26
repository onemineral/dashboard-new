import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface RentalsUnited {
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

export class RentalsUnitedClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'rentals-united';

    public async create(params: RentalsUnitedCreateParams, options?: RequestOptions): Promise<Response<RentalsUnited>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: RentalsUnitedFetchParams, options?: RequestOptions): Promise<Response<RentalsUnited>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async updatePassword(params: RentalsUnitedUpdatePasswordParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-password`,{params,options});
    }
}

export interface RentalsUnitedCreateParams {
    name: string;
    email: string;
    password: string;
}

export interface RentalsUnitedFetchParams {
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

export interface RentalsUnitedUpdatePasswordParams {
    channel: number;
    password: string;
}
