import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Video {
    id: number;
    title?: TranslatedText;
    description?: TranslatedText | null;
    status: "processing" | "finished" | "failed";
    order: number;
    width: number;
    height: number;
    original_url: string;
    base_embed_url: string;
    embed_url: string;
    thumbnail_url: string;
    metadata?: any;
    created_at: string;
    updated_at: string;
}

export class VideoClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'video';

    public async fetch(params: VideoFetchParams, options?: RequestOptions): Promise<Response<Video>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: VideoUpdateParams, options?: RequestOptions): Promise<Response<Video>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: VideoDeleteParams, options?: RequestOptions): Promise<Response<Video>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async uploaded(params: VideoUploadedParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/uploaded`,{params,options});
    }
}

export interface VideoFetchParams {
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

export interface VideoUpdateParams {
    id: number;
    title?: TranslatedText;
    description?: TranslatedText | null;
}

export interface VideoDeleteParams {
    id: number;
}

export interface VideoUploadedParams {
    id: number;
}
