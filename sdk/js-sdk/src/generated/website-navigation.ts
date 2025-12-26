import { TranslatedText } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface WebsiteNavigation {
    id: number;
    label: TranslatedText;
    route: string;
    submenu: WebsiteNavigation[];
}

export class WebsiteNavigationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'website-navigation';

    public async fetch(params: WebsiteNavigationFetchParams, options?: RequestOptions): Promise<Response<WebsiteNavigation>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: WebsiteNavigationUpdateParams, options?: RequestOptions): Promise<Response<WebsiteNavigation>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }
}

export interface WebsiteNavigationFetchParams {
    channel: number;
}

export interface WebsiteNavigationUpdateParams {
    channel: number;
    placement: "main-menu" | "footer-menu";
    menu: Array<{
            id?: number | null,
            label?: TranslatedText,
            route?: string,
            resource?: {
                id?: number,
                type?: string
            },
            submenu?: {
                id?: number | null,
                label?: TranslatedText,
                route?: string,
                resource?: {
                    id?: number,
                    type?: string
                }
            }
        }>;
}
