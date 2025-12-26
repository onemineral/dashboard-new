import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface UmamiWebsite {
    website_id: number;
    website_uuid: string;
    share_id: string;
}

export class UmamiWebsiteClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'umami-website';

    public async create(params: UmamiWebsiteCreateParams, options?: RequestOptions): Promise<Response<UmamiWebsite>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }
}

export interface UmamiWebsiteCreateParams {
    website: number;
}
