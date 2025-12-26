import { InquiryStage } from "./inquiry-stage";
import { Country } from "./country";
import { Channel } from "./channel";
import { Property } from "./property";
import { Location } from "./location";
import { Booking } from "./booking";
import { Account } from "./account";
import { InquiryQuote } from "./inquiry-quote";
import { Document } from "./document";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Inquiry {
    id: number;
    inquiry_name?: string | null;
    inquiry_type?: "guest" | "homeowner" | "partner" | "other";
    inquiry_stage?: InquiryStage;
    previous_inquiry_stage: InquiryStage;
    inquiry_stage_updated_at?: string;
    inquiry_source?: string | null;
    message?: string | null;
    description?: string | null;
    notes?: string | null;
    contact_name?: string;
    contact_email?: string | null;
    contact_company?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;
    contact_website?: string | null;
    contact_country?: Country;
    provider?: string | null;
    channel_external_id?: string | null;
    channel?: Channel;
    inquire_property?: Property;
    property: Property;
    inquire_location?: Location;
    inquire_check_in?: string | null;
    inquire_check_out?: string | null;
    inquire_adults?: number | null;
    inquire_children?: number | null;
    inquire_babies?: number | null;
    inquire_nights?: number | null;
    inquire_bedrooms?: number | null;
    quote_total?: number | null;
    quote_currency?: string | null;
    quote_budget?: number | null;
    conversion_website_url?: string | null;
    conversion_referrer_url?: string | null;
    point_of_conversion?: string | null;
    converted_booking?: Booking;
    converted_account?: Account;
    converted_property?: Property;
    converted_at?: string;
    allows_pre_approval?: boolean | null;
    is_pre_approved?: boolean;
    pre_approval_external_id?: string | null;
    pre_approved_at?: string | null;
    pre_approved_until?: string | null;
    pre_approval_withdrawn_at?: string | null;
    first_message_sent_at?: string;
    last_message_sent_at?: string;
    first_special_offer_sent_at?: string;
    last_special_offer_sent_at?: string;
    inquiry_quotes?: InquiryQuote[];
    documents?: Document[];
    created_at: string;
    updated_at: string;
    custom_fields?: any;
}

export class InquiryClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'inquiry';

    public async create(params: InquiryCreateParams, options?: RequestOptions): Promise<Response<Inquiry>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: InquiryUpdateParams, options?: RequestOptions): Promise<Response<Inquiry>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: InquiryDeleteParams, options?: RequestOptions): Promise<Response<Inquiry>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async query(params?: InquiryQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Inquiry>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: InquiryFetchParams, options?: RequestOptions): Promise<Response<Inquiry>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async convert(params: InquiryConvertParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/convert`,{params,options});
    }

    public async preApprove(params: InquiryPreApproveParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/pre-approve`,{params,options});
    }

    public async voidPreApproval(params: InquiryVoidPreApprovalParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/void-pre-approval`,{params,options});
    }

    public async getMessagingAccounts(params: InquiryGetMessagingAccountsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-messaging-accounts`,{params,options});
    }

    public async setCustomFields(params: InquirySetCustomFieldsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-custom-fields`,{params,options});
    }
}

export interface InquiryCreateParams {
    inquiry_name?: string | null;
    inquiry_type: "guest" | "homeowner" | "partner" | "other";
    inquiry_stage?: number | null;
    inquiry_source?: string | null;
    message?: string | null;
    description?: string | null;
    notes?: string | null;
    contact_name: string;
    contact_email?: string | null;
    contact_company?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;
    contact_website?: string | null;
    contact_country?: number | null;
    channel_external_id?: string | null;
    channel?: number | null;
    inquire_property?: number | null;
    inquire_location?: number | null;
    inquire_check_in?: string | null;
    inquire_check_out?: string | null;
    inquire_adults?: number | null;
    inquire_children?: number | null;
    inquire_babies?: number | null;
    inquire_nights?: number | null;
    inquire_bedrooms?: number | null;
    quote_total?: number | null;
    quote_currency?: string | null;
    quote_budget?: number | null;
    conversion_website_url?: string | null;
    conversion_referrer_url?: string | null;
    point_of_conversion?: string | null;
    allows_pre_approval?: boolean | null;
}

export interface InquiryUpdateParams {
    id: number;
    inquiry_name?: string | null;
    inquiry_type?: "guest" | "homeowner" | "partner" | "other";
    inquiry_stage?: number | null;
    inquiry_source?: string | null;
    message?: string | null;
    description?: string | null;
    notes?: string | null;
    contact_name?: string;
    contact_email?: string | null;
    contact_company?: string | null;
    contact_phone?: string | null;
    contact_address?: string | null;
    contact_website?: string | null;
    contact_country?: number | null;
    channel_external_id?: string | null;
    channel?: number | null;
    inquire_property?: number | null;
    inquire_location?: number | null;
    inquire_check_in?: string | null;
    inquire_check_out?: string | null;
    inquire_adults?: number | null;
    inquire_children?: number | null;
    inquire_babies?: number | null;
    inquire_nights?: number | null;
    inquire_bedrooms?: number | null;
    quote_total?: number | null;
    quote_currency?: string | null;
    quote_budget?: number | null;
    conversion_website_url?: string | null;
    conversion_referrer_url?: string | null;
    point_of_conversion?: string | null;
    allows_pre_approval?: boolean | null;
}

export interface InquiryDeleteParams {
    id: number;
}

export interface InquiryQueryParams {
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

export interface InquiryFetchParams {
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

export interface InquiryConvertParams {
    id: number;
    converted_booking?: number | null;
    converted_property?: number | null;
    converted_account?: number | null;
    force?: boolean | null;
}

export interface InquiryPreApproveParams {
    id: number;
    pre_approval_external_id?: string | null;
    pre_approved_until?: string | null;
}

export interface InquiryVoidPreApprovalParams {
    id: number;
    force?: boolean | null;
}

export interface InquiryGetMessagingAccountsParams {
    id: number;
}

export interface InquirySetCustomFieldsParams {
    id: number;
    custom_fields: any;
}
