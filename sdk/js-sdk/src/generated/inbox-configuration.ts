import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface InboxConfiguration {
    id: number;
    message_notification_mode: "all" | "summary";
    is_ai_enabled: boolean;
    ai_agent_name: string;
    ai_mode: "draft" | "live";
    ai_customize_tone: string;
    ai_deferred_topics: string[];
    ai_should_close_conversations: boolean;
    emergency_contact_info: string;
    ai_signature: string;
    ai_allow_images_processing: boolean;
    in_stay_booking_statuses: Array<"confirmed" | "pending_payment">;
}

export class InboxConfigurationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'inbox-configuration';

    public async fetch(options?: RequestOptions): Promise<Response<InboxConfiguration>> {
        return this.apiClient.request(`${this.path}/fetch`,{options});
    }

    public async update(params: InboxConfigurationUpdateParams, options?: RequestOptions): Promise<Response<InboxConfiguration>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface InboxConfigurationUpdateParams {
    id: number;
    message_notification_mode?: "all" | "summary";
    is_ai_enabled?: boolean;
    ai_agent_name?: string;
    ai_mode?: "draft" | "live";
    ai_customize_tone?: string;
    ai_deferred_topics?: string[];
    ai_should_close_conversations?: boolean;
    emergency_contact_info?: string;
    ai_signature?: string;
    ai_allow_images_processing?: boolean;
    in_stay_booking_statuses?: Array<"confirmed" | "pending_payment">;
}
