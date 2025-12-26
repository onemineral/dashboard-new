import { ApiClient } from "../api-client";
import { DateRange } from "./shared";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Report {
}

export class ReportClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'report';

    public async occupancyPerProperty(params?: ReportOccupancyPerPropertyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/occupancy-per-property`,{params,options});
    }

    public async overlappingBookings(params?: ReportOverlappingBookingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/overlapping-bookings`,{params,options});
    }
}

export interface ReportOccupancyPerPropertyParams {
    daterange?: DateRange;
}

export interface ReportOverlappingBookingsParams {
    include_past?: boolean | null;
}
