import { Inquiry } from "./inquiry";
import { Property } from "./property";
import { DateRange } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface InquiryQuote {
    id: number;
    inquiry: Inquiry;
    property: Property;
    daterange: DateRange;
    total_accommodation: number;
    total_discount: number;
    total_fees: number;
    total: number;
    total_before_discount: number;
    currency_iso: string;
    total_discount_percent: number;
    converted: {
            total_accommodation: number,
            total_discount: number,
            total_fees: number,
            total: number,
            total_before_discount: number,
            currency_iso: string
        };
    created_at: string;
    updated_at: string;
}

export class InquiryQuoteClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'inquiry-quote';

    public async create(params: InquiryQuoteCreateParams, options?: RequestOptions): Promise<Response<InquiryQuote>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: InquiryQuoteFetchParams, options?: RequestOptions): Promise<Response<InquiryQuote>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: InquiryQuoteDeleteParams, options?: RequestOptions): Promise<Response<InquiryQuote>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async empty(params: InquiryQuoteEmptyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/empty`,{params,options});
    }
}

export interface InquiryQuoteCreateParams {
    inquiry: number;
    property: number;
    daterange: DateRange;
    total_accommodation: number;
    total_discount?: number;
    total_fees?: number;
    converted?: {
            total_accommodation: number,
            total_discount: number,
            total_fees: number,
            total: number,
            total_before_discount: number,
            currency_iso: string
        };
}

export interface InquiryQuoteFetchParams {
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

export interface InquiryQuoteDeleteParams {
    id: number;
}

export interface InquiryQuoteEmptyParams {
    id: number;
}
