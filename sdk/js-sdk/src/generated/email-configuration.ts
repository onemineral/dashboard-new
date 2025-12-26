import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface EmailConfiguration {
    id: number;
    from_name: string;
    from_email: string;
    is_default: boolean;
    is_confirmed: boolean;
    domain: string;
    dkim_host?: string;
    dkim_value?: string;
    dkim_verified?: boolean;
    spf_host?: string;
    spf_value?: string;
    spf_verified?: boolean;
    return_path_domain?: string;
    return_path_value?: string;
    return_path_verified?: boolean;
    created_at: string;
    updated_at: string;
}

export class EmailConfigurationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'email-configuration';

    public async query(params?: EmailConfigurationQueryParams, options?: RequestOptions): Promise<PaginatedResponse<EmailConfiguration>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: EmailConfigurationFetchParams, options?: RequestOptions): Promise<Response<EmailConfiguration>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: EmailConfigurationCreateParams, options?: RequestOptions): Promise<Response<EmailConfiguration>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: EmailConfigurationUpdateParams, options?: RequestOptions): Promise<Response<EmailConfiguration>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: EmailConfigurationDeleteParams, options?: RequestOptions): Promise<Response<EmailConfiguration>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async verify(params: EmailConfigurationVerifyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/verify`,{params,options});
    }

    public async resendConfirmation(params: EmailConfigurationResendConfirmationParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/resend-confirmation`,{params,options});
    }

    public async updateDefault(params: EmailConfigurationUpdateDefaultParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-default`,{params,options});
    }
}

export interface EmailConfigurationQueryParams {
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

export interface EmailConfigurationFetchParams {
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

export interface EmailConfigurationCreateParams {
    from_name: string;
    from_email: string;
}

export interface EmailConfigurationUpdateParams {
    id: number;
    from_name: string;
    from_email?: string;
}

export interface EmailConfigurationDeleteParams {
    id: number;
}

export interface EmailConfigurationVerifyParams {
    id: number;
}

export interface EmailConfigurationResendConfirmationParams {
    id: number;
}

export interface EmailConfigurationUpdateDefaultParams {
    id: number;
}
