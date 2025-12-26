import { Image } from "./image";
import { Document } from "./document";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";
import { TranslatedText, NodeFileUpload } from "./shared";

export interface OnlineCheckin {
    id: number;
    arrival_time?: string | null;
    arrival_date?: string | null;
    car_park?: boolean | null;
    arrive_by?: "car" | "plane" | "train" | "boat" | "other";
    arrival_flight_number?: string | null;
    arrival_flight_eta?: string | null;
    arrival_airport?: string | null;
    arrival_flight_status?: "on time" | "delayed" | "cancelled";
    arrival_train_number?: string | null;
    arrival_train_eta?: string | null;
    arrival_train_station?: string | null;
    arrival_notes?: string | null;
    departure_time?: string | null;
    departure_date?: string | null;
    departure_by?: "car" | "plane" | "train" | "boat" | "other";
    departure_flight_number?: string | null;
    departure_flight_departure_time?: string | null;
    departure_flight_status?: "on time" | "delayed" | "cancelled";
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
    terms_and_conditions_accepted: boolean;
    identification_document_submitted: boolean;
    online_checkin_completed: boolean;
    documents?: Document[];
    created_at: string;
    updated_at: string;
    custom_fields?: any;
}

export class OnlineCheckinClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'online-checkin';

    public async fetch(params: OnlineCheckinFetchParams, options?: RequestOptions): Promise<Response<OnlineCheckin>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: OnlineCheckinUpdateParams, options?: RequestOptions): Promise<Response<OnlineCheckin>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async uploadIdentificationDocument(params: OnlineCheckinUploadIdentificationDocumentParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-identification-document`,{params,options: {...options, fileUpload: true}});
    }

    public async uploadSignature(params: OnlineCheckinUploadSignatureParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-signature`,{params,options: {...options, fileUpload: true}});
    }

    public async complete(params: OnlineCheckinCompleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/complete`,{params,options});
    }

    public async setCustomFields(params: OnlineCheckinSetCustomFieldsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-custom-fields`,{params,options});
    }
}

export interface OnlineCheckinFetchParams {
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

export interface OnlineCheckinUpdateParams {
    id: number;
    arrival_time?: string | null;
    arrival_date?: string | null;
    car_park?: boolean | null;
    arrive_by?: "car" | "plane" | "train" | "boat" | "other";
    arrival_flight_number?: string | null;
    arrival_flight_eta?: string | null;
    arrival_airport?: string | null;
    arrival_flight_status?: "on time" | "delayed" | "cancelled";
    arrival_train_number?: string | null;
    arrival_train_eta?: string | null;
    arrival_train_station?: string | null;
    arrival_notes?: string | null;
    departure_time?: string | null;
    departure_date?: string | null;
    departure_by?: "car" | "plane" | "train" | "boat" | "other";
    departure_flight_number?: string | null;
    departure_flight_departure_time?: string | null;
    departure_flight_status?: "on time" | "delayed" | "cancelled";
    departure_airport?: string | null;
    departure_train_number?: string | null;
    departure_train_departure_time?: string | null;
    departure_train_station?: string | null;
    departure_notes?: string | null;
    staff_notes?: string | null;
    additional_visitors?: string | null;
    sleeping_arrangements?: string | null;
}

export interface OnlineCheckinUploadIdentificationDocumentParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface OnlineCheckinUploadSignatureParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface OnlineCheckinCompleteParams {
    id: number;
    terms_accepted: boolean;
}

export interface OnlineCheckinSetCustomFieldsParams {
    id: number;
    custom_fields: any;
}
