import { Channel } from "./channel";
import { Country } from "./country";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface BookingComLegalEntity {
    id: number;
    provider: string;
    channel: Channel;
    legal_entity_id: string;
    legal_contact_email: string;
    legal_contact_name: string;
    legal_contact_phone: string;
    legal_name: string;
    company_name: string;
    country: Country;
    city: string;
    postcode: string;
    street: string;
    options: any;
    created_at: string;
    updated_at: string;
}

export class BookingComLegalEntityClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking-com-legal-entity';

    public async create(params: BookingComLegalEntityCreateParams, options?: RequestOptions): Promise<Response<BookingComLegalEntity>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async fetch(params: BookingComLegalEntityFetchParams, options?: RequestOptions): Promise<Response<BookingComLegalEntity>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: BookingComLegalEntityQueryParams, options?: RequestOptions): Promise<PaginatedResponse<BookingComLegalEntity>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }
}

export interface BookingComLegalEntityCreateParams {
    channel: number;
    legal_contact_name: string;
    legal_contact_email: string;
    legal_contact_phone: string;
    legal_name?: string | null;
    company_name: string;
    country: number;
    city?: string | null;
    postcode?: string | null;
    street?: string | null;
}

export interface BookingComLegalEntityFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
    with?: string[];
    with_aggregations?: Array<{
            type?: "count" | "avg" | "sum" | "min" | "max",
            as?: string,
            relation?: string,
            field?: string,
            where?: {
                conditions?: any,
                conditions_logic?: string | null
            }
        }>;
}

export interface BookingComLegalEntityQueryParams {
    sort?: Array<{
            field?: string,
            direction?: "asc" | "desc",
            locale?: string | null
        }>;
    where?: {
            conditions?: any,
            conditions_logic?: string | null,
            aggregate_conditions?: any,
            aggregate_conditions_logic?: string | null
        };
    picklist?: boolean;
    no_auto_relations?: boolean | null;
    paginate?: {
            page?: number,
            perpage?: number
        };
    with?: string[];
    with_aggregations?: Array<{
            type?: "count" | "avg" | "sum" | "min" | "max",
            as?: string,
            relation?: string,
            field?: string,
            where?: {
                conditions?: any,
                conditions_logic?: string | null
            }
        }>;
}
