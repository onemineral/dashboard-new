import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface Cause {
    id: string;
    name: string;
    description: string;
    short_description: string;
    activities_description: string;
    category: string;
    hero_image: string;
    slug: string;
    location: string;
    location_description: string;
    location_image: string;
    country: string;
    geolocation: {
        latitude: number;
        longitude: number;
    };
    website: string;
    activities?: Array<{
        image: string;
        title: string;
        description: string;
    }>;
}

export class CauseClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'cause';

    public async query(params: CauseQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Cause>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: CauseFetchParams, options?: RequestOptions): Promise<Response<Cause>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }
}

export interface CauseQueryParams {
    offset: number;
    count: number;
    paginate?: {
        page?: number;
        perpage?: number;
    };
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

export interface CauseFetchParams {
    slug: string;
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
