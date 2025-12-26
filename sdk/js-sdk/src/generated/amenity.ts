import { TranslatedText, NodeFileUpload } from "./shared";
import { AmenityGroup } from "./amenity-group";
import { Image } from "./image";
import { Property } from "./property";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface Amenity {
    id: number;
    name: TranslatedText;
    original_name: string;
    amenity_group: AmenityGroup;
    description?: TranslatedText | null;
    is_featured: boolean;
    image: Image;
    properties?: Property[];
}

export class AmenityClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'amenity';

    public async query(params?: AmenityQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Amenity>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: AmenityFetchParams, options?: RequestOptions): Promise<Response<Amenity>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: AmenityCreateParams, options?: RequestOptions): Promise<Response<Amenity>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: AmenityUpdateParams, options?: RequestOptions): Promise<Response<Amenity>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: AmenityDeleteParams, options?: RequestOptions): Promise<Response<Amenity>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async history(params?: AmenityHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async uploadImage(params: AmenityUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`,{params,options: {...options, fileUpload: true}});
    }

    public async deleteImage(params: AmenityDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`,{params,options});
    }
}

export interface AmenityQueryParams {
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

export interface AmenityFetchParams {
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

export interface AmenityCreateParams {
    name?: TranslatedText;
    amenity_group: number;
    description?: TranslatedText | null;
    is_featured?: boolean;
    properties?: number[];
}

export interface AmenityUpdateParams {
    id: number;
    name?: TranslatedText;
    amenity_group?: number;
    description?: TranslatedText | null;
    is_featured?: boolean;
    properties?: number[];
}

export interface AmenityDeleteParams {
    id: number;
}

export interface AmenityHistoryParams {
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

export interface AmenityUploadImageParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface AmenityDeleteImageParams {
    id: number;
}
