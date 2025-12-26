import { DocumentTemplate } from "./document-template";
import { Booking } from "./booking";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Document {
    id: number;
    document_template: DocumentTemplate;
    resource: {
            type: 'booking',
            record: Booking
        };
    document_number: number;
    args_input: any;
    document_body: string;
    public_url: string;
    pdf_url: string;
    created_at: string;
    updated_at: string;
}

export class DocumentClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'document';

    public async query(params?: DocumentQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Document>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async create(params: DocumentCreateParams, options?: RequestOptions): Promise<Response<Document>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async del(params: DocumentDeleteParams, options?: RequestOptions): Promise<Response<Document>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async fetch(params: DocumentFetchParams, options?: RequestOptions): Promise<Response<Document>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface DocumentQueryParams {
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

export interface DocumentCreateParams {
    resource: {
            type: 'booking',
            record: Booking
        };
    document_template: number;
    inputs?: any;
    recreate_existing?: boolean;
}

export interface DocumentDeleteParams {
    id: number;
}

export interface DocumentFetchParams {
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
