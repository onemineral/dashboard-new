import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface Salesforce {
    id: number;
    created_at: string;
    updated_at: string;
}

export class SalesforceClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'salesforce';

    public async redirect(params?: SalesforceRedirectParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/redirect`, {
            params,
            options,
        });
    }

    public async callback(params: SalesforceCallbackParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/callback`, {
            params,
            options,
        });
    }
}

export interface SalesforceRedirectParams {
    redirect_to?: string;
}

export interface SalesforceCallbackParams {
    code: string;
}
