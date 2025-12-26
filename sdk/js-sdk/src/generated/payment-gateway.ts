import { PaymentMethod } from "./payment-method";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface PaymentGateway {
    id: number;
    name: string;
    provider: string;
    accepted_credit_cards: Array<"visa" | "mastercard" | "american_express" | "diners" | "union_pay_debit" | "union_pay_credit" | "jcb" | "discover" | "cash" | "bank_transfer" | "paypal">;
    available_features: Array<"can_store_credit_card" | "can_run_plain_text_credit_card" | "can_authorize_cards" | "can_process_refund">;
    payment_methods?: PaymentMethod[];
    logo_url: string;
    icon_url: string;
    created_at: string;
    updated_at: string;
}

export class PaymentGatewayClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'payment-gateway';

    public async query(params?: PaymentGatewayQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PaymentGateway>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: PaymentGatewayFetchParams, options?: RequestOptions): Promise<Response<PaymentGateway>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }
}

export interface PaymentGatewayQueryParams {
    sort?: Array<{
            field?: string,
            direction?: "asc" | "desc",
            locale?: string | null
        }>;
    where?: {
            conditions?: any,
            conditions_logic?: string | null,
            aggregate_conditions?: any,
            aggregate_conditions_logic?: string | null
        };
    picklist?: boolean;
    no_auto_relations?: boolean | null;
    paginate?: {
            page?: number,
            perpage?: number
        };
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

export interface PaymentGatewayFetchParams {
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
