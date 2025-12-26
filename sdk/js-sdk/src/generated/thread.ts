import { Booking } from "./booking";
import { Inquiry } from "./inquiry";
import { Property } from "./property";
import { MessageProvider } from "./message-provider";
import { Account } from "./account";
import { User } from "./user";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Thread {
    id: number;
    resource: {
            type: 'booking' | 'inquiry' | 'property',
            record: Booking | Inquiry | Property
        };
    thread_identifier: string;
    default_message_provider: MessageProvider;
    available_message_providers: MessageProvider[];
    thread_external_id: string;
    subject: string;
    account: Account;
    user?: User;
    last_message_excerpt: string;
    last_message_at: string;
    requires_attention: boolean;
    is_spam: boolean;
    is_archived: boolean;
    messages_count: number;
    has_alerts: boolean;
    ai_agent_generating_response: boolean;
    ai_engagement_enabled: boolean;
    ai_engagement_disabled_reason: string;
    property: Property;
    created_at: string;
    updated_at: string;
}

export class ThreadClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'thread';

    public async query(params?: ThreadQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Thread>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: ThreadFetchParams, options?: RequestOptions): Promise<Response<Thread>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async markNoActionNeeded(params: ThreadMarkNoActionNeededParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/mark-no-action-needed`,{params,options});
    }

    public async markSpamArchive(params: ThreadMarkSpamArchiveParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/mark-spam-archive`,{params,options});
    }

    public async countRequiresAttention(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/count-requires-attention`,{options});
    }

    public async counts(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/counts`,{options});
    }

    public async updateAiEngagement(params: ThreadUpdateAiEngagementParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-ai-engagement`,{params,options});
    }
}

export interface ThreadQueryParams {
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
    resource_type?: Array<"booking" | "inquiry" | "property">;
    resource_id?: number;
    recipient_type?: "any" | "user" | "account";
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

export interface ThreadFetchParams {
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

export interface ThreadMarkNoActionNeededParams {
    id: number;
    performed_by_ai?: boolean;
}

export interface ThreadMarkSpamArchiveParams {
    id: number;
    is_spam: boolean;
    is_archived: boolean;
}

export interface ThreadUpdateAiEngagementParams {
    id: number;
    enabled: boolean;
    disable_reason?: string | null;
}
