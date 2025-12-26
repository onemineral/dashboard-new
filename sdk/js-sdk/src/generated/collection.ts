import { Image } from "./image";
import { TranslatedText, NodeFileUpload } from "./shared";
import { Seo } from "./seo";
import { Property } from "./property";
import { Location } from "./location";
import { Tag } from "./tag";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Collection {
    images?: Image[];
    main_image: Image;
    id: number;
    name?: TranslatedText;
    description?: TranslatedText;
    is_featured?: boolean | null;
    seo?: Seo;
    properties?: Property[];
    locations?: Location[];
    tags?: Tag[];
    created_at: string;
    updated_at: string;
}

export class CollectionClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'collection';

    public async create(params: CollectionCreateParams, options?: RequestOptions): Promise<Response<Collection>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: CollectionUpdateParams, options?: RequestOptions): Promise<Response<Collection>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async fetch(params: CollectionFetchParams, options?: RequestOptions): Promise<Response<Collection>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: CollectionQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Collection>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async history(params?: CollectionHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async del(params: CollectionDeleteParams, options?: RequestOptions): Promise<Response<Collection>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async syncTags(params: CollectionSyncTagsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-tags`,{params,options});
    }

    public async uploadImage(params: CollectionUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`,{params,options: {...options, fileUpload: true}});
    }

    public async updateImage(params: CollectionUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`,{params,options});
    }

    public async deleteImage(params: CollectionDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`,{params,options});
    }

    public async orderImages(params: CollectionOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`,{params,options});
    }
}

export interface CollectionCreateParams {
    name: TranslatedText;
    description?: TranslatedText;
    is_featured?: boolean | null;
    properties?: number[];
    locations?: number[];
}

export interface CollectionUpdateParams {
    id: number;
    name?: TranslatedText;
    description?: TranslatedText;
    is_featured?: boolean | null;
    properties?: number[];
    locations?: number[];
}

export interface CollectionFetchParams {
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

export interface CollectionQueryParams {
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

export interface CollectionHistoryParams {
    id?: number;
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
    paginate?: {
            page?: number,
            perpage?: number
        };
}

export interface CollectionDeleteParams {
    id: number;
}

export interface CollectionSyncTagsParams {
    collection: number;
    tags?: string[];
}

export interface CollectionUploadImageParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface CollectionUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface CollectionDeleteImageParams {
    id: number;
}

export interface CollectionOrderImagesParams {
    id: number;
    order: number[];
}
