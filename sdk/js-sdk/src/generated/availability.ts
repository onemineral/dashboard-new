import { PropertyIcal } from "./property-ical";
import { DateRange } from "./shared";
import { AvailabilityStatus } from "./availability-status";
import { User } from "./user";
import { Booking } from "./booking";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Availability {
    id: number;
    external_id?: string;
    notes?: string;
    property_ical?: PropertyIcal;
    daterange?: DateRange;
    availability_status?: AvailabilityStatus;
    is_available?: boolean;
    created_by?: User;
    booking?: Booking;
    created_at: string;
    updated_at: string;
}

export class AvailabilityClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'availability';

    public async del(params?: AvailabilityDeleteParams, options?: RequestOptions): Promise<Response<Availability>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params: AvailabilityHistoryParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }
}

export interface AvailabilityDeleteParams {
    booking?: number;
    id?: number;
}

export interface AvailabilityHistoryParams {
    property: number;
    daterange: DateRange;
}
