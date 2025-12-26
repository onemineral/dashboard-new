import { TranslatedText } from './shared';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface GuestAgreementConfig {
    id: number;
    general_settings_description: TranslatedText;
    lead_guest_require_citizenship_info: boolean;
    lead_guest_require_residency_info: boolean;
    lead_guest_require_id_info: boolean;
    lead_guest_require_gender_info: boolean;
    booking_description: TranslatedText;
    booking_early_checkin_late_checkout_policy: TranslatedText;
    additional_guests_description: TranslatedText;
    additional_guests_require_full_guest_info: boolean;
    additional_guests_require_citizenship_info: boolean;
    additional_guests_require_residency_info: boolean;
    additional_guests_require_gender_info: boolean;
    sleeping_arrangements_description: TranslatedText;
    sleeping_arrangements_required: boolean;
    additional_services_description: TranslatedText;
    additional_services_visible: boolean;
    proof_of_identity_description: TranslatedText;
    terms_of_acceptance_description: TranslatedText;
    created_at: string;
    updated_at: string;
}

export class GuestAgreementConfigClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'guest-agreement-config';

    public async update(params?: GuestAgreementConfigUpdateParams, options?: RequestOptions): Promise<Response<GuestAgreementConfig>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async fetch(options?: RequestOptions): Promise<Response<GuestAgreementConfig>> {
        return this.apiClient.request(`${this.path}/fetch`, { options });
    }
}

export interface GuestAgreementConfigUpdateParams {
    general_settings_description?: TranslatedText;
    lead_guest_require_citizenship_info?: boolean;
    lead_guest_require_residency_info?: boolean;
    lead_guest_require_id_info?: boolean;
    lead_guest_require_gender_info?: boolean;
    booking_description?: TranslatedText;
    booking_early_checkin_late_checkout_policy?: TranslatedText;
    additional_guests_description?: TranslatedText;
    additional_guests_require_full_guest_info?: boolean;
    additional_guests_require_citizenship_info?: boolean;
    additional_guests_require_residency_info?: boolean;
    additional_guests_require_gender_info?: boolean;
    sleeping_arrangements_description?: TranslatedText;
    sleeping_arrangements_required?: boolean;
    additional_services_description?: TranslatedText;
    additional_services_visible?: boolean;
    proof_of_identity_description?: TranslatedText;
    terms_of_acceptance_description?: TranslatedText;
}
