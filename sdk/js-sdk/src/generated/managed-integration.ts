import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface ManagedIntegration {
    id: number;
    name: string;
    external_id: string;
    status: "enabled" | "pending" | "disabled";
    options: any;
    provider: string;
    logo_url: string;
    icon_url: string;
    account?: Account;
    markup: number;
    connection: ChannelProperty;
    created_at: string;
    updated_at: string;
}

export class ManagedIntegrationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'managed-integration';

    public async createManagedSensei(params: ManagedIntegrationCreateManagedSenseiParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-sensei`,{params,options});
    }

    public async createManagedOrion(params: ManagedIntegrationCreateManagedOrionParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-orion`,{params,options});
    }

    public async createManagedBeyond(params: ManagedIntegrationCreateManagedBeyondParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-beyond`,{params,options});
    }

    public async upsertManagedBeyondListing(params: ManagedIntegrationUpsertManagedBeyondListingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upsert-managed-beyond-listing`,{params,options});
    }

    public async createManagedRevyoos(params: ManagedIntegrationCreateManagedRevyoosParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-revyoos`,{params,options});
    }

    public async attachRevyoosWidget(params: ManagedIntegrationAttachRevyoosWidgetParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach-revyoos-widget`,{params,options});
    }

    public async removeRevyoosWidget(params: ManagedIntegrationRemoveRevyoosWidgetParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/remove-revyoos-widget`,{params,options});
    }

    public async createManagedHostkit(params: ManagedIntegrationCreateManagedHostkitParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-hostkit`,{params,options});
    }

    public async createManagedTourmie(params: ManagedIntegrationCreateManagedTourmieParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-tourmie`,{params,options});
    }

    public async createManagedJervis(params: ManagedIntegrationCreateManagedJervisParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-jervis`,{params,options});
    }

    public async createManagedChekin(params: ManagedIntegrationCreateManagedChekinParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-chekin`,{params,options});
    }

    public async createManagedBayut(params: ManagedIntegrationCreateManagedBayutParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-bayut`,{params,options});
    }

    public async upsertManagedBayutListing(params: ManagedIntegrationUpsertManagedBayutListingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upsert-managed-bayut-listing`,{params,options});
    }

    public async createManagedGuestAdmin(params: ManagedIntegrationCreateManagedGuestAdminParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-guest-admin`,{params,options});
    }

    public async createManagedMastermindTech(params: ManagedIntegrationCreateManagedMastermindTechParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-mastermind-tech`,{params,options});
    }

    public async createManagedTurno(params: ManagedIntegrationCreateManagedTurnoParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-turno`,{params,options});
    }

    public async createManagedHostbuddy(params: ManagedIntegrationCreateManagedHostbuddyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-hostbuddy`,{params,options});
    }

    public async createManagedLinkbase(params: ManagedIntegrationCreateManagedLinkbaseParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-managed-linkbase`,{params,options});
    }

    public async fetchApiToken(params: ManagedIntegrationFetchApiTokenParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-api-token`,{params,options});
    }
}

export interface ManagedIntegrationCreateManagedSenseiParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedOrionParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedBeyondParams {
    name: string;
}

export interface ManagedIntegrationUpsertManagedBeyondListingParams {
    action: "create" | "delete";
    channel: number;
    property: number;
}

export interface ManagedIntegrationCreateManagedRevyoosParams {
    name: string;
}

export interface ManagedIntegrationAttachRevyoosWidgetParams {
    channel: number;
    property: number;
    revyoos_script: string;
    revyoos_html?: string | null;
}

export interface ManagedIntegrationRemoveRevyoosWidgetParams {
    id: number;
}

export interface ManagedIntegrationCreateManagedHostkitParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedTourmieParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedJervisParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedChekinParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedBayutParams {
    name: string;
    listing_agent_name: string;
    listing_agent_email: string;
    listing_agent_phone: string;
}

export interface ManagedIntegrationUpsertManagedBayutListingParams {
    action: "create" | "delete" | "update";
    channel: number;
    property: number;
    external_id?: string;
    rent_frequency?: "Daily" | "Weekly" | "Monthly" | "Yearly";
    rent_price?: number;
    furnished?: "Yes" | "No" | "Partly";
    city?: string;
    locality?: string;
    sub_locality?: string;
    tower_name?: string;
}

export interface ManagedIntegrationCreateManagedGuestAdminParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedMastermindTechParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedTurnoParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedHostbuddyParams {
    name: string;
}

export interface ManagedIntegrationCreateManagedLinkbaseParams {
    name: string;
}

export interface ManagedIntegrationFetchApiTokenParams {
    id: number;
}
