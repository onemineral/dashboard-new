import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface SfDestination {}

export class SfDestinationClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'sf-destination';

    public async sync(params: SfDestinationSyncParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync`, { params, options });
    }
}

export interface SfDestinationSyncParams {
    pms_ids: string[];
}
