import { Image } from './image';
import { TranslatedText, Geo, DateRange } from './shared';
import { Location } from './location';
import { PropertyType } from './property-type';
import { Currency } from './currency';
import { Amenity } from './amenity';
import { PropertyRatesSettings } from './property-rates-settings';
import { PropertyHostRevenueShare } from './property-host-revenue-share';
import { Account } from './account';
import { Discount } from './discount';
import { PropertyPolicy } from './property-policy';
import { PropertyFee } from './property-fee';
import { PropertyLosSeason } from './property-los-season';
import { Review } from './review';
import { Booking } from './booking';
import { RatesAvailability } from './rates-availability';
import { Seo } from './seo';
import { LegalEntity } from './legal-entity';
import { Property } from './property';
import { Collection } from './collection';
import { Tag } from './tag';
import { RentalAgreement } from './rental-agreement';
import { PropertyRoom } from './property-room';
import { PropertyIcal } from './property-ical';
import { AvailabilityDetails } from './availability-details';
import { PropertyActivity } from './property-activity';
import { PropertyNearby } from './property-nearby';
import { PropertyHighlight } from './property-highlight';
import { PropertyStory } from './property-story';
import { PropertyLocal } from './property-local';
import { PropertyVideo } from './property-video';
import { PropertyService } from './property-service';
import { Area } from './area';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse, Response } from '../response';

export interface HostProperty {
    images?: Image[];
    main_image: Image;
    id: number;
    name: TranslatedText;
    internal_name?: string | null;
    headline?: TranslatedText | null;
    short_description?: TranslatedText | null;
    description?: TranslatedText | null;
    house_rules?: TranslatedText | null;
    surroundings?: TranslatedText | null;
    unique_benefits?: TranslatedText | null;
    status?: 'enabled' | 'pending' | 'disabled';
    ical_url: string;
    calendar_url: string;
    brochure_url: string;
    rental_agreement_url: string;
    rental_agreement_pdf_url: string;
    location: Location;
    property_type?: PropertyType;
    currency: Currency;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    max_occupancy: number;
    comfortable_occupancy: number;
    registration_number?: string | null;
    registration_number_issue_date?: string | null;
    registration_number_jurisdiction?: string | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    show_exact_address?: boolean;
    external_id?: string | null;
    marketing_price?: number | null;
    checkin_category?: 'doorman_entry' | 'lockbox' | 'smartlock' | 'keypad' | 'host_checkin' | 'other_checkin';
    interior_size?: string | null;
    exterior_size?: string | null;
    checkin_instructions?: TranslatedText | null;
    home_truths?: TranslatedText | null;
    reviews_count: number;
    reviews_rating: number;
    website_visible?: boolean | null;
    score?: number;
    amenities: Amenity[];
    rates_settings: PropertyRatesSettings;
    host_revenue_share?: PropertyHostRevenueShare;
    homeowners?: Account[];
    discounts?: Discount[];
    rates_updated_at?: string;
    availability_updated_at?: string;
    policies: PropertyPolicy;
    fees: PropertyFee[];
    los_seasons?: PropertyLosSeason[];
    reviews?: Review[];
    bookings?: Booking[];
    rates_availability?: RatesAvailability[];
    seo?: Seo;
    legal_entity?: LegalEntity;
    related_properties?: Property[];
    collections?: Collection[];
    tags?: Tag[];
    rental_agreement?: RentalAgreement;
    rooms: PropertyRoom[];
    property_icals?: PropertyIcal[];
    availability_details?: AvailabilityDetails;
    floor_images: Image[];
    staff_bedrooms?: number;
    contract_type?: 'exclusive' | 'non-exclusive';
    directions_to_building?: TranslatedText | null;
    directions_into_building?: TranslatedText | null;
    locking_up?: TranslatedText | null;
    activities?: PropertyActivity[];
    nearby?: PropertyNearby[];
    highlights?: PropertyHighlight[];
    story?: PropertyStory;
    local?: PropertyLocal;
    property_video?: PropertyVideo;
    services?: PropertyService[];
    areas?: Area[];
    temporary_signed_url?: string;
    guest_listing_url?: string;
    other_policies?: TranslatedText | null;
    location_override?: string | null;
    created_at: string;
    updated_at: string;
}

export class HostPropertyClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'host-property';

    public async query(params?: HostPropertyQueryParams, options?: RequestOptions): Promise<PaginatedResponse<HostProperty>> {
        return this.apiClient.request(`${this.path}/query`, {
            params,
            options,
        });
    }

    public async fetch(params: HostPropertyFetchParams, options?: RequestOptions): Promise<Response<HostProperty>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async setAvailability(params: HostPropertySetAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-availability`, {
            params,
            options,
        });
    }

    public async getRatesAvailability(params: HostPropertyGetRatesAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-rates-availability`, {
            params,
            options,
        });
    }
}

export interface HostPropertyQueryParams {
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
    availability?: {
        daterange?: DateRange;
        include_inquire_only?: boolean;
        ignore_restrictions?: boolean;
    };
    with_rates_and_bookings?: {
        daterange?: DateRange;
        length_of_stay?: number | null;
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

export interface HostPropertyFetchParams {
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

export interface HostPropertySetAvailabilityParams {
    property: number;
    daterange: DateRange;
    availability_status: string;
    notes?: string | null;
    external_id?: string;
    property_ical?: number | null;
    source?: string | null;
}

export interface HostPropertyGetRatesAvailabilityParams {
    property: number;
    daterange: DateRange;
    markup?: number;
    fill_default_values?: boolean;
}
