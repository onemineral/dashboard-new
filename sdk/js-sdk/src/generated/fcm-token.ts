import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface FcmToken {
    id: number;
    token: string;
    platform: 'ios' | 'android' | 'web';
    device_identifier: string;
    is_active: boolean;
    last_activity_at: string;
    last_validated_at: string;
    created_at: string;
    updated_at: string;
}

export class FcmTokenClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'fcm-token';

    public async register(params: FcmTokenRegisterParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/register`, { params, options });
    }

    public async remove(params: FcmTokenRemoveParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/remove`, { params, options });
    }
}

export interface FcmTokenRegisterParams {
    token: string;
    platform: 'ios' | 'android' | 'web';
    device_identifier: string;
}

export interface FcmTokenRemoveParams {
    token: string;
}
