import { PaymentSchedule } from "./payment-schedule";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface PaymentScheduleStep {
    id: number;
    payment_schedule?: PaymentSchedule;
    type?: "on_reservation" | "before_checkin";
    days?: number | null;
    charge_percent?: number;
    created_at: string;
    updated_at: string;
}

export class PaymentScheduleStepClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'payment-schedule-step';

    public async create(params: PaymentScheduleStepCreateParams, options?: RequestOptions): Promise<Response<PaymentScheduleStep>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: PaymentScheduleStepFetchParams, options?: RequestOptions): Promise<Response<PaymentScheduleStep>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: PaymentScheduleStepUpdateParams, options?: RequestOptions): Promise<Response<PaymentScheduleStep>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: PaymentScheduleStepDeleteParams, options?: RequestOptions): Promise<Response<PaymentScheduleStep>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface PaymentScheduleStepCreateParams {
    payment_schedule: number;
    type: "on_reservation" | "before_checkin";
    days?: number | null;
    charge_percent: number;
}

export interface PaymentScheduleStepFetchParams {
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

export interface PaymentScheduleStepUpdateParams {
    id: number;
    days?: number | null;
    charge_percent?: number;
}

export interface PaymentScheduleStepDeleteParams {
    id: number;
}
