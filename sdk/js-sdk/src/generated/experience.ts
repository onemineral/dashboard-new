import { ContentSection } from './content-section';
import { ItinerarySection } from './itinerary-section';
import { Proposal } from './proposal';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response, PaginatedResponse } from '../response';

export interface Experience {
    id: string;
    name: string;
    signed_url: string;
    category: string;
    image: string;
    destination_id: string;
    destination_name: string;
    description: string;
    marketing_price: string;
    short_description: string;
    order: string;
    map_image: string;
    location_title: string;
    next_steps_title: string;
    next_steps_description: string;
    next_steps_account_name: string;
    next_steps_account_image: string;
    content_sections: ContentSection[];
    itinerary_sections: ItinerarySection[];
    proposals: Proposal[];
}

export class ExperienceClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'experience';

    public async fetch(params: ExperienceFetchParams, options?: RequestOptions): Promise<Response<Experience>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async query(params: ExperienceQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Experience>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }
}

export interface ExperienceFetchParams {
    experience_id: string;
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

export interface ExperienceQueryParams {
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
