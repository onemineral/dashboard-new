import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface OnlineCheckinConfig {
    id: number;
    general_settings_description: TranslatedText;
    lead_guest_require_citizenship_info: boolean;
    lead_guest_require_id_info: boolean;
    lead_guest_require_id_upload: boolean;
    proof_of_identity_description: TranslatedText;
    lead_guest_require_gender_info: boolean;
    booking_description: TranslatedText;
    booking_early_checkin_late_checkout_policy: TranslatedText;
    additional_guests_description: TranslatedText;
    additional_guests_require_full_guest_info: boolean;
    additional_guests_require_email: boolean;
    additional_guests_require_phone: boolean;
    additional_guests_require_id_info: boolean;
    additional_guests_require_birthdate: boolean;
    additional_guests_require_citizenship_info: boolean;
    additional_guests_require_residency_info: boolean;
    additional_guests_require_gender_info: boolean;
    terms_of_acceptance_description: TranslatedText;
    created_at: string;
    updated_at: string;
}

export class OnlineCheckinConfigClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'online-checkin-config';

    public async update(params?: OnlineCheckinConfigUpdateParams, options?: RequestOptions): Promise<Response<OnlineCheckinConfig>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(options?: RequestOptions): Promise<Response<OnlineCheckinConfig>> {
        return this.apiClient.request(`${this.path}/fetch`,{options});
    }
}

export interface OnlineCheckinConfigUpdateParams {
    general_settings_description?: TranslatedText;
    lead_guest_require_citizenship_info?: boolean;
    lead_guest_require_id_info?: boolean;
    lead_guest_require_id_upload?: boolean;
    proof_of_identity_description?: TranslatedText;
    lead_guest_require_gender_info?: boolean;
    booking_description?: TranslatedText;
    booking_early_checkin_late_checkout_policy?: TranslatedText;
    additional_guests_description?: TranslatedText;
    additional_guests_require_full_guest_info?: boolean;
    additional_guests_require_email?: boolean;
    additional_guests_require_phone?: boolean;
    additional_guests_require_id_info?: boolean;
    additional_guests_require_birthdate?: boolean;
    additional_guests_require_citizenship_info?: boolean;
    additional_guests_require_residency_info?: boolean;
    additional_guests_require_gender_info?: boolean;
    terms_of_acceptance_description?: TranslatedText;
}
