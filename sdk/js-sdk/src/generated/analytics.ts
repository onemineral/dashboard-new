import { ApiClient } from "../api-client";
import { DateRange } from "./shared";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Analytics {
    id: number;
    data?: any;
    created_at: string;
    updated_at: string;
}

export class AnalyticsClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'analytics';

    public async occupancy(params: AnalyticsOccupancyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/occupancy`,{params,options});
    }

    public async dailyOccupancy(params: AnalyticsDailyOccupancyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/daily-occupancy`,{params,options});
    }

    public async monthlyRevenue(params: AnalyticsMonthlyRevenueParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/monthly-revenue`,{params,options});
    }
}

export interface AnalyticsOccupancyParams {
    daterange: DateRange;
    properties?: number[] | null;
    include_all_properties?: boolean;
    location?: number | null;
    property_type?: number | null;
}

export interface AnalyticsDailyOccupancyParams {
    daterange: DateRange;
    properties?: number[] | null;
    include_all_properties?: boolean;
    location?: number | null;
    property_type?: number | null;
}

export interface AnalyticsMonthlyRevenueParams {
    daterange: DateRange;
    currency?: number | null;
    properties?: number[] | null;
    include_all_properties?: boolean;
    location?: number | null;
    property_type?: number | null;
}
