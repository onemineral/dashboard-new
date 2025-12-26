import { Booking } from "./booking";
import { PropertyFee } from "./property-fee";
import { BookingProductLineItem } from "./booking-product-line-item";
import { CalculatedTax } from "./calculated-tax";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface BookingProduct {
    id: number;
    parent_resource: {
            type: 'booking',
            record: Booking
        };
    name: string;
    description?: string | null;
    guest_request?: string | null;
    items_count?: number | null;
    type: "accommodation" | "fee" | "additional_fee" | "additional_service" | "discount" | "service" | "bond_capture" | "other";
    checkin: string;
    checkout: string;
    total_pretax: number;
    total?: number;
    include_in_accommodation_subtotal: boolean;
    read_only: boolean;
    resource?: {
            type: 'property-fee',
            record: PropertyFee
        };
    line_items?: BookingProductLineItem[];
    taxes: CalculatedTax[];
    created_at: string;
    updated_at: string;
}

export class BookingProductClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking-product';

    public async fetch(params: BookingProductFetchParams, options?: RequestOptions): Promise<Response<BookingProduct>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: BookingProductCreateParams, options?: RequestOptions): Promise<Response<BookingProduct>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: BookingProductUpdateParams, options?: RequestOptions): Promise<Response<BookingProduct>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: BookingProductDeleteParams, options?: RequestOptions): Promise<Response<BookingProduct>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }
}

export interface BookingProductFetchParams {
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

export interface BookingProductCreateParams {
    parent_resource: {
            type: 'booking',
            record: Booking
        };
    name: string;
    description?: string | null;
    guest_request?: string | null;
    items_count?: number | null;
    total: number;
    type: "additional_fee" | "additional_service" | "discount" | "other";
    tax_class?: number | null;
}

export interface BookingProductUpdateParams {
    id: number;
    name?: string;
    description?: string | null;
    guest_request?: string | null;
    items_count?: number | null;
    total?: number;
    force?: boolean;
}

export interface BookingProductDeleteParams {
    id: number;
    force?: boolean;
}
