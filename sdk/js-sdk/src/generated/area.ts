import { Property } from './property';
import { AreaType } from './area-type';
import { AreaSubtype } from './area-subtype';
import { Floor } from './floor';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';
import { TranslatedText } from './shared';

export interface Area {
    id: number;
    name?: string;
    property?: Property;
    type?: AreaType;
    subtype?: AreaSubtype;
    level?:
        | 'level -5'
        | 'level -4'
        | 'level -3'
        | 'level -2'
        | 'level -1'
        | 'level 0'
        | 'level +1'
        | 'level +2'
        | 'level +3'
        | 'level +4'
        | 'level +5';
    description?: string | null;
    sleep?: string | null;
    view?: string | null;
    notes?: string | null;
    is_featured?: boolean;
    order?: number;
    display_order?: number;
    floors?: Floor[];
    images?: Image[];
    created_at: string;
    updated_at: string;
}

export class AreaClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'area';

    public async query(params?: AreaQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Area>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: AreaFetchParams, options?: RequestOptions): Promise<Response<Area>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async create(params: AreaCreateParams, options?: RequestOptions): Promise<Response<Area>> {
        return this.apiClient.request(`${this.path}/create`, {
            params,
            options,
        });
    }

    public async update(params: AreaUpdateParams, options?: RequestOptions): Promise<Response<Area>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async del(params: AreaDeleteParams, options?: RequestOptions): Promise<Response<Area>> {
        return this.apiClient.request(`${this.path}/delete`, {
            params,
            options,
        });
    }

    public async uploadImage(params: AreaUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }

    public async deleteImage(params: AreaDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`, {
            params,
            options,
        });
    }

    public async updateImage(params: AreaUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`, {
            params,
            options,
        });
    }

    public async orderImages(params: AreaOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`, {
            params,
            options,
        });
    }

    public async orderFloors(params: AreaOrderFloorsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-floors`, {
            params,
            options,
        });
    }
}

export interface AreaQueryParams {
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

export interface AreaFetchParams {
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

export interface AreaCreateParams {
    name: string;
    property: number;
    type: number;
    subtype?: number | null;
    level?:
        | 'level -5'
        | 'level -4'
        | 'level -3'
        | 'level -2'
        | 'level -1'
        | 'level 0'
        | 'level +1'
        | 'level +2'
        | 'level +3'
        | 'level +4'
        | 'level +5';
    description?: string | null;
    sleep?: string | null;
    view?: string | null;
    notes?: string | null;
    is_featured?: boolean;
    order?: number;
    display_order?: number;
}

export interface AreaUpdateParams {
    id: number;
    name?: string;
    property?: number;
    type?: number;
    subtype?: number | null;
    level?:
        | 'level -5'
        | 'level -4'
        | 'level -3'
        | 'level -2'
        | 'level -1'
        | 'level 0'
        | 'level +1'
        | 'level +2'
        | 'level +3'
        | 'level +4'
        | 'level +5';
    description?: string | null;
    sleep?: string | null;
    view?: string | null;
    notes?: string | null;
    is_featured?: boolean;
    order?: number;
    display_order?: number;
}

export interface AreaDeleteParams {
    id: number;
}

export interface AreaUploadImageParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}

export interface AreaDeleteImageParams {
    id: number;
}

export interface AreaUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface AreaOrderImagesParams {
    id: number;
    order: number[];
}

export interface AreaOrderFloorsParams {
    id: number;
    order: number[];
}
