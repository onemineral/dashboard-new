import { GroupedWebsiteNavigation } from './grouped-website-navigation';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface WebsiteSettings {
    navigation: GroupedWebsiteNavigation[];
}

export class WebsiteSettingsClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'website-settings';

    public async fetchSettingsByHost(params: WebsiteSettingsFetchSettingsByHostParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-settings-by-host`, {
            params,
            options,
        });
    }

    public async fetchSettingsPreview(params: WebsiteSettingsFetchSettingsPreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-settings-preview`, {
            params,
            options,
        });
    }

    public async setSettingsPreview(params: WebsiteSettingsSetSettingsPreviewParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-settings-preview`, {
            params,
            options,
        });
    }
}

export interface WebsiteSettingsFetchSettingsByHostParams {
    host: string;
}

export interface WebsiteSettingsFetchSettingsPreviewParams {
    preview_id: string;
}

export interface WebsiteSettingsSetSettingsPreviewParams {
    preview_id: string;
    channel: number;
    color_primary?: string | null;
    color_secondary?: string | null;
    color_links?: string | null;
    color_text?: string | null;
    color_title?: string | null;
    logo?: string | null;
}
