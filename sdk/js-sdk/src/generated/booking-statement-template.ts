import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";
import { DateRange } from "./shared";

export interface BookingStatementTemplate {
    id: number;
    body: string;
    resource_type: "property" | "account";
    booking_date_field: "checkin" | "checkout";
    generate_on_day: number;
    last_generated_at?: string;
    next_generate_at?: string;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export class BookingStatementTemplateClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking-statement-template';

    public async fetch(options?: RequestOptions): Promise<Response<BookingStatementTemplate>> {
        return this.apiClient.request(`${this.path}/fetch`,{options});
    }

    public async update(params: BookingStatementTemplateUpdateParams, options?: RequestOptions): Promise<Response<BookingStatementTemplate>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async preview(params: BookingStatementTemplatePreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/preview`,{params,options});
    }
}

export interface BookingStatementTemplateUpdateParams {
    id: number;
    body: string;
    resource_type?: "property" | "account";
    booking_date_field?: "checkin" | "checkout";
    generate_on_day?: number;
    enabled?: boolean;
}

export interface BookingStatementTemplatePreviewParams {
    daterange: DateRange;
    body?: string;
    property?: number;
    account?: number;
}
