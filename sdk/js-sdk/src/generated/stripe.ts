import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Stripe {
}

export class StripeClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'stripe';

    public async redirect(params: StripeRedirectParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/redirect`,{params,options});
    }

    public async callback(params: StripeCallbackParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/callback`,{params,options});
    }

    public async disconnect(params: StripeDisconnectParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/disconnect`,{params,options});
    }
}

export interface StripeRedirectParams {
    legal_entity: number;
}

export interface StripeCallbackParams {
    code: string;
    state: string;
}

export interface StripeDisconnectParams {
    payment_method: number;
}
