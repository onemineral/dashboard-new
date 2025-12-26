import { Floor } from './floor';
import { RoomType } from './room-type';
import { RoomSubtype } from './room-subtype';
import { Item } from './item';
import { Instruction } from './instruction';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';
import { TranslatedText } from './shared';

export interface Room {
    id: number;
    floor?: Floor;
    type?: RoomType;
    subtype?: RoomSubtype;
    name?: string;
    description?: string | null;
    view?: string | null;
    size_sq_m?: number | null;
    is_featured?: boolean;
    display_order?: number;
    items?: Item[];
    instructions?: Instruction[];
    images?: Image[];
    created_at: string;
    updated_at: string;
}

export class RoomClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'room';

    public async query(params?: RoomQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Room>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: RoomFetchParams, options?: RequestOptions): Promise<Response<Room>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: RoomCreateParams, options?: RequestOptions): Promise<Response<Room>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: RoomUpdateParams, options?: RequestOptions): Promise<Response<Room>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: RoomDeleteParams, options?: RequestOptions): Promise<Response<Room>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: RoomUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async deleteImage(params: RoomDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }

    public async updateImage(params: RoomUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: RoomOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async orderItems(params: RoomOrderItemsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-items`, {
            params,
            options,
        });
    }
}

export interface RoomQueryParams {
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

export interface RoomFetchParams {
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

export interface RoomCreateParams {
    floor: number;
    type: number;
    subtype?: number | null;
    name: string;
    description?: string | null;
    view?: string | null;
    size_sq_m?: number | null;
    is_featured?: boolean;
    display_order?: number;
}

export interface RoomUpdateParams {
    id: number;
    floor?: number;
    type?: number;
    subtype?: number | null;
    name?: string;
    description?: string | null;
    view?: string | null;
    size_sq_m?: number | null;
    is_featured?: boolean;
    display_order?: number;
}

export interface RoomDeleteParams {
    id: number;
}

export interface RoomUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface RoomDeleteImageParams {
    id: number;
}

export interface RoomUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface RoomOrderImagesParams {
    id: number;
    order: number[];
}

export interface RoomOrderItemsParams {
    id: number;
    order: number[];
}
