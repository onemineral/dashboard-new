import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Superhog {
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
    providers: Array<"direct" | "makemytrip" | "cloud-website" | "airbnb" | "homeaway" | "api-partner" | "booking-com" | "rentals-united" | "google-vr" | "holidu" | "managed-sensei" | "dtravel">;
    created_at: string;
    updated_at: string;
}

export class SuperhogClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'superhog';

    public async getAllListings(params: SuperhogGetAllListingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-all-listings`,{params,options});
    }

    public async fetch(params: SuperhogFetchParams, options?: RequestOptions): Promise<Response<Superhog>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: SuperhogCreateParams, options?: RequestOptions): Promise<Response<Superhog>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: SuperhogUpdateParams, options?: RequestOptions): Promise<Response<Superhog>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface SuperhogGetAllListingsParams {
    channel: number;
}

export interface SuperhogFetchParams {
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

export interface SuperhogCreateParams {
    name: string;
    email: string;
    password: string;
    providers?: Array<"direct" | "makemytrip" | "cloud-website" | "airbnb" | "homeaway" | "api-partner" | "booking-com" | "rentals-united" | "google-vr" | "holidu" | "managed-sensei" | "dtravel">;
    synchronization_type: "verification_and_protection" | "verification_only";
}

export interface SuperhogUpdateParams {
    id: number;
    name: string;
    email?: string | null;
    password?: string | null;
    providers?: Array<"direct" | "makemytrip" | "cloud-website" | "airbnb" | "homeaway" | "api-partner" | "booking-com" | "rentals-united" | "google-vr" | "holidu" | "managed-sensei" | "dtravel">;
    synchronization_type: "verification_and_protection" | "verification_only";
}
