import { TranslatedText } from "./shared";
import { User } from "./user";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface RentalAgreement {
    id: number;
    title: string;
    contents: TranslatedText;
    created_by: User;
    last_updated_by: User;
    created_at: string;
    updated_at: string;
}

export class RentalAgreementClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'rental-agreement';

    public async create(params: RentalAgreementCreateParams, options?: RequestOptions): Promise<Response<RentalAgreement>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: RentalAgreementFetchParams, options?: RequestOptions): Promise<Response<RentalAgreement>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: RentalAgreementUpdateParams, options?: RequestOptions): Promise<Response<RentalAgreement>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async query(params?: RentalAgreementQueryParams, options?: RequestOptions): Promise<PaginatedResponse<RentalAgreement>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async generate(params: RentalAgreementGenerateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/generate`,{params,options});
    }
}

export interface RentalAgreementCreateParams {
    title: string;
    contents: TranslatedText;
}

export interface RentalAgreementFetchParams {
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

export interface RentalAgreementUpdateParams {
    id: number;
    title?: string;
    contents?: TranslatedText;
}

export interface RentalAgreementQueryParams {
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

export interface RentalAgreementGenerateParams {
    agreement_tye: string;
    cancellation_policy: string;
    house_rules: string;
    additional_instructions: string;
}
