import { PaymentMethod } from "./payment-method";
import { Booking } from "./booking";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface CreditCard {
    id: number;
    description: string;
    card_holder_name: string;
    card_number_masked: string;
    card_type: string;
    card_expiration_month: string;
    card_expiration_year: string;
    status?: "valid" | "invalid" | "expired";
    allow_automated_processing: boolean;
    payment_method?: PaymentMethod;
    resource: {
            type: 'booking',
            record: Booking
        };
}

export class CreditCardClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'credit-card';

    public async create(params: CreditCardCreateParams, options?: RequestOptions): Promise<Response<CreditCard>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async expire(params: CreditCardExpireParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/expire`,{params,options});
    }

    public async del(params: CreditCardDeleteParams, options?: RequestOptions): Promise<Response<CreditCard>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async fetch(params: CreditCardFetchParams, options?: RequestOptions): Promise<Response<CreditCard>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface CreditCardCreateParams {
    payment_method?: string;
    resource: {
            type: 'booking',
            record: Booking
        };
    description?: string | null;
    card?: {
            name?: string,
            number?: string,
            expiration_month?: number,
            expiration_year?: number,
            cvv?: string | null
        };
    card_token?: any;
    allow_automated_processing?: boolean;
}

export interface CreditCardExpireParams {
    id: number;
    status: "valid" | "invalid" | "expired";
}

export interface CreditCardDeleteParams {
    id: number;
}

export interface CreditCardFetchParams {
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
