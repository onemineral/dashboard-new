import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface PropertyVideo {
    id: number;
    video_url?: string | null;
}

export class PropertyVideoClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'property-video';

    public async update(params: PropertyVideoUpdateParams, options?: RequestOptions): Promise<Response<PropertyVideo>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }
}

export interface PropertyVideoUpdateParams {
    id: number;
    video_url?: string | null;
}
