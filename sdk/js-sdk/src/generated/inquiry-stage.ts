import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface InquiryStage {
    id: number;
    name?: string;
    stage_type?: "open" | "closed_lost" | "closed_won";
    is_default_open: boolean;
    is_default_closed_won: boolean;
    color: string;
    created_at: string;
    updated_at: string;
}

export class InquiryStageClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'inquiry-stage';

    public async create(params: InquiryStageCreateParams, options?: RequestOptions): Promise<Response<InquiryStage>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async query(params?: InquiryStageQueryParams, options?: RequestOptions): Promise<PaginatedResponse<InquiryStage>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async update(params: InquiryStageUpdateParams, options?: RequestOptions): Promise<Response<InquiryStage>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: InquiryStageFetchParams, options?: RequestOptions): Promise<Response<InquiryStage>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: InquiryStageDeleteParams, options?: RequestOptions): Promise<Response<InquiryStage>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async order(params: InquiryStageOrderParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order`,{params,options});
    }
}

export interface InquiryStageCreateParams {
    name: string;
    stage_type: "open" | "closed_lost" | "closed_won";
    is_default_open?: boolean;
    is_default_closed_won?: boolean;
    color: string;
}

export interface InquiryStageQueryParams {
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

export interface InquiryStageUpdateParams {
    id: number;
    name: string;
    stage_type: "open" | "closed_lost" | "closed_won";
    is_default_open?: boolean;
    is_default_closed_won?: boolean;
    color: string;
}

export interface InquiryStageFetchParams {
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

export interface InquiryStageDeleteParams {
    id: number;
}

export interface InquiryStageOrderParams {
    order: number[];
}
