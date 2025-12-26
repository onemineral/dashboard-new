import { Property } from "./property";
import { TranslatedText } from "./shared";
import { PropertyRoomBed } from "./property-room-bed";
import { Image } from "./image";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";
import { BedType } from "./bed-type";

export interface PropertyRoom {
    id: number;
    property: Property;
    name: TranslatedText;
    description?: TranslatedText | null;
    en_suite_bath: boolean;
    type: "living_room" | "bedroom";
    beds?: PropertyRoomBed[];
    additional_bed_configurations?: PropertyRoomBed[];
    images: Image[];
}

export class PropertyRoomClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'property-room';

    public async fetch(params: PropertyRoomFetchParams, options?: RequestOptions): Promise<Response<PropertyRoom>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: PropertyRoomCreateParams, options?: RequestOptions): Promise<Response<PropertyRoom>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PropertyRoomUpdateParams, options?: RequestOptions): Promise<Response<PropertyRoom>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: PropertyRoomDeleteParams, options?: RequestOptions): Promise<Response<PropertyRoom>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async sync(params: PropertyRoomSyncParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync`,{params,options});
    }

    public async syncImages(params: PropertyRoomSyncImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-images`,{params,options});
    }
}

export interface PropertyRoomFetchParams {
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

export interface PropertyRoomCreateParams {
    property: number;
    name?: TranslatedText;
    description?: TranslatedText | null;
    en_suite_bath?: boolean;
    type: "living_room" | "bedroom";
    beds?: Array<{
            bed_count?: number,
            group?: number,
            bed_type?: BedType
        }>;
    additional_bed_configurations?: Array<Array<{
            bed_count?: number,
            group?: number,
            bed_type?: BedType
        }>>;
}

export interface PropertyRoomUpdateParams {
    id: number;
    property?: number;
    name?: TranslatedText;
    description?: TranslatedText | null;
    en_suite_bath?: boolean;
    type?: "living_room" | "bedroom";
    beds?: Array<{
            bed_count?: number,
            group?: number,
            bed_type?: BedType
        }>;
    additional_bed_configurations?: Array<Array<{
            bed_count?: number,
            group?: number,
            bed_type?: BedType
        }>>;
}

export interface PropertyRoomDeleteParams {
    id: number;
}

export interface PropertyRoomSyncParams {
    property: number;
    rooms: Array<{
            name: TranslatedText,
            description?: TranslatedText | null,
            en_suite_bath: boolean,
            type: "living_room" | "bedroom",
            beds?: Array<{
                bed_count?: number,
                group?: number,
                bed_type?: BedType
            }>,
            additional_bed_configurations?: Array<{
                bed_count?: number,
                group?: number,
                bed_type?: BedType
            }>
        }>;
}

export interface PropertyRoomSyncImagesParams {
    room: number;
    images?: number[];
}
