import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface ImportSupplier {
    id: number;
    created_at: string;
    updated_at: string;
}

export class ImportSupplierClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'import-supplier';

    public async create(params: ImportSupplierCreateParams, options?: RequestOptions): Promise<Response<ImportSupplier>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }
}

export interface ImportSupplierCreateParams {
    provider: string;
}
