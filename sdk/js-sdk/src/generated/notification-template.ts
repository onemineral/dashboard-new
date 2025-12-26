import { NotificationLayout } from "./notification-layout";
import { TranslatedText } from "./shared";
import { User } from "./user";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";
import { Booking } from "./booking";
import { Inquiry } from "./inquiry";
import { Account } from "./account";
import { GuestAccount } from "./guest-account";
import { PartnerAccount } from "./partner-account";

export interface NotificationTemplate {
    id: number;
    name: string;
    layout?: NotificationLayout;
    subject?: TranslatedText | null;
    content_editor_type: "visual" | "code";
    content?: TranslatedText | null;
    text: TranslatedText;
    resource_type: "booking" | "inquiry" | "property";
    template_id?: string;
    created_by: User;
    last_updated_by: User;
    last_used_at: string;
    created_at: string;
    updated_at: string;
}

export class NotificationTemplateClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'notification-template';

    public async query(params?: NotificationTemplateQueryParams, options?: RequestOptions): Promise<PaginatedResponse<NotificationTemplate>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: NotificationTemplateFetchParams, options?: RequestOptions): Promise<Response<NotificationTemplate>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: NotificationTemplateCreateParams, options?: RequestOptions): Promise<Response<NotificationTemplate>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: NotificationTemplateUpdateParams, options?: RequestOptions): Promise<Response<NotificationTemplate>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: NotificationTemplateDeleteParams, options?: RequestOptions): Promise<Response<NotificationTemplate>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async generateTextFromHtml(params: NotificationTemplateGenerateTextFromHtmlParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/generate-text-from-html`,{params,options});
    }

    public async generate(params: NotificationTemplateGenerateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/generate`,{params,options});
    }

    public async preview(params: NotificationTemplatePreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/preview`,{params,options});
    }
}

export interface NotificationTemplateQueryParams {
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
    resource_type?: "booking" | "inquiry" | "property";
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

export interface NotificationTemplateFetchParams {
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

export interface NotificationTemplateCreateParams {
    name: string;
    layout?: number | null;
    subject?: TranslatedText | null;
    content_editor_type?: "visual" | "code";
    content?: TranslatedText | null;
    text: TranslatedText;
    resource_type: "booking" | "inquiry" | "property";
}

export interface NotificationTemplateUpdateParams {
    id: number;
    name: string;
    layout?: number | null;
    subject?: TranslatedText | null;
    content_editor_type?: "visual" | "code";
    content?: TranslatedText | null;
    text: TranslatedText;
    resource_type: "booking" | "inquiry" | "property";
}

export interface NotificationTemplateDeleteParams {
    id: number;
}

export interface NotificationTemplateGenerateTextFromHtmlParams {
    id: number;
    force?: boolean;
}

export interface NotificationTemplateGenerateParams {
    resource: {
            type: 'booking' | 'inquiry',
            record: Booking | Inquiry
        };
    template: number;
    receiver?: {
            type: 'account' | 'user' | 'guest-account' | 'partner-account' | null,
            record: Account | User | GuestAccount | PartnerAccount | null
        };
    locale?: string | null;
}

export interface NotificationTemplatePreviewParams {
    layout?: number;
    resource: {
            type: 'booking' | 'inquiry',
            record: Booking | Inquiry
        };
    subject?: TranslatedText | null;
    content: TranslatedText;
    locale?: string;
    receiver?: {
            type: 'account' | 'user' | 'guest-account' | 'partner-account' | null,
            record: Account | User | GuestAccount | PartnerAccount | null
        };
    content_type: "text/plain" | "text/html";
}
