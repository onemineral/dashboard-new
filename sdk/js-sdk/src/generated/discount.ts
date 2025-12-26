import { DateRange } from "./shared";
import { Property } from "./property";
import { Booking } from "./booking";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Discount {
    id: number;
    name?: string;
    status: "pending" | "active" | "expired" | "disabled";
    amount: number;
    percent: number;
    coupon_code: string;
    stay_daterange?: DateRange | null;
    reservation_daterange?: DateRange | null;
    type: "coupon" | "automatic";
    properties?: Property[];
    bookings?: Booking[];
    created_at: string;
    updated_at: string;
}

export class DiscountClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'discount';

    public async create(params: DiscountCreateParams, options?: RequestOptions): Promise<Response<Discount>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: DiscountUpdateParams, options?: RequestOptions): Promise<Response<Discount>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: DiscountDeleteParams, options?: RequestOptions): Promise<Response<Discount>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async fetch(params: DiscountFetchParams, options?: RequestOptions): Promise<Response<Discount>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: DiscountQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Discount>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async updateStatus(params: DiscountUpdateStatusParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-status`,{params,options});
    }

    public async applyToAllProperties(params: DiscountApplyToAllPropertiesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/apply-to-all-properties`,{params,options});
    }

    public async createCoupon(params: DiscountCreateCouponParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-coupon`,{params,options});
    }

    public async updateCoupon(params: DiscountUpdateCouponParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-coupon`,{params,options});
    }

    public async deleteCoupon(params: DiscountDeleteCouponParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-coupon`,{params,options});
    }

    public async fetchCoupon(params: DiscountFetchCouponParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-coupon`,{params,options});
    }

    public async queryCoupons(params?: DiscountQueryCouponsParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/query-coupons`,{params,options});
    }

    public async updateCouponStatus(params: DiscountUpdateCouponStatusParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-coupon-status`,{params,options});
    }

    public async applyCouponToAllProperties(params: DiscountApplyCouponToAllPropertiesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/apply-coupon-to-all-properties`,{params,options});
    }

    public async history(params?: DiscountHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface DiscountCreateParams {
    name: string;
    amount?: number;
    percent?: number;
    stay_daterange?: DateRange | null;
    reservation_daterange?: DateRange | null;
    properties?: number[];
}

export interface DiscountUpdateParams {
    id: number;
    name?: string;
    amount?: number;
    percent?: number;
    stay_daterange?: DateRange | null;
    reservation_daterange?: DateRange | null;
    properties?: number[];
}

export interface DiscountDeleteParams {
    id: number;
}

export interface DiscountFetchParams {
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

export interface DiscountQueryParams {
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

export interface DiscountUpdateStatusParams {
    id: number;
    status: "active" | "disabled" | "expired";
}

export interface DiscountApplyToAllPropertiesParams {
    id: number;
}

export interface DiscountCreateCouponParams {
    name: string;
    amount?: number;
    percent?: number;
    stay_daterange?: DateRange | null;
    reservation_daterange?: DateRange | null;
    properties?: number[];
    coupon_code: string;
}

export interface DiscountUpdateCouponParams {
    id: number;
    name?: string;
    amount?: number;
    percent?: number;
    stay_daterange?: DateRange | null;
    reservation_daterange?: DateRange | null;
    properties?: number[];
    coupon_code?: string;
}

export interface DiscountDeleteCouponParams {
    id: number;
}

export interface DiscountFetchCouponParams {
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

export interface DiscountQueryCouponsParams {
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

export interface DiscountUpdateCouponStatusParams {
    id: number;
    status: "active" | "disabled" | "expired";
}

export interface DiscountApplyCouponToAllPropertiesParams {
    id: number;
}

export interface DiscountHistoryParams {
    id?: number;
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
    paginate?: {
            page?: number,
            perpage?: number
        };
}
