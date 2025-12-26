import { Currency } from "./currency";
import { Language } from "./language";
import { Tenant } from "./tenant";
import { Profile } from "./profile";
import { Subscription } from "./subscription";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface Settings {
    currencies: Currency[];
    languages?: Language[];
    tenant?: Tenant;
    profile?: Profile;
    redirect_to?: string;
    role: string;
    ui_locale: string;
    schema?: any;
    locales?: any;
    subscription?: Subscription;
    onboarding?: any;
}

export class SettingsClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'settings';

    public async fetch(options?: RequestOptions): Promise<Response<Settings>> {
        return this.apiClient.request(`${this.path}/fetch`,{options});
    }
}
