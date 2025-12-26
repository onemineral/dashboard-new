import { Booking } from "./booking";
import { CreditCard } from "./credit-card";
import { Currency } from "./currency";
import { PaymentMethod } from "./payment-method";
import { User } from "./user";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface SecurityDeposit {
    id: number;
    booking: Booking;
    credit_card: CreditCard;
    amount: number;
    reason?: string;
    error?: string;
    external_id?: string;
    currency?: Currency;
    payment_method?: PaymentMethod;
    created_by: User;
    status: "pending" | "success" | "failed";
    type: "authorization" | "capture" | "refund" | "reverse";
    created_at: string;
    updated_at: string;
}

export class SecurityDepositClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'security-deposit';

    public async authorize(params?: SecurityDepositAuthorizeParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/authorize`,{params,options});
    }

    public async capture(params: SecurityDepositCaptureParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/capture`,{params,options});
    }

    public async release(params: SecurityDepositReleaseParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/release`,{params,options});
    }

    public async fetch(params: SecurityDepositFetchParams, options?: RequestOptions): Promise<Response<SecurityDeposit>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: SecurityDepositUpdateParams, options?: RequestOptions): Promise<Response<SecurityDeposit>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface SecurityDepositAuthorizeParams {
    booking?: number;
    credit_card?: number | null;
    security_deposit?: number;
}

export interface SecurityDepositCaptureParams {
    id: number;
    amount: number;
    amount_converted?: number;
    product_name?: string | null;
    create_product?: boolean;
}

export interface SecurityDepositReleaseParams {
    id: number;
}

export interface SecurityDepositFetchParams {
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

export interface SecurityDepositUpdateParams {
    id: number;
    amount: number;
}
