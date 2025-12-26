import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface Case {
    page_url?: string | null;
    type?: string | null;
    subject?: string | null;
    message?: string | null;
    resource_name?: string | null;
    resource_id?: string | null;
    reported_by_id?: string | null;
    case_origin?: string | null;
    files?: string | Blob | Buffer[];
}

export class CaseClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'case';

    public async create(params?: CaseCreateParams, options?: RequestOptions): Promise<Response<Case>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }
}

export interface CaseCreateParams {
    page_url?: string | null;
    type?: string | null;
    subject?: string | null;
    message?: string | null;
    resource_name?: string | null;
    resource_id?: string | null;
    reported_by_id?: string | null;
    case_origin?: string | null;
    files?: string | Blob | Buffer[];
}
