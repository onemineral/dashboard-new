import { NotificationTemplate } from './notification-template';
import { Account } from './account';
import { EmailConfiguration } from './email-configuration';
import { Booking } from './booking';
import { User } from './user';
import { Workflow } from './workflow';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';
import { GuestAccount } from './guest-account';
import { PartnerAccount } from './partner-account';

export interface Message {
    id: number;
    notification_template: NotificationTemplate;
    receiver: {
        type: 'account';
        record: Account;
    };
    email_configuration?: EmailConfiguration;
    status: string;
    type: string;
    provider: string;
    subject: string | null;
    body: string;
    to: any;
    from: any;
    direction: string;
    external_message_id: string;
    resource: {
        type: 'booking';
        record: Booking;
    };
    bounced: number;
    delivered: number;
    opened: number;
    read: number;
    clicked: number;
    metadata: any;
    sent_by: {
        type: 'user' | 'account';
        record: User | Account;
    };
    workflow: Workflow;
    sent_at: string;
    created_at: string;
    updated_at: string;
}

export class MessageClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'message';

    public async query(params?: MessageQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Message>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: MessageFetchParams, options?: RequestOptions): Promise<Response<Message>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async send(params: MessageSendParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/send`, { params, options });
    }

    public async getThreads(params: MessageGetThreadsParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/get-threads`, {
            params,
            options,
        });
    }

    public async getThreadMessages(params: MessageGetThreadMessagesParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/get-thread-messages`, {
            params,
            options,
        });
    }
}

export interface MessageQueryParams {
    sort?: Array<{
        field?: string;
        direction?: 'asc' | 'desc';
        locale?: string | null;
    }>;
    where?: {
        conditions?: any;
        conditions_logic?: string | null;
        aggregate_conditions?: any;
        aggregate_conditions_logic?: string | null;
    };
    picklist?: boolean;
    paginate?: {
        page?: number;
        perpage?: number;
    };
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

export interface MessageFetchParams {
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

export interface MessageSendParams {
    notification_template?: number | null;
    type: 'mail';
    email_configuration?: number | null;
    subject: string;
    body: string;
    receiver: {
        type: 'account' | 'user' | 'guest-account' | 'partner-account';
        record: Account | User | GuestAccount | PartnerAccount;
    };
    additional_receivers?: any;
    resource: {
        type: 'booking';
        record: Booking;
    };
    workflow?: number | null;
}

export interface MessageGetThreadsParams {
    sort?: Array<{
        field?: string;
        direction?: 'asc' | 'desc';
        locale?: string | null;
    }>;
    where?: {
        conditions?: any;
        conditions_logic?: string | null;
        aggregate_conditions?: any;
        aggregate_conditions_logic?: string | null;
    };
    picklist?: boolean;
    resource: {
        type: 'booking';
        record: Booking;
    };
    paginate?: {
        page?: number;
        perpage?: number;
    };
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

export interface MessageGetThreadMessagesParams {
    sort?: Array<{
        field?: string;
        direction?: 'asc' | 'desc';
        locale?: string | null;
    }>;
    where?: {
        conditions?: any;
        conditions_logic?: string | null;
        aggregate_conditions?: any;
        aggregate_conditions_logic?: string | null;
    };
    picklist?: boolean;
    parent_message_id: number;
    paginate?: {
        page?: number;
        perpage?: number;
    };
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
