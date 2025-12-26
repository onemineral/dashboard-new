import { Room } from './room';
import { ItemType } from './item-type';
import { ItemSubtype } from './item-subtype';
import { Instruction } from './instruction';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';
import { TranslatedText } from './shared';

export interface Item {
    id: number;
    room?: Room;
    type?: ItemType;
    subtype?: ItemSubtype;
    name?: string;
    description?: string | null;
    location_notes?: string | null;
    wifi_network?: string | null;
    wifi_login?: string | null;
    wifi_password?: string | null;
    internal_notes?: string | null;
    width?: number | null;
    length?: number | null;
    height?: number | null;
    value?: number;
    quantity?: number;
    order?: number;
    instructions?: Instruction[];
    images?: Image[];
    is_featured?: boolean;
    created_at: string;
    updated_at: string;
}

export class ItemClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'item';

    public async query(params?: ItemQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Item>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: ItemFetchParams, options?: RequestOptions): Promise<Response<Item>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: ItemCreateParams, options?: RequestOptions): Promise<Response<Item>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: ItemUpdateParams, options?: RequestOptions): Promise<Response<Item>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: ItemDeleteParams, options?: RequestOptions): Promise<Response<Item>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: ItemUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async deleteImage(params: ItemDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }

    public async updateImage(params: ItemUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: ItemOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async orderInstructions(params: ItemOrderInstructionsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-instructions`, {
            params,
            options,
        });
    }
}

export interface ItemQueryParams {
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

export interface ItemFetchParams {
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

export interface ItemCreateParams {
    room: number;
    type: number;
    subtype?: number | null;
    name: string;
    description?: string | null;
    location_notes?: string | null;
    wifi_network?: string | null;
    wifi_login?: string | null;
    wifi_password?: string | null;
    internal_notes?: string | null;
    width?: number | null;
    length?: number | null;
    height?: number | null;
    value?: number;
    quantity?: number;
    order?: number;
    is_featured?: boolean;
}

export interface ItemUpdateParams {
    id: number;
    room?: number;
    type?: number;
    subtype?: number | null;
    name?: string;
    description?: string | null;
    location_notes?: string | null;
    wifi_network?: string | null;
    wifi_login?: string | null;
    wifi_password?: string | null;
    internal_notes?: string | null;
    width?: number | null;
    length?: number | null;
    height?: number | null;
    value?: number;
    quantity?: number;
    order?: number;
    is_featured?: boolean;
}

export interface ItemDeleteParams {
    id: number;
}

export interface ItemUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface ItemDeleteImageParams {
    id: number;
}

export interface ItemUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface ItemOrderImagesParams {
    id: number;
    order: number[];
}

export interface ItemOrderInstructionsParams {
    id: number;
    order: number[];
}
