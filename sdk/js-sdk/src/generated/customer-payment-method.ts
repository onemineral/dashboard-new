import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface CustomerPaymentMethod {
    id?: string;
    brand?: string;
    expiry_month?: string;
    expiry_year?: string;
    last_four?: string;
    is_default?: boolean;
}

export class CustomerPaymentMethodClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'customer-payment-method';

    public async fetch(params: CustomerPaymentMethodFetchParams, options?: RequestOptions): Promise<Response<CustomerPaymentMethod>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }
}

export interface CustomerPaymentMethodFetchParams {
    id: string;
}
