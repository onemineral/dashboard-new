import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface WebLead {
    point_of_submission?: string | null;
    title?: string | null;
    lead_source: string;
    record_type: 'member' | 'trip';
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    description?: string | null;
    arrival_date?: string | null;
    departure_date?: string | null;
    property_pms_id?: number | null;
    adults?: number | null;
    member_traveler?: string | null;
    trip_coordinator?: string | null;
    preferred_contact?: string | null;
    inquiry_comments?: string | null;
    interested_in?: string | null;
    experience_id?: string | null;
}

export class WebLeadClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'web-lead';

    public async create(params: WebLeadCreateParams, options?: RequestOptions): Promise<Response<WebLead>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }
}

export interface WebLeadCreateParams {
    point_of_submission?: string | null;
    title?: string | null;
    lead_source: string;
    record_type: 'member' | 'trip';
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    description?: string | null;
    arrival_date?: string | null;
    departure_date?: string | null;
    property_pms_id?: number | null;
    adults?: number | null;
    member_traveler?: string | null;
    trip_coordinator?: string | null;
    preferred_contact?: string | null;
    inquiry_comments?: string | null;
    interested_in?: string | null;
    experience_id?: string | null;
}
