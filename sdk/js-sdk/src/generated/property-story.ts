import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface PropertyStory {
    id: number;
    story_text?: string | null;
    story_profile_image?: Image;
}

export class PropertyStoryClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-story';

    public async fetch(params: PropertyStoryFetchParams, options?: RequestOptions): Promise<Response<PropertyStory>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async update(params: PropertyStoryUpdateParams, options?: RequestOptions): Promise<Response<PropertyStory>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async uploadStoryProfileImage(
        params: PropertyStoryUploadStoryProfileImageParams,
        options?: RequestOptions,
    ): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-story-profile-image`, { params, options: { ...options, fileUpload: true } });
    }
}

export interface PropertyStoryFetchParams {
    id: number;
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

export interface PropertyStoryUpdateParams {
    id: number;
    story_text?: string | null;
}

export interface PropertyStoryUploadStoryProfileImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}
