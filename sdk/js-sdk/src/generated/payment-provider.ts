import { ApiClient } from "../api-client";
import { TranslatedText } from "./shared";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface PaymentProvider {
}

export class PaymentProviderClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'payment-provider';

    public async createRedsys(params: PaymentProviderCreateRedsysParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-redsys`,{params,options});
    }

    public async createXmoney(params: PaymentProviderCreateXmoneyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-xmoney`,{params,options});
    }

    public async createPaypal(params: PaymentProviderCreatePaypalParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-paypal`,{params,options});
    }

    public async createAuthorizeNet(params: PaymentProviderCreateAuthorizeNetParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-authorize-net`,{params,options});
    }

    public async createPayuIn(params: PaymentProviderCreatePayuInParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-payu-in`,{params,options});
    }

    public async createRazorpay(params: PaymentProviderCreateRazorpayParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-razorpay`,{params,options});
    }
}

export interface PaymentProviderCreateRedsysParams {
    name: TranslatedText;
    legal_entity: number;
    merchant_code: string;
    terminal: string;
    signature_key: string;
    currencies: number[];
    default_currency: number;
}

export interface PaymentProviderCreateXmoneyParams {
    name: TranslatedText;
    legal_entity: number;
    api_key: string;
    webhook_secret: string;
}

export interface PaymentProviderCreatePaypalParams {
    name: TranslatedText;
    legal_entity: number;
    client_id: string;
    secret: string;
}

export interface PaymentProviderCreateAuthorizeNetParams {
    name: TranslatedText;
    legal_entity: number;
    login_id: string;
    transaction_key: string;
}

export interface PaymentProviderCreatePayuInParams {
    name: TranslatedText;
    legal_entity: number;
    key: string;
    salt: string;
}

export interface PaymentProviderCreateRazorpayParams {
    name: TranslatedText;
    legal_entity: number;
    key_id: string;
    key_secret: string;
}
