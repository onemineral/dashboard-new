import { Account } from "./account";
import { ChannelProperty } from "./channel-property";
import { Image } from "./image";
import { GroupedWebsiteNavigation } from "./grouped-website-navigation";
import { WebsiteDomain } from "./website-domain";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";
import { TranslatedText, NodeFileUpload } from "./shared";

export interface WebsiteChannel {
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
    images: Image[];
    navigation: GroupedWebsiteNavigation[];
    current_domain: WebsiteDomain;
    analytics_share_url?: string;
    token?: string;
    created_at: string;
    updated_at: string;
}

export class WebsiteChannelClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'website-channel';

    public async fetch(params: WebsiteChannelFetchParams, options?: RequestOptions): Promise<Response<WebsiteChannel>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: WebsiteChannelCreateParams, options?: RequestOptions): Promise<Response<WebsiteChannel>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async queryImages(params: WebsiteChannelQueryImagesParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/query-images`,{params,options});
    }

    public async uploadImage(params: WebsiteChannelUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`,{params,options: {...options, fileUpload: true}});
    }

    public async updateTheme(params: WebsiteChannelUpdateThemeParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-theme`,{params,options});
    }

    public async updateThemePreview(params: WebsiteChannelUpdateThemePreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-theme-preview`,{params,options});
    }

    public async themeSpecs(params: WebsiteChannelThemeSpecsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/theme-specs`,{params,options});
    }

    public async updateGeneralSettings(params: WebsiteChannelUpdateGeneralSettingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-general-settings`,{params,options});
    }

    public async fetchByDomain(params: WebsiteChannelFetchByDomainParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-by-domain`,{params,options});
    }

    public async onboarding(params: WebsiteChannelOnboardingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/onboarding`,{params,options});
    }

    public async syncTranslations(params: WebsiteChannelSyncTranslationsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-translations`,{params,options});
    }

    public async queryTranslations(params: WebsiteChannelQueryTranslationsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/query-translations`,{params,options});
    }

    public async upsertTranslations(params: WebsiteChannelUpsertTranslationsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upsert-translations`,{params,options});
    }
}

export interface WebsiteChannelFetchParams {
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

export interface WebsiteChannelCreateParams {
    name: string;
    subdomain: string;
}

export interface WebsiteChannelQueryImagesParams {
    channel: number;
    paginate?: {
            page?: number,
            perpage?: number
        };
}

export interface WebsiteChannelUploadImageParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface WebsiteChannelUpdateThemeParams {
    channel: number;
    theme?: any;
}

export interface WebsiteChannelUpdateThemePreviewParams {
    channel: number;
    theme?: any;
    preview_id: string;
}

export interface WebsiteChannelThemeSpecsParams {
    channel: number;
}

export interface WebsiteChannelUpdateGeneralSettingsParams {
    channel: number;
    logo?: string | null;
    favicon?: string | null;
    site_name?: string;
    date_format?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY" | "YYYY/MM/DD" | "DD/MM/YYYY" | "MM/DD/YYYY" | "MMMM Do YYYY" | "ddd MMM Do YYYY";
    show_whatsapp_chat?: boolean;
    whatsapp_phone_number?: string;
    whatsapp_pre_filled_message?: TranslatedText;
    locations?: number[];
    collections?: number[];
    tags?: number[];
    default_currency: number;
    show_currencies: "all" | "select" | "none";
    currencies?: number[];
    default_language: number;
    show_languages: "all" | "select" | "none";
    languages?: number[];
    default_title: TranslatedText;
    default_description?: TranslatedText;
    default_social_image?: string | null;
    google_analytics_account?: string;
    google_ads_account?: string;
    facebook_pixel?: string;
    google_tag_manager?: string;
    enable_cookie_consent?: boolean;
    cookie_consent_text?: TranslatedText;
    cookie_consent_button_text?: TranslatedText;
    cookie_consent_bg?: string | null;
}

export interface WebsiteChannelFetchByDomainParams {
    domain: string;
    preview_id?: string;
}

export interface WebsiteChannelOnboardingParams {
    id: number;
}

export interface WebsiteChannelSyncTranslationsParams {
    id: number;
    messages: any;
}

export interface WebsiteChannelQueryTranslationsParams {
    id: number;
    locale?: string | null;
    for_translation?: boolean | null;
}

export interface WebsiteChannelUpsertTranslationsParams {
    id: number;
    locale: string;
    messages: any;
}
