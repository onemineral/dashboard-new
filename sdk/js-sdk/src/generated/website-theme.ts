import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface WebsiteTheme {
    id: number;
    name: string;
    color_primary: string;
    color_secondary: string;
    color_links: string;
    color_text: string;
    color_title: string;
    font_primary: string;
    font_secondary: string;
    logo: string;
    created_at: string;
    updated_at: string;
}

export class WebsiteThemeClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'website-theme';

    public async update(params: WebsiteThemeUpdateParams, options?: RequestOptions): Promise<Response<WebsiteTheme>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async fetch(params: WebsiteThemeFetchParams, options?: RequestOptions): Promise<Response<WebsiteTheme>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }
}

export interface WebsiteThemeUpdateParams {
    channel: number;
    theme: any;
}

export interface WebsiteThemeFetchParams {
    channel: number;
    with_schema?: boolean;
}
