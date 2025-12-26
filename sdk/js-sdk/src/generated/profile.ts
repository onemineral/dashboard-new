import { ProfileSettings } from "./profile-settings";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Profile {
    id: number;
    name: string;
    email: string;
    role: string;
    subscribe_financials?: boolean;
    subscribe_reservations?: boolean;
    subscribe_distribution?: boolean;
    subscribe_messages?: boolean;
    settings: ProfileSettings;
    created_at: string;
    updated_at: string;
}

export class ProfileClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'profile';

    public async fetch(params?: ProfileFetchParams, options?: RequestOptions): Promise<Response<Profile>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params?: ProfileUpdateParams, options?: RequestOptions): Promise<Response<Profile>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async changePassword(params: ProfileChangePasswordParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/change-password`,{params,options});
    }
}

export interface ProfileFetchParams {
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

export interface ProfileUpdateParams {
    name?: string;
    email?: string;
    subscribe_financials?: boolean;
    subscribe_reservations?: boolean;
    subscribe_distribution?: boolean;
    subscribe_messages?: boolean;
}

export interface ProfileChangePasswordParams {
    password: string;
    password_confirmation: string;
}
