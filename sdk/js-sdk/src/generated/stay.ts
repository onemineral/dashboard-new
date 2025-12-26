import { Booking } from './booking';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';
import { NodeFileUpload } from './shared';

export interface Stay {
    id: number;
    booking?: Booking;
    arrival_time?: string;
    arrival_date?: string;
    car_park?: boolean | null;
    arrive_by?: 'car' | 'plane' | 'train' | 'boat' | 'other';
    arrival_flight_number?: string | null;
    arrival_flight_eta?: string | null;
    arrival_airport?: string | null;
    arrival_flight_status?: 'on time' | 'delayed' | 'cancelled';
    arrival_train_number?: string | null;
    arrival_train_eta?: string | null;
    arrival_train_station?: string | null;
    arrival_notes?: string | null;
    departure_time?: string | null;
    departure_date?: string;
    departure_by?: 'car' | 'plane' | 'train' | 'boat' | 'other';
    departure_flight_number?: string | null;
    departure_flight_departure_time?: string | null;
    departure_flight_status?: 'on time' | 'delayed' | 'cancelled';
    departure_airport?: string | null;
    departure_train_number?: string | null;
    departure_train_departure_time?: string | null;
    departure_train_station?: string | null;
    departure_notes?: string | null;
    staff_notes?: string | null;
    additional_visitors?: string | null;
    sleeping_arrangements?: string | null;
    identification_document?: Image;
    signature?: Image;
    guest_agreement_signed: boolean;
    identification_document_submitted: boolean;
    created_at: string;
    updated_at: string;
}

export class StayClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'stay';

    public async fetch(params: StayFetchParams, options?: RequestOptions): Promise<Response<Stay>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async update(params: StayUpdateParams, options?: RequestOptions): Promise<Response<Stay>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async uploadIdentificationDocument(
        params: StayUploadIdentificationDocumentParams,
        options?: RequestOptions,
    ): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-identification-document`, { params, options: { ...options, fileUpload: true } });
    }

    public async uploadSignature(params: StayUploadSignatureParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-signature`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async updateVisitors(params: StayUpdateVisitorsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-visitors`, {
            params,
            options,
        });
    }

    public async updateSleepingArrangements(
        params: StayUpdateSleepingArrangementsParams,
        options?: RequestOptions,
    ): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-sleeping-arrangements`, { params, options });
    }

    public async updateStaffNotes(params: StayUpdateStaffNotesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-staff-notes`, {
            params,
            options,
        });
    }
}

export interface StayFetchParams {
    id: number;
    with?: string[];
    with_aggregations?: Array<{
        type?: 'count' | 'avg' | 'sum' | 'min' | 'max';
        as?: string;
        relation?: string;
        field?: string;
        where?: {
            conditions?: any;
            conditions_logic?: string | null;
        };
    }>;
}

export interface StayUpdateParams {
    booking: number;
    arrival_time?: string;
    arrival_date?: string;
    car_park?: boolean | null;
    arrive_by?: 'car' | 'plane' | 'train' | 'boat' | 'other';
    arrival_flight_number?: string | null;
    arrival_flight_eta?: string | null;
    arrival_airport?: string | null;
    arrival_flight_status?: 'on time' | 'delayed' | 'cancelled';
    arrival_train_number?: string | null;
    arrival_train_eta?: string | null;
    arrival_train_station?: string | null;
    arrival_notes?: string | null;
    departure_time?: string | null;
    departure_date?: string;
    departure_by?: 'car' | 'plane' | 'train' | 'boat' | 'other';
    departure_flight_number?: string | null;
    departure_flight_departure_time?: string | null;
    departure_flight_status?: 'on time' | 'delayed' | 'cancelled';
    departure_airport?: string | null;
    departure_train_number?: string | null;
    departure_train_departure_time?: string | null;
    departure_train_station?: string | null;
    departure_notes?: string | null;
    staff_notes?: string | null;
    additional_visitors?: string | null;
    sleeping_arrangements?: string | null;
    guest_verification_terms_accepted?: boolean;
}

export interface StayUploadIdentificationDocumentParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface StayUploadSignatureParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface StayUpdateVisitorsParams {
    booking: number;
    additional_visitors?: string | null;
}

export interface StayUpdateSleepingArrangementsParams {
    booking: number;
    sleeping_arrangements?: string | null;
}

export interface StayUpdateStaffNotesParams {
    booking: number;
    staff_notes?: string | null;
}
