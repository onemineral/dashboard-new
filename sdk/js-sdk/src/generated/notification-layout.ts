import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface NotificationLayout {
    id: number;
    name: string;
    layout_css?: string | null;
    layout_body?: TranslatedText;
    created_at: string;
    updated_at: string;
}

export class NotificationLayoutClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'notification-layout';

    public async create(params: NotificationLayoutCreateParams, options?: RequestOptions): Promise<Response<NotificationLayout>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: NotificationLayoutUpdateParams, options?: RequestOptions): Promise<Response<NotificationLayout>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: NotificationLayoutDeleteParams, options?: RequestOptions): Promise<Response<NotificationLayout>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async query(params?: NotificationLayoutQueryParams, options?: RequestOptions): Promise<PaginatedResponse<NotificationLayout>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: NotificationLayoutFetchParams, options?: RequestOptions): Promise<Response<NotificationLayout>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface NotificationLayoutCreateParams {
    name: string;
    layout_css?: string | null;
    layout_body?: TranslatedText;
}

export interface NotificationLayoutUpdateParams {
    id: number;
    name?: string;
    layout_css?: string | null;
    layout_body?: TranslatedText;
}

export interface NotificationLayoutDeleteParams {
    id: number;
}

export interface NotificationLayoutQueryParams {
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

export interface NotificationLayoutFetchParams {
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
