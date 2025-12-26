import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Seo {
    title: TranslatedText;
    meta_keywords: TranslatedText;
    meta_description: TranslatedText;
    slug: string;
    created_at: string;
    updated_at: string;
}

export class SeoClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'seo';

    public async fetch(params: SeoFetchParams, options?: RequestOptions): Promise<Response<Seo>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: SeoUpdateParams, options?: RequestOptions): Promise<Response<Seo>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface SeoFetchParams {
    resource_type: string;
    resource_id: number;
}

export interface SeoUpdateParams {
    title?: TranslatedText;
    meta_keywords?: TranslatedText;
    meta_description?: TranslatedText;
    slug?: string;
    resource_type: string;
    resource_id: number;
}
