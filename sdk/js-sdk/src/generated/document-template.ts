import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";
import { Booking } from "./booking";
import { Payment } from "./payment";

export interface DocumentTemplate {
    id: number;
    name: string;
    resource_type: "booking";
    template_body: string;
    allow_multiple_documents: boolean;
    has_public_page: boolean;
    next_generated_number: string;
    public_url: string;
    pdf_url: string;
    created_at: string;
    updated_at: string;
}

export class DocumentTemplateClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'document-template';

    public async create(params: DocumentTemplateCreateParams, options?: RequestOptions): Promise<Response<DocumentTemplate>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: DocumentTemplateUpdateParams, options?: RequestOptions): Promise<Response<DocumentTemplate>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async query(params?: DocumentTemplateQueryParams, options?: RequestOptions): Promise<PaginatedResponse<DocumentTemplate>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: DocumentTemplateFetchParams, options?: RequestOptions): Promise<Response<DocumentTemplate>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async preview(params: DocumentTemplatePreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/preview`,{params,options});
    }
}

export interface DocumentTemplateCreateParams {
    name: string;
    resource_type: "booking";
    template_body: string;
    allow_multiple_documents?: boolean;
    has_public_page?: boolean;
}

export interface DocumentTemplateUpdateParams {
    id: number;
    name: string;
    resource_type?: "booking";
    template_body: string;
    allow_multiple_documents?: boolean;
    has_public_page?: boolean;
}

export interface DocumentTemplateQueryParams {
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
    resource?: {
            type: 'booking' | 'payment',
            record: Booking | Payment
        };
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

export interface DocumentTemplateFetchParams {
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

export interface DocumentTemplatePreviewParams {
    resource: {
            type: 'booking',
            record: Booking
        };
    template_body: string;
}
