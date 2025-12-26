import { Item } from './item';
import { Room } from './room';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';
import { TranslatedText } from './shared';

export interface Instruction {
    id: number;
    description?: string | null;
    audience?: 'staff' | 'guest';
    task_type?:
        | 'checkin'
        | 'checkout'
        | 'home_preparation'
        | 'departure_cleaning'
        | 'daily_services'
        | 'entry_inventory'
        | 'departure_inventory'
        | 'ad_hoc'
        | 'house_rules'
        | 'house_manual';
    order: number;
    resource?: Item | Room;
    images?: Image[];
    created_at: string;
    updated_at: string;
}

export class InstructionClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'instruction';

    public async query(params?: InstructionQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Instruction>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: InstructionFetchParams, options?: RequestOptions): Promise<Response<Instruction>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: InstructionCreateParams, options?: RequestOptions): Promise<Response<Instruction>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: InstructionUpdateParams, options?: RequestOptions): Promise<Response<Instruction>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: InstructionDeleteParams, options?: RequestOptions): Promise<Response<Instruction>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: InstructionUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async deleteImage(params: InstructionDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }

    public async updateImage(params: InstructionUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: InstructionOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }
}

export interface InstructionQueryParams {
    sort?: Array<{
        field?: string;
        direction?: 'asc' | 'desc';
        locale?: string | null;
    }>;
    where?: {
        conditions?: any;
        conditions_logic?: string | null;
        aggregate_conditions?: any;
        aggregate_conditions_logic?: string | null;
    };
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

export interface InstructionFetchParams {
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

export interface InstructionCreateParams {
    description?: string | null;
    audience?: 'staff' | 'guest';
    task_type?:
        | 'checkin'
        | 'checkout'
        | 'home_preparation'
        | 'departure_cleaning'
        | 'daily_services'
        | 'entry_inventory'
        | 'departure_inventory'
        | 'ad_hoc'
        | 'house_rules'
        | 'house_manual';
    order?: number;
    resource: Item | Room;
}

export interface InstructionUpdateParams {
    id: number;
    description?: string | null;
    audience?: 'staff' | 'guest';
    task_type?:
        | 'checkin'
        | 'checkout'
        | 'home_preparation'
        | 'departure_cleaning'
        | 'daily_services'
        | 'entry_inventory'
        | 'departure_inventory'
        | 'ad_hoc'
        | 'house_rules'
        | 'house_manual';
    order?: number;
    resource?: Item | Room;
}

export interface InstructionDeleteParams {
    id: number;
}

export interface InstructionUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface InstructionDeleteImageParams {
    id: number;
}

export interface InstructionUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface InstructionOrderImagesParams {
    id: number;
    order: number[];
}
