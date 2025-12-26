import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface AiGenerator {
    id: number;
    data: any;
    created_at: string;
    updated_at: string;
}

export class AiGeneratorClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'ai-generator';

    public async propertyInfoFromImages(params: AiGeneratorPropertyInfoFromImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/property-info-from-images`, { params, options });
    }
}

export interface AiGeneratorPropertyInfoFromImagesParams {
    property: number;
    context?: string | null;
}
