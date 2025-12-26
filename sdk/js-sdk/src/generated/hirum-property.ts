import { Channel } from './channel';
import { Property } from './property';
import { ChannelManagerSync } from './channel-manager-sync';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface HirumProperty {
    id: number;
    status: 'enabled' | 'disabled' | 'pending_approval' | 'pending';
    provider: string;
    options: any;
    external_id: string;
    channel: Channel;
    property: Property;
    channel_manager_sync?: ChannelManagerSync[];
    created_at: string;
    updated_at: string;
}

export class HirumPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'hirum-property';

    public async fetch(params: HirumPropertyFetchParams, options?: RequestOptions): Promise<Response<HirumProperty>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async attach(params: HirumPropertyAttachParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/attach`, {
            params,
            options,
        });
    }

    public async unlink(params: HirumPropertyUnlinkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/unlink`, {
            params,
            options,
        });
    }
}

export interface HirumPropertyFetchParams {
    id: number;
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

export interface HirumPropertyAttachParams {
    property: number;
    channel: number;
    external_id: string;
}

export interface HirumPropertyUnlinkParams {
    id: number;
}
