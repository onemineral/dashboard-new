import { TranslatedText } from './shared';
import { Image } from './image';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface LocationWebsite {
    id: number;
    quote_description?: TranslatedText | null;
    quote_signature?: string | null;
    drawing?: Image;
    weather_description?: TranslatedText | null;
    transport_description?: TranslatedText | null;
    weather_details_jan?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_feb?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_mar?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_apr?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_may?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_jun?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_jul?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_aug?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_sep?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_oct?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_nov?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_dec?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
}

export class LocationWebsiteClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'location-website';

    public async fetch(params: LocationWebsiteFetchParams, options?: RequestOptions): Promise<Response<LocationWebsite>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async update(params: LocationWebsiteUpdateParams, options?: RequestOptions): Promise<Response<LocationWebsite>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async uploadDrawing(params: LocationWebsiteUploadDrawingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-drawing`, {
            params,
            options: { ...options, fileUpload: true },
        });
    }
}

export interface LocationWebsiteFetchParams {
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

export interface LocationWebsiteUpdateParams {
    id: number;
    quote_description?: TranslatedText | null;
    quote_signature?: string | null;
    weather_description?: TranslatedText | null;
    transport_description?: TranslatedText | null;
    weather_details_jan?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_feb?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_mar?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_apr?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_may?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_jun?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_jul?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_aug?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_sep?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_oct?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_nov?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
    weather_details_dec?: {
        min?: number;
        max?: number;
        daylight_hours?: number;
        seasonality?: 'low' | 'high';
    };
}

export interface LocationWebsiteUploadDrawingParams {
    id: number;
    description?: string | null;
    file: string | Blob | Buffer;
}
