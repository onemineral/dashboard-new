import { TranslatedText } from "./shared";
import { PaymentGateway } from "./payment-gateway";
import { LegalEntity } from "./legal-entity";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface PaymentMethod {
    id: number;
    name: TranslatedText;
    provider: string;
    description?: TranslatedText | null;
    instructions?: TranslatedText | null;
    show_on_website: boolean;
    status: "pending" | "enabled" | "disabled";
    type: "online" | "offline";
    category?: "bank_transfer" | "cheque" | "cash" | "other";
    external_id?: string;
    is_default?: boolean;
    payment_gateway?: PaymentGateway;
    legal_entity?: LegalEntity;
    intent_credentials?: any;
    logo_url: string;
    icon_url: string;
    created_at: string;
    updated_at: string;
}

export class PaymentMethodClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'payment-method';

    public async create(params: PaymentMethodCreateParams, options?: RequestOptions): Promise<Response<PaymentMethod>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PaymentMethodUpdateParams, options?: RequestOptions): Promise<Response<PaymentMethod>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: PaymentMethodFetchParams, options?: RequestOptions): Promise<Response<PaymentMethod>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: PaymentMethodQueryParams, options?: RequestOptions): Promise<PaginatedResponse<PaymentMethod>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async order(params: PaymentMethodOrderParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order`,{params,options});
    }
}

export interface PaymentMethodCreateParams {
    name: TranslatedText;
    description?: TranslatedText | null;
    instructions?: TranslatedText | null;
    show_on_website?: boolean;
    type: "online" | "offline";
    category?: "bank_transfer" | "cheque" | "cash" | "other";
    payment_gateway?: number;
    legal_entity: number;
    logo_url?: string;
    icon_url?: string;
}

export interface PaymentMethodUpdateParams {
    id: number;
    name: TranslatedText;
    instructions: TranslatedText | null;
    description?: TranslatedText | null;
    show_on_website?: boolean;
}

export interface PaymentMethodFetchParams {
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

export interface PaymentMethodQueryParams {
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

export interface PaymentMethodOrderParams {
    order: number[];
}
