import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface Superset {
    id: number;
    created_at: string;
    updated_at: string;
}

export class SupersetClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'superset';

    public async guestToken(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/guest-token`, { options });
    }
}
