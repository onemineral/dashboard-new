import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";
import { TranslatedText } from "./shared";

export interface Translation {
}

export class TranslationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'translation';

    public async stats(params: TranslationStatsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/stats`,{params,options});
    }

    public async update(params: TranslationUpdateParams, options?: RequestOptions): Promise<Response<Translation>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async aiAutoTranslate(params: TranslationAiAutoTranslateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/ai-auto-translate`,{params,options});
    }

    public async fullAiAutoTranslate(params: TranslationFullAiAutoTranslateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/full-ai-auto-translate`,{params,options});
    }
}

export interface TranslationStatsParams {
    resource: string;
    fields: string[];
}

export interface TranslationUpdateParams {
    resource: string;
    field: string;
    language: number;
    translations: Array<{
            resource_id: number,
            translation: TranslatedText
        }>;
}

export interface TranslationAiAutoTranslateParams {
    resource: string;
    field: string;
    ids: number[];
    language: number;
}

export interface TranslationFullAiAutoTranslateParams {
    id: number;
}
