import { Lead } from './lead';
import { Property } from './property';
import { DateRange } from './shared';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface LeadQuote {
    id: number;
    lead: Lead;
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
        total_accommodation: number;
        total_discount: number;
        total_fees: number;
        total: number;
        total_before_discount: number;
        currency_iso: string;
    };
    created_at: string;
    updated_at: string;
}

export class LeadQuoteClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'lead-quote';

    public async create(params: LeadQuoteCreateParams, options?: RequestOptions): Promise<Response<LeadQuote>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async fetch(params: LeadQuoteFetchParams, options?: RequestOptions): Promise<Response<LeadQuote>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async del(params: LeadQuoteDeleteParams, options?: RequestOptions): Promise<Response<LeadQuote>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async empty(params: LeadQuoteEmptyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/empty`, {
            params,
            options,
        });
    }
}

export interface LeadQuoteCreateParams {
    lead: number;
    property: number;
    daterange: DateRange;
    total_accommodation: number;
    total_discount?: number;
    total_fees?: number;
    converted?: {
        total_accommodation: number;
        total_discount: number;
        total_fees: number;
        total: number;
        total_before_discount: number;
        currency_iso: string;
    };
}

export interface LeadQuoteFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
    with?: string[];
    with_aggregations?: Array<{
        type?: 'count' | 'avg' | 'sum' | 'min' | 'max';
        as?: string;
        relation?: string;
        field?: string;
        where?: {
            conditions?: any;
            conditions_logic?: string | null;
        };
    }>;
}

export interface LeadQuoteDeleteParams {
    id: number;
}

export interface LeadQuoteEmptyParams {
    id: number;
}
