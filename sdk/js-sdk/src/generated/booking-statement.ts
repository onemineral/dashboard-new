import { Property } from "./property";
import { Account } from "./account";
import { DateRange } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface BookingStatement {
    id: number;
    url: string;
    pdf_url: string;
    resource: {
            type: 'property' | 'account',
            record: Property | Account
        };
    daterange: DateRange;
    created_at: string;
    updated_at: string;
}

export class BookingStatementClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking-statement';

    public async create(params: BookingStatementCreateParams, options?: RequestOptions): Promise<Response<BookingStatement>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async query(params?: BookingStatementQueryParams, options?: RequestOptions): Promise<PaginatedResponse<BookingStatement>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }
}

export interface BookingStatementCreateParams {
    daterange: DateRange;
    property?: number;
    account?: number;
}

export interface BookingStatementQueryParams {
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
    property?: number;
    account?: number;
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
