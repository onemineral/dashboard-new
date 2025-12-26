import { Property } from "./property";
import { Booking } from "./booking";
import { Channel } from "./channel";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Review {
    id: number;
    property: Property;
    external_id?: string | null;
    booking: Booking;
    channel: Channel;
    review_language: string;
    review_sentiment: "positive" | "neutral" | "negative";
    name?: string | null;
    email?: string | null;
    rating: number;
    title?: string | null;
    review_content?: string | null;
    will_customer_return: "yes" | "no" | "unspecified";
    positive_tagline: string;
    negative_tagline: string;
    reviewed_at: string;
    created_at: string;
    updated_at: string;
}

export class ReviewClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'review';

    public async create(params: ReviewCreateParams, options?: RequestOptions): Promise<Response<Review>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: ReviewUpdateParams, options?: RequestOptions): Promise<Response<Review>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: ReviewFetchParams, options?: RequestOptions): Promise<Response<Review>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async del(params: ReviewDeleteParams, options?: RequestOptions): Promise<Response<Review>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async query(params?: ReviewQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Review>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }
}

export interface ReviewCreateParams {
    property: number;
    external_id?: string | null;
    booking?: number;
    name?: string | null;
    email?: string | null;
    rating: number;
    title?: string | null;
    review_content?: string | null;
    reviewed_at?: string;
}

export interface ReviewUpdateParams {
    id: number;
    external_id?: string | null;
    booking?: number;
    name?: string | null;
    email?: string | null;
    rating?: number;
    title?: string | null;
    review_content?: string | null;
    reviewed_at?: string;
}

export interface ReviewFetchParams {
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

export interface ReviewDeleteParams {
    id: number;
}

export interface ReviewQueryParams {
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
