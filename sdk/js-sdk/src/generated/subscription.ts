import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Subscription {
    name: string;
    description: string;
    on_trial: boolean;
    trial_ends_at: string;
    is_active: boolean;
    status: "active" | "past_due" | "cancelled";
    has_upgrade_path: boolean;
    can_change_plan: boolean;
    ends_at: string;
    next_payment_total: number;
    next_payment_subtotal: number;
    next_payment_tax: number;
    next_payment_currency: string;
    next_payment_attempt: string;
    max_properties: number;
    max_websites: number;
    max_users: number;
    count_properties: number;
    count_users: number;
    count_websites: number;
}

export class SubscriptionClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'subscription';

    public async fetch(options?: RequestOptions): Promise<Response<Subscription>> {
        return this.apiClient.request(`${this.path}/fetch`,{options});
    }

    public async estimate(params?: SubscriptionEstimateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/estimate`,{params,options});
    }

    public async cancel(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/cancel`,{options});
    }

    public async createSubscription(params: SubscriptionCreateSubscriptionParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-subscription`,{params,options});
    }
}

export interface SubscriptionEstimateParams {
    usage?: number | null;
    with_checkout?: boolean;
    currency?: "eur" | "usd" | "ron";
}

export interface SubscriptionCreateSubscriptionParams {
    stripe_pm: string;
}
