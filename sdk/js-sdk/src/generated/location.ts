import { Image } from "./image";
import { TranslatedText, Geo, NodeFileUpload } from "./shared";
import { Country } from "./country";
import { Collection } from "./collection";
import { Tag } from "./tag";
import { Property } from "./property";
import { Seo } from "./seo";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Location {
    images?: Image[];
    main_image: Image;
    id: number;
    name?: TranslatedText | null;
    country: Country;
    description?: TranslatedText | null;
    geo?: Geo | null;
    parent_location?: Location;
    ancestors: Location[];
    collections?: Collection[];
    tags?: Tag[];
    properties?: Property[];
    seo?: Seo;
    created_at: string;
    updated_at: string;
}

export class LocationClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'location';

    public async query(params?: LocationQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Location>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: LocationFetchParams, options?: RequestOptions): Promise<Response<Location>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: LocationCreateParams, options?: RequestOptions): Promise<Response<Location>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: LocationUpdateParams, options?: RequestOptions): Promise<Response<Location>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: LocationDeleteParams, options?: RequestOptions): Promise<Response<Location>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: LocationHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async autocomplete(params?: LocationAutocompleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/autocomplete`,{params,options});
    }

    public async uploadImage(params: LocationUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`,{params,options: {...options, fileUpload: true}});
    }

    public async updateImage(params: LocationUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`,{params,options});
    }

    public async deleteImage(params: LocationDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`,{params,options});
    }

    public async orderImages(params: LocationOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`,{params,options});
    }

    public async syncTags(params: LocationSyncTagsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-tags`,{params,options});
    }
}

export interface LocationQueryParams {
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

export interface LocationFetchParams {
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

export interface LocationCreateParams {
    name?: TranslatedText | null;
    country: number;
    description?: TranslatedText | null;
    geo?: Geo | null;
    parent_location?: number | null;
    collections?: number[] | null;
}

export interface LocationUpdateParams {
    id: number;
    name?: TranslatedText | null;
    country?: number;
    description?: TranslatedText | null;
    geo?: Geo | null;
    parent_location?: number | null;
    collections?: number[] | null;
}

export interface LocationDeleteParams {
    id: number;
}

export interface LocationHistoryParams {
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

export interface LocationAutocompleteParams {
    q?: string | null;
    limit?: number | null;
}

export interface LocationUploadImageParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface LocationUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
}

export interface LocationDeleteImageParams {
    id: number;
}

export interface LocationOrderImagesParams {
    id: number;
    order: number[];
}

export interface LocationSyncTagsParams {
    location: number;
    tags?: string[];
}
