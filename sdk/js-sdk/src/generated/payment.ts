import { Booking } from "./booking";
import { CreditCard } from "./credit-card";
import { PaymentMethod } from "./payment-method";
import { SecurityDeposit } from "./security-deposit";
import { Currency } from "./currency";
import { Document } from "./document";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Payment {
    id: number;
    resource?: {
            type: 'booking',
            record: Booking
        };
    parent_payment: Payment;
    amount?: number;
    amount_converted?: number;
    notes?: string;
    description?: string;
    type?: "charge" | "refund";
    status?: "success" | "success_pending" | "failed" | "pending" | "requires_action" | "voided";
    error?: string;
    external_id?: string;
    credit_card?: CreditCard;
    payment_method?: PaymentMethod;
    security_deposit?: SecurityDeposit;
    booking?: Booking;
    currency: Currency;
    documents?: Document[];
    created_at: string;
    updated_at: string;
}

export class PaymentClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'payment';

    public async create(params: PaymentCreateParams, options?: RequestOptions): Promise<Response<Payment>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async createRefund(params: PaymentCreateRefundParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-refund`,{params,options});
    }

    public async refund(params: PaymentRefundParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/refund`,{params,options});
    }

    public async void(params: PaymentVoidParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/void`,{params,options});
    }

    public async fetch(params: PaymentFetchParams, options?: RequestOptions): Promise<Response<Payment>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async upsertOta(params: PaymentUpsertOtaParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upsert-ota`,{params,options});
    }

    public async createClientSecret(params: PaymentCreateClientSecretParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-client-secret`,{params,options});
    }
}

export interface PaymentCreateParams {
    resource: {
            type: 'booking',
            record: Booking
        };
    credit_card?: number;
    payment_method?: number | null;
    payment_method_data?: {
            card?: {
                name?: string,
                number?: string,
                expiration_month?: number,
                expiration_year?: number,
                cvv?: string | null
            },
            card_token?: any,
            allow_automated_processing?: boolean
        };
    amount: number;
    notes?: string | null;
    description?: string | null;
}

export interface PaymentCreateRefundParams {
    resource: {
            type: 'booking',
            record: Booking
        };
    payment_method: number;
    amount: number;
    notes?: string | null;
    description?: string | null;
}

export interface PaymentRefundParams {
    payment: number;
    amount: number;
    notes?: string | null;
    description?: string | null;
}

export interface PaymentVoidParams {
    id: number;
}

export interface PaymentFetchParams {
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

export interface PaymentUpsertOtaParams {
    booking: number;
    amount: number;
}

export interface PaymentCreateClientSecretParams {
    booking: number;
    security_deposit_only?: boolean;
    return_url_ok: string;
    return_url_ko: string;
}
