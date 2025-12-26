import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Notification {
    id: number;
    name: TranslatedText;
    category: string;
    type: string;
    subject: TranslatedText;
    body: TranslatedText;
    content: TranslatedText;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export class NotificationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'notification';

    public async query(params?: NotificationQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Notification>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: NotificationFetchParams, options?: RequestOptions): Promise<Response<Notification>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: NotificationUpdateParams, options?: RequestOptions): Promise<Response<Notification>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async enable(params: NotificationEnableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/enable`,{params,options});
    }

    public async disable(params: NotificationDisableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/disable`,{params,options});
    }
}

export interface NotificationQueryParams {
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

export interface NotificationFetchParams {
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

export interface NotificationUpdateParams {
    id: number;
    subject?: TranslatedText;
    body?: TranslatedText;
    content?: TranslatedText;
}

export interface NotificationEnableParams {
    id: number;
}

export interface NotificationDisableParams {
    id: number;
}
