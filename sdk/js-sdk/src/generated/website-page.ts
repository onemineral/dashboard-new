import { WebsiteChannel } from "./website-channel";
import { Seo } from "./seo";
import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface WebsitePage {
    id: number;
    channel: WebsiteChannel;
    seo?: Seo;
    title: string;
    type: string;
    is_core: boolean;
    has_static_content: boolean;
    has_dynamic_content: boolean;
    has_text_content: boolean;
    text_content?: TranslatedText | null;
    settings: any;
    path: string;
    content_blocks: any;
    schema: any;
    created_at: string;
    updated_at: string;
}

export class WebsitePageClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'website-page';

    public async fetchPreview(params: WebsitePageFetchPreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-preview`,{params,options});
    }

    public async updatePreview(params: WebsitePageUpdatePreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-preview`,{params,options});
    }

    public async componentsSpecs(params: WebsitePageComponentsSpecsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/components-specs`,{params,options});
    }

    public async fetch(params?: WebsitePageFetchParams, options?: RequestOptions): Promise<Response<WebsitePage>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: WebsitePageCreateParams, options?: RequestOptions): Promise<Response<WebsitePage>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: WebsitePageUpdateParams, options?: RequestOptions): Promise<Response<WebsitePage>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: WebsitePageDeleteParams, options?: RequestOptions): Promise<Response<WebsitePage>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async updateAll(params: WebsitePageUpdateAllParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-all`,{params,options});
    }

    public async query(params: WebsitePageQueryParams, options?: RequestOptions): Promise<PaginatedResponse<WebsitePage>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }
}

export interface WebsitePageFetchPreviewParams {
    preview_id: string;
    channel?: number;
    slug?: string;
    type?: string;
    host?: string;
}

export interface WebsitePageUpdatePreviewParams {
    preview_id: string;
    channel: number;
    pages: Array<{
            id?: number,
            settings?: any,
            content_blocks?: Array<{
                type?: string,
                props?: any
            }>
        }>;
}

export interface WebsitePageComponentsSpecsParams {
    channel: number;
}

export interface WebsitePageFetchParams {
    id?: number;
    slug?: string;
    type?: string;
    host?: string;
    with_schema?: boolean;
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

export interface WebsitePageCreateParams {
    channel: number;
    title: string;
    text_content?: TranslatedText | null;
    content_type: "dynamic" | "text";
}

export interface WebsitePageUpdateParams {
    id: number;
    channel: number;
    title?: string;
    text_content?: TranslatedText | null;
    content_blocks?: Array<{
            type?: string,
            props?: any
        }>;
    settings?: any;
}

export interface WebsitePageDeleteParams {
    id: number;
}

export interface WebsitePageUpdateAllParams {
    channel: number;
    pages: Array<{
            id?: number,
            settings?: any,
            content_blocks?: Array<{
                type?: string,
                props?: any
            }>
        }>;
}

export interface WebsitePageQueryParams {
    channel: number;
}
