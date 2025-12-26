import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface PropertyLocal {
    id: number;
    local_title?: string | null;
    local_description?: string | null;
    local_highlights?: string | null;
    image_360?: Image;
}

export class PropertyLocalClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-local';

    public async fetch(params: PropertyLocalFetchParams, options?: RequestOptions): Promise<Response<PropertyLocal>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async update(params: PropertyLocalUpdateParams, options?: RequestOptions): Promise<Response<PropertyLocal>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async upload360Image(params: PropertyLocalUpload360ImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-360-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }
}

export interface PropertyLocalFetchParams {
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

export interface PropertyLocalUpdateParams {
    id: number;
    local_title?: string | null;
    local_description?: string | null;
    local_highlights?: string | null;
}

export interface PropertyLocalUpload360ImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}
