import { Thread } from "./thread";
import { Workflow } from "./workflow";
import { User } from "./user";
import { Account } from "./account";
import { MessageProvider } from "./message-provider";
import { File } from "./file";
import { Property } from "./property";
import { DateRange } from "./shared";
import { Currency } from "./currency";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";
import { Booking } from "./booking";
import { Inquiry } from "./inquiry";

export interface ThreadMessage {
    id: number;
    thread: Thread;
    sent_by_workflow: Workflow;
    sent_by: {
            type: 'user' | 'account',
            record: User | Account
        };
    sent_by_name: string;
    direction: "inbound" | "outbound";
    message_type: "message" | "private_note" | "activity_log" | "special_offer" | "alert";
    content_type: "text/plain" | "text/html";
    is_sent: boolean;
    is_draft: boolean;
    sent_at: string;
    is_read: boolean;
    read_at: string;
    is_delivered: boolean;
    delivered_at: string;
    is_bounce: boolean;
    is_spam: boolean;
    requires_attention: boolean;
    scheduled_at: string;
    draft_rejected_at: string;
    draft_rejected_reason: string;
    content: string;
    subject: string;
    full_content: string;
    language: string;
    translated_content: string;
    translated_subject: string;
    translated_full_content: string;
    translated_language: string;
    provider: string;
    provider_info: MessageProvider;
    provider_message_id: string;
    options: any;
    error_message?: string;
    attachments: File[];
    special_offer_property: Property;
    special_offer_daterange: DateRange;
    special_offer_adults?: number | null;
    special_offer_children?: number | null;
    special_offer_babies?: number | null;
    special_offer_pets?: number | null;
    special_offer_total_price?: number | null;
    special_offer_currency?: Currency;
    special_offer_active: boolean;
    special_offer_rescinded: boolean;
    special_offer_expires_at: string;
    special_offer_voided_at: string;
    is_ai_message: boolean;
    draft_published_at: string;
    draft_rejection_reason?: string;
    created_at: string;
    updated_at: string;
}

export class ThreadMessageClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'thread-message';

    public async fetch(params: ThreadMessageFetchParams, options?: RequestOptions): Promise<Response<ThreadMessage>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: ThreadMessageQueryParams, options?: RequestOptions): Promise<PaginatedResponse<ThreadMessage>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async send(params: ThreadMessageSendParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/send`,{params,options});
    }

    public async retry(params: ThreadMessageRetryParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/retry`,{params,options});
    }

    public async publishMessage(params: ThreadMessagePublishMessageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/publish-message`,{params,options});
    }

    public async rejectMessage(params: ThreadMessageRejectMessageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/reject-message`,{params,options});
    }

    public async sendAlert(params: ThreadMessageSendAlertParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/send-alert`,{params,options});
    }

    public async receive(params: ThreadMessageReceiveParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/receive`,{params,options});
    }

    public async import(params?: ThreadMessageImportParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import`,{params,options});
    }

    public async createSpecialOffer(params: ThreadMessageCreateSpecialOfferParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-special-offer`,{params,options});
    }

    public async voidSpecialOffer(params: ThreadMessageVoidSpecialOfferParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/void-special-offer`,{params,options});
    }

    public async retrySpecialOffer(params: ThreadMessageRetrySpecialOfferParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/retry-special-offer`,{params,options});
    }
}

export interface ThreadMessageFetchParams {
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

export interface ThreadMessageQueryParams {
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
    thread?: number;
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

export interface ThreadMessageSendParams {
    thread?: number | null;
    provider: string;
    account?: number | null;
    user?: number | null;
    resource?: {
            type: 'booking' | 'inquiry' | 'property' | null,
            record: Booking | Inquiry | Property | null
        };
    content_type?: "text/plain" | "text/html";
    workflow?: number | null;
    content: string;
    subject?: string | null;
    options?: any;
    is_draft?: boolean;
    is_ai_message?: boolean;
    sent_by_name?: string | null;
    attachments?: Array<{
            file_name: string,
            content: string,
            url: string,
            headers: any
        }>;
}

export interface ThreadMessageRetryParams {
    id: number;
    attachments?: Array<{
            file_name: string,
            content: string,
            url: string,
            headers: any
        }>;
}

export interface ThreadMessagePublishMessageParams {
    id: number;
}

export interface ThreadMessageRejectMessageParams {
    id: number;
    reject_reason?: string | null;
}

export interface ThreadMessageSendAlertParams {
    thread: number;
    content: string;
    subject?: string | null;
    sent_by_name?: string | null;
    attachments?: Array<{
            file_name: string,
            content: string,
            url: string,
            headers: any
        }>;
}

export interface ThreadMessageReceiveParams {
    thread: number;
    provider: string;
    content_type?: "text/plain" | "text/html";
    content?: string | null;
    translated_content?: string | null;
    subject?: string;
    options?: any;
    provider_message_id?: string;
    sent_by_name?: string | null;
    sent_at?: string | null;
    attachments?: Array<{
            file_name: string,
            content: string,
            url: string,
            headers: any
        }>;
}

export interface ThreadMessageImportParams {
    thread?: number | null;
    account?: number | null;
    user?: number | null;
    resource?: {
            type: 'booking' | 'inquiry' | null,
            record: Booking | Inquiry | null
        };
    thread_external_id?: string;
    default_provider?: string;
    messages?: Array<{
            provider: string,
            content?: string | null,
            translated_content?: string | null,
            content_type: "text/plain" | "text/html",
            direction: "inbound" | "outbound",
            provider_message_id: string,
            sent_at: string,
            sent_by_name?: string | null,
            attachments: Array<{
                file_name: string,
                content: string,
                url: string,
                headers: any
            }>
        }>;
}

export interface ThreadMessageCreateSpecialOfferParams {
    thread?: number | null;
    thread_external_id?: number | null;
    content?: string | null;
    provider: string;
    provider_message_id?: number | null;
    resource?: {
            type: 'inquiry' | null,
            record: Inquiry | null
        };
    special_offer_property: number;
    special_offer_daterange: DateRange;
    special_offer_adults?: number | null;
    special_offer_children?: number | null;
    special_offer_babies?: number | null;
    special_offer_pets?: number | null;
    special_offer_total_price?: number | null;
    special_offer_currency?: number | null;
    special_offer_active?: boolean;
    sent_at?: string | null;
    sent_by_name?: string | null;
}

export interface ThreadMessageVoidSpecialOfferParams {
    id: number;
    force?: boolean | null;
}

export interface ThreadMessageRetrySpecialOfferParams {
    id: number;
}
