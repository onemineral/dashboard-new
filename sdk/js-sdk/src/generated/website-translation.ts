import { WebsiteChannel } from "./website-channel";
import { Language } from "./language";
import { User } from "./user";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface WebsiteTranslation {
    id: number;
    locale?: string;
    key?: string;
    original_message?: string;
    message?: string;
    website?: WebsiteChannel;
    language?: Language;
    last_updated_by?: {
            type: 'user' | null,
            record: User | null
        };
    created_at: string;
    updated_at: string;
}

export class WebsiteTranslationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'website-translation';

    public async query(params: WebsiteTranslationQueryParams, options?: RequestOptions): Promise<PaginatedResponse<WebsiteTranslation>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async aiAutoTranslate(params: WebsiteTranslationAiAutoTranslateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/ai-auto-translate`,{params,options});
    }
}

export interface WebsiteTranslationQueryParams {
    locale?: string | null;
    domain: string;
}

export interface WebsiteTranslationAiAutoTranslateParams {
    id: number;
    locale: string;
}
