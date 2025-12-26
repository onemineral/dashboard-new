import { Account } from './account';
import { ChannelProperty } from './channel-property';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface Whatsapp {
    id: number;
    name: string;
    external_id: string;
    status: 'enabled' | 'pending' | 'disabled';
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

export class WhatsappClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'whatsapp';

    public async create(params: WhatsappCreateParams, options?: RequestOptions): Promise<Response<Whatsapp>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async fetch(params: WhatsappFetchParams, options?: RequestOptions): Promise<Response<Whatsapp>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async listPhoneNumbers(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/list-phone-numbers`, {
            options,
        });
    }
}

export interface WhatsappCreateParams {
    code: string;
}

export interface WhatsappFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
    with?: string[];
    with_aggregations?: Array<{
        type?: 'count' | 'avg' | 'sum' | 'min' | 'max';
        as?: string;
        relation?: string;
        field?: string;
        where?: {
            conditions?: any;
            conditions_logic?: string | null;
        };
    }>;
}
