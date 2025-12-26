import { Image } from "./image";
import { TranslatedText, Geo, DateRange, NodeFileUpload } from "./shared";
import { Location } from "./location";
import { PropertyType } from "./property-type";
import { Currency } from "./currency";
import { Amenity } from "./amenity";
import { PropertyRatesSettings } from "./property-rates-settings";
import { PropertyHostRevenueShare } from "./property-host-revenue-share";
import { PartnerAccount } from "./partner-account";
import { Discount } from "./discount";
import { PropertyPolicy } from "./property-policy";
import { PropertyFee } from "./property-fee";
import { PropertyLosSeason } from "./property-los-season";
import { Review } from "./review";
import { Booking } from "./booking";
import { RatesAvailability } from "./rates-availability";
import { ChannelManagerSync } from "./channel-manager-sync";
import { ChannelProperty } from "./channel-property";
import { Seo } from "./seo";
import { LegalEntity } from "./legal-entity";
import { Collection } from "./collection";
import { Tag } from "./tag";
import { RentalAgreement } from "./rental-agreement";
import { PropertyRoom } from "./property-room";
import { PropertyIcal } from "./property-ical";
import { AvailabilityDetails } from "./availability-details";
import { HealthScore } from "./health-score";
import { Video } from "./video";
import { PropertyWebsite } from "./property-website";
import { BookingStatement } from "./booking-statement";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";
import { AvailabilityStatus } from "./availability-status";
import { TaxClass } from "./tax-class";
import { PaymentSchedule } from "./payment-schedule";
import { LosTemplate } from "./los-template";
import { FeeType } from "./fee-type";
import { Account } from "./account";
import { Country } from "./country";

export interface Property {
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
    status?: "enabled" | "pending" | "disabled";
    ical_url: string;
    calendar_url: string;
    brochure_url: string;
    rental_agreement_url: string;
    rental_agreement_pdf_url: string;
    location: Location;
    property_type?: PropertyType;
    room_category_type: "entire_home" | "private_room" | "hotel_room" | "shared_room";
    bathroom_shared?: boolean | null;
    bathroom_shared_with?: Array<"other_guests" | "host" | "family_friends_roommates">;
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
    display_geo: Geo | null;
    show_exact_address?: boolean;
    price_type?: "daily_pricing" | "occupancy_based_pricing";
    external_id?: string | null;
    marketing_price?: number | null;
    checkin_category?: "doorman_entry" | "lockbox" | "smartlock" | "keypad" | "host_checkin" | "other_checkin";
    interior_size?: string | null;
    exterior_size?: string | null;
    checkin_instructions?: TranslatedText | null;
    checkout_instructions?: TranslatedText | null;
    home_truths?: TranslatedText | null;
    reviews_count: number;
    reviews_rating: number;
    website_visible?: boolean | null;
    score?: number;
    amenities: Amenity[];
    rates_settings: PropertyRatesSettings;
    host_revenue_share?: PropertyHostRevenueShare;
    homeowners?: PartnerAccount[];
    discounts?: Discount[];
    rates_updated_at?: string;
    availability_updated_at?: string;
    last_statement_generated_at?: string;
    scheduled_delete_at?: string;
    policies: PropertyPolicy;
    fees: PropertyFee[];
    los_seasons?: PropertyLosSeason[];
    reviews?: Review[];
    bookings?: Booking[];
    rates_availability?: RatesAvailability[];
    channel_manager_sync?: ChannelManagerSync[];
    channel_connections?: ChannelProperty[];
    seo?: Seo;
    legal_entity?: LegalEntity;
    related_properties?: Property[];
    collections?: Collection[];
    tags?: Tag[];
    rental_agreement?: RentalAgreement;
    rooms: PropertyRoom[];
    property_icals?: PropertyIcal[];
    availability_details?: AvailabilityDetails[];
    rate: any;
    floor_images: Image[];
    health_scores?: HealthScore[];
    health_score_total?: number;
    health_score_done?: number;
    health_score_done_percent?: number;
    critical_score_total?: number;
    critical_score_done?: number;
    critical_score_done_percent?: number;
    supplier_calendar_url?: string | null;
    videos?: Video[];
    websites?: PropertyWebsite[];
    last_bookings_statement?: BookingStatement;
    created_at: string;
    updated_at: string;
    custom_fields?: any;
}

export class PropertyClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'property';

    public async query(params?: PropertyQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Property>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: PropertyFetchParams, options?: RequestOptions): Promise<Response<Property>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async create(params: PropertyCreateParams, options?: RequestOptions): Promise<Response<Property>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: PropertyUpdateParams, options?: RequestOptions): Promise<Response<Property>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async setStatus(params: PropertySetStatusParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-status`,{params,options});
    }

    public async history(params?: PropertyHistoryParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/history`,{params,options});
    }

    public async autocomplete(params?: PropertyAutocompleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/autocomplete`,{params,options});
    }

    public async search(params?: PropertySearchParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/search`,{params,options});
    }

    public async import(params: PropertyImportParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import`,{params,options});
    }

    public async scheduleDelete(params: PropertyScheduleDeleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/schedule-delete`,{params,options});
    }

    public async del(params: PropertyDeleteParams, options?: RequestOptions): Promise<Response<Property>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async uploadImage(params: PropertyUploadImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-image`,{params,options: {...options, fileUpload: true}});
    }

    public async deleteImage(params: PropertyDeleteImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-image`,{params,options});
    }

    public async updateImage(params: PropertyUpdateImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-image`,{params,options});
    }

    public async orderImages(params: PropertyOrderImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-images`,{params,options});
    }

    public async setAvailability(params: PropertySetAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-availability`,{params,options});
    }

    public async setRatesAvailability(params: PropertySetRatesAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-rates-availability`,{params,options});
    }

    public async deleteAvailability(params?: PropertyDeleteAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-availability`,{params,options});
    }

    public async refreshAvailability(params: PropertyRefreshAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/refresh-availability`,{params,options});
    }

    public async syncBlockedAvailability(params: PropertySyncBlockedAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-blocked-availability`,{params,options});
    }

    public async getRatesAvailability(params: PropertyGetRatesAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-rates-availability`,{params,options});
    }

    public async getLosRates(params: PropertyGetLosRatesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-los-rates`,{params,options});
    }

    public async getUnavailability(params: PropertyGetUnavailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-unavailability`,{params,options});
    }

    public async getAvailabilityRanges(params: PropertyGetAvailabilityRangesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-availability-ranges`,{params,options});
    }

    public async ratesWithRanges(params: PropertyRatesWithRangesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/rates-with-ranges`,{params,options});
    }

    public async copyRates(params: PropertyCopyRatesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/copy-rates`,{params,options});
    }

    public async syncRatesLos(params: PropertySyncRatesLosParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-rates-los`,{params,options});
    }

    public async getOccupancyRates(params: PropertyGetOccupancyRatesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-occupancy-rates`,{params,options});
    }

    public async setOccupancyRates(params: PropertySetOccupancyRatesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-occupancy-rates`,{params,options});
    }

    public async updatePolicies(params: PropertyUpdatePoliciesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-policies`,{params,options});
    }

    public async updateRatesSettings(params: PropertyUpdateRatesSettingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-rates-settings`,{params,options});
    }

    public async bulkUpdate(params: PropertyBulkUpdateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/bulk-update`,{params,options});
    }

    public async bulkUpdatePolicies(params: PropertyBulkUpdatePoliciesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/bulk-update-policies`,{params,options});
    }

    public async bulkUpdateRatesSettings(params: PropertyBulkUpdateRatesSettingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/bulk-update-rates-settings`,{params,options});
    }

    public async bulkSetRatesAvailability(params: PropertyBulkSetRatesAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/bulk-set-rates-availability`,{params,options});
    }

    public async bulkSyncFees(params: PropertyBulkSyncFeesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/bulk-sync-fees`,{params,options});
    }

    public async bulkCopyRates(params: PropertyBulkCopyRatesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/bulk-copy-rates`,{params,options});
    }

    public async updateHostRevenueShare(params: PropertyUpdateHostRevenueShareParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-host-revenue-share`,{params,options});
    }

    public async getApplicableDiscounts(params: PropertyGetApplicableDiscountsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-applicable-discounts`,{params,options});
    }

    public async syncFees(params: PropertySyncFeesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-fees`,{params,options});
    }

    public async syncTags(params: PropertySyncTagsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-tags`,{params,options});
    }

    public async getQuote(params: PropertyGetQuoteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-quote`,{params,options});
    }

    public async getHomeownerQuote(params: PropertyGetHomeownerQuoteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-homeowner-quote`,{params,options});
    }

    public async createBooking(params: PropertyCreateBookingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-booking`,{params,options});
    }

    public async createHomeownerBooking(params: PropertyCreateHomeownerBookingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-homeowner-booking`,{params,options});
    }

    public async uploadFloorImage(params: PropertyUploadFloorImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-floor-image`,{params,options: {...options, fileUpload: true}});
    }

    public async deleteFloorImage(params: PropertyDeleteFloorImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/delete-floor-image`,{params,options});
    }

    public async updateFloorImage(params: PropertyUpdateFloorImageParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-floor-image`,{params,options});
    }

    public async orderFloorImages(params: PropertyOrderFloorImagesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/order-floor-images`,{params,options});
    }

    public async channelErrors(params?: PropertyChannelErrorsParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/channel-errors`,{params,options});
    }

    public async createVideo(params: PropertyCreateVideoParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/create-video`,{params,options});
    }

    public async setCustomFields(params: PropertySetCustomFieldsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-custom-fields`,{params,options});
    }
}

export interface PropertyQueryParams {
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
    with_rates_and_bookings?: {
            daterange?: DateRange,
            length_of_stay?: number | null
        };
    channel?: number;
    channel_filter?: "all" | "connected" | "not_connected";
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
    availability?: {
            daterange?: DateRange | null,
            months?: Array<"2025-12" | "2026-01" | "2026-02" | "2026-03" | "2026-04" | "2026-05" | "2026-06" | "2026-07" | "2026-08" | "2026-09" | "2026-10" | "2026-11" | "2026-12" | "2027-01" | "2027-02" | "2027-03" | "2027-04" | "2027-05">,
            over_weekend?: boolean,
            min_stay?: number | null,
            max_stay?: number | null,
            guests?: number,
            pets?: boolean,
            channel?: number,
            ignore: Array<"min_stay" | "max_stay" | "check_in_out" | "min_prior_notify" | "booking_window" | "all">,
            currency?: {
                id?: number,
                iso_code?: string
            },
            sort_direction?: "asc" | "desc",
            sort_by?: "total" | "total_discount" | "total_discount_percent",
            budget?: {
                min?: number | null,
                max?: number | null
            }
        };
}

export interface PropertyFetchParams {
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

export interface PropertyCreateParams {
    name?: TranslatedText;
    internal_name?: string | null;
    headline?: TranslatedText | null;
    short_description?: TranslatedText | null;
    description?: TranslatedText | null;
    house_rules?: TranslatedText | null;
    surroundings?: TranslatedText | null;
    unique_benefits?: TranslatedText | null;
    location: number;
    property_type?: number | null;
    room_category_type?: "entire_home" | "private_room" | "hotel_room" | "shared_room";
    bathroom_shared?: boolean | null;
    bathroom_shared_with?: Array<"other_guests" | "host" | "family_friends_roommates">;
    currency: number;
    bedrooms?: number;
    bathrooms: number;
    toilets: number;
    max_occupancy: number;
    comfortable_occupancy?: number;
    registration_number?: string | null;
    registration_number_issue_date?: string | null;
    registration_number_jurisdiction?: string | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    show_exact_address?: boolean;
    price_type?: "daily_pricing" | "occupancy_based_pricing";
    external_id?: string | null;
    marketing_price?: number | null;
    checkin_category?: "doorman_entry" | "lockbox" | "smartlock" | "keypad" | "host_checkin" | "other_checkin";
    interior_size?: string | null;
    exterior_size?: string | null;
    checkin_instructions?: TranslatedText | null;
    checkout_instructions?: TranslatedText | null;
    home_truths?: TranslatedText | null;
    website_visible?: boolean | null;
    amenities?: number[];
    homeowners?: number[] | null;
    discounts?: number[];
    legal_entity?: number;
    related_properties?: number[];
    collections?: number[] | null;
    rental_agreement?: number | null;
    supplier_calendar_url?: string | null;
}

export interface PropertyUpdateParams {
    id: number;
    name?: TranslatedText;
    internal_name?: string | null;
    headline?: TranslatedText | null;
    short_description?: TranslatedText | null;
    description?: TranslatedText | null;
    house_rules?: TranslatedText | null;
    surroundings?: TranslatedText | null;
    unique_benefits?: TranslatedText | null;
    location?: number;
    property_type?: number | null;
    room_category_type?: "entire_home" | "private_room" | "hotel_room" | "shared_room";
    bathroom_shared?: boolean | null;
    bathroom_shared_with?: Array<"other_guests" | "host" | "family_friends_roommates">;
    currency?: number;
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    max_occupancy?: number;
    comfortable_occupancy?: number;
    registration_number?: string | null;
    registration_number_issue_date?: string | null;
    registration_number_jurisdiction?: string | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    show_exact_address?: boolean;
    external_id?: string | null;
    marketing_price?: number | null;
    checkin_category?: "doorman_entry" | "lockbox" | "smartlock" | "keypad" | "host_checkin" | "other_checkin";
    interior_size?: string | null;
    exterior_size?: string | null;
    checkin_instructions?: TranslatedText | null;
    checkout_instructions?: TranslatedText | null;
    home_truths?: TranslatedText | null;
    website_visible?: boolean | null;
    amenities?: number[];
    homeowners?: number[] | null;
    discounts?: number[];
    legal_entity?: number;
    related_properties?: number[];
    collections?: number[] | null;
    rental_agreement?: number | null;
    supplier_calendar_url?: string | null;
}

export interface PropertySetStatusParams {
    id: number;
    status: "enabled" | "pending" | "disabled";
}

export interface PropertyHistoryParams {
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

export interface PropertyAutocompleteParams {
    q?: string | null;
    limit?: number | null;
    status?: "enabled" | "pending" | "disabled";
}

export interface PropertySearchParams {
    daterange?: DateRange | null;
    guests?: number | null;
    instant_bookable?: boolean | null;
    locations?: number[];
    amenities?: number[];
    collections?: number[];
    min_bedrooms?: number;
    min_bathrooms?: number;
    discounts_count?: number | null;
    budget?: {
            min?: number | null,
            max?: number | null
        };
    currency?: {
            id?: Currency,
            iso_code?: string
        };
    geo?: Geo;
    not_tags?: number[];
    tags?: number[];
    website_visible?: boolean | null;
    ignore_min_stay?: boolean | null;
    ignore_restrictions?: boolean | null;
    include_fees?: boolean | null;
    channel?: number | null;
    markup?: number | null;
    paginate?: {
            page?: number,
            perpage?: number
        };
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

export interface PropertyImportParams {
    name?: TranslatedText;
    internal_name?: string | null;
    headline?: TranslatedText | null;
    short_description?: TranslatedText | null;
    description?: TranslatedText | null;
    house_rules?: TranslatedText | null;
    surroundings?: TranslatedText | null;
    unique_benefits?: TranslatedText | null;
    location?: number;
    property_type?: number | null;
    room_category_type?: "entire_home" | "private_room" | "hotel_room" | "shared_room";
    bathroom_shared?: boolean | null;
    bathroom_shared_with?: Array<"other_guests" | "host" | "family_friends_roommates">;
    currency?: number;
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    max_occupancy?: number;
    comfortable_occupancy?: number;
    registration_number?: string | null;
    registration_number_issue_date?: string | null;
    registration_number_jurisdiction?: string | null;
    address?: string | null;
    postcode?: string | null;
    geo?: Geo | null;
    show_exact_address?: boolean;
    price_type?: "daily_pricing" | "occupancy_based_pricing";
    external_id: string | null;
    marketing_price?: number | null;
    checkin_category?: "doorman_entry" | "lockbox" | "smartlock" | "keypad" | "host_checkin" | "other_checkin";
    interior_size?: string | null;
    exterior_size?: string | null;
    checkin_instructions?: TranslatedText | null;
    checkout_instructions?: TranslatedText | null;
    home_truths?: TranslatedText | null;
    website_visible?: boolean | null;
    amenities?: number[];
    homeowners?: number[] | null;
    discounts?: number[];
    legal_entity?: number;
    related_properties?: number[];
    collections?: number[] | null;
    rental_agreement?: number | null;
    supplier_calendar_url?: string | null;
    policies?: {
            booking_category: "request_to_book" | "instant_booking",
            babies_allowed: boolean,
            children_allowed: boolean,
            pets_allowed: boolean,
            smoking_allowed: boolean,
            parties_allowed: boolean,
            checkin_window: {
                from?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible",
                to?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible"
            },
            checkout_time: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible",
            max_booking_window: number,
            min_prior_notify: "0" | "1" | "2" | "3" | "7",
            min_children_age: number,
            min_adults_age: number,
            adults_age_from: number,
            policy_description?: TranslatedText | null
        };
    rates_settings?: {
            base_occupancy: number,
            default_availability_status: AvailabilityStatus,
            tax_class?: TaxClass,
            payment_schedule: PaymentSchedule,
            min_stay: number,
            max_stay?: number | null,
            changeover_days?: "0" | "1" | "2" | "3",
            security_deposit_auto_authorize?: boolean,
            security_deposit_authorization_days?: number,
            security_deposit_release_days?: number,
            min_nightly_rate?: number,
            extra_guest_rate?: number,
            security_deposit?: number,
            ta_max_commission_percent?: number
        };
    tags?: string[];
    images?: Array<{
            file?: string,
            description?: TranslatedText | null
        }>;
}

export interface PropertyScheduleDeleteParams {
    id: number;
    schedule_delete: boolean;
}

export interface PropertyDeleteParams {
    id: number;
    force?: boolean;
}

export interface PropertyUploadImageParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface PropertyDeleteImageParams {
    id: number;
}

export interface PropertyUpdateImageParams {
    id: number;
    description?: TranslatedText | null;
    tags?: Array<"Activities" | "Animals" | "BBQ facilities" | "Balcony/Terrace" | "Bathroom" | "Beach" | "Bedroom" | "Breakfast" | "Canoeing" | "Children playground" | "City view" | "Cycling" | "Dining area" | "Diving" | "Entertainment" | "Facade/entrance" | "Featured" | "Fitness centre/facilities" | "Floor plan" | "Food and drinks" | "Garden" | "Garden view" | "Golfcourse" | "Hiking" | "Hot Tub" | "Kids's club" | "Kitchen or kitchenette" | "Lake view" | "Landmark view" | "Living room" | "Lobby or reception" | "Lounge or bar" | "Massage" | "Mountain view" | "Nearby landmark" | "Neighbourhood" | "Parking" | "Patio" | "Pool view" | "Property building" | "Restaurant/places to eat" | "River view" | "Sauna" | "Sea view" | "Shower" | "Skiing" | "Snorkeling" | "Spa and wellness centre/facilities" | "Sports" | "Street view" | "Swimming pool" | "Table tennis" | "Tennis court" | "Toilet" | "Windsurfing">;
}

export interface PropertyOrderImagesParams {
    id: number;
    order: number[];
}

export interface PropertySetAvailabilityParams {
    property: number;
    daterange: DateRange;
    availability_status: string;
    notes?: string | null;
    external_id?: string;
    property_ical?: number | null;
    source?: string | null;
}

export interface PropertySetRatesAvailabilityParams {
    property: number;
    daterange: DateRange;
    rate?: number | null;
    min_stay?: number | null;
    checkin_restricted?: boolean | null;
    checkout_restricted?: boolean | null;
    availability_status?: string | null;
    advanced?: {
            monday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            },
            tuesday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            },
            wednesday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            },
            thursday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            },
            friday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            },
            saturday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            },
            sunday?: {
                rate?: number | null,
                min_stay?: number | null,
                checkin_restricted?: boolean | null,
                checkout_restricted?: boolean | null
            }
        };
}

export interface PropertyDeleteAvailabilityParams {
    booking?: number;
    id?: number;
}

export interface PropertyRefreshAvailabilityParams {
    property: number;
}

export interface PropertySyncBlockedAvailabilityParams {
    property: number;
    availability_status: string;
    blocks?: Array<{
            daterange?: DateRange,
            notes?: string
        }>;
    source?: string;
    property_ical?: number;
}

export interface PropertyGetRatesAvailabilityParams {
    property: number;
    daterange: DateRange;
    channel?: number | null;
    markup?: number;
    fill_default_values?: boolean;
}

export interface PropertyGetLosRatesParams {
    property: number;
    daterange: DateRange;
    channel?: number | null;
    markup?: number | null;
    last_updated_since?: string | null;
    nights?: number | null;
    taxes_calculation_mode?: "none" | "included" | "excluded";
    include_fees?: "none" | "display_in_rent" | "all";
    full_occupancy?: boolean;
    adaptive_number_of_nights?: boolean;
    zero_on_restricted_days?: boolean;
    zero_on_unavailable_days?: boolean;
    currency?: string | null;
}

export interface PropertyGetUnavailabilityParams {
    property: number;
    exclude_booking?: number;
    booked_only?: boolean | null;
    daterange: DateRange;
}

export interface PropertyGetAvailabilityRangesParams {
    property: number;
    daterange: DateRange;
    exclude_booking?: number | null;
}

export interface PropertyRatesWithRangesParams {
    property: number;
    daterange: DateRange;
    channel?: number | null;
    markup?: number | null;
    fill_default_values?: boolean;
    last_updated_since?: string | null;
    include_rent_fees?: boolean | null;
    currency?: string | null;
}

export interface PropertyCopyRatesParams {
    property: number;
    copy_from_date: string;
    apply_from_date: string;
    months: "3" | "6" | "12";
}

export interface PropertySyncRatesLosParams {
    property: number;
    base_occupancy?: number | null;
    default_extra_guest_rate?: number | null;
    ignore_los_discounts_sync?: boolean;
    rates?: Array<{
            daterange: DateRange,
            extra_guest_rate?: number | null,
            base_nightly_rate: number,
            min_stay: number,
            checkin_restricted?: boolean | null,
            checkout_restricted?: boolean | null,
            length_of_stay_discounts: Array<{
                nights: number,
                discount_percent: number
            }>
        }>;
}

export interface PropertyGetOccupancyRatesParams {
    property: number;
    include_past?: boolean;
    markup?: number | null;
    limit?: number;
    currency?: string | null;
}

export interface PropertySetOccupancyRatesParams {
    property: number;
    seasons: Array<{
            id?: number,
            los_template?: LosTemplate,
            name?: string | null,
            daterange?: DateRange,
            notes?: string | null,
            min_stay?: number,
            occupancy_rates?: Array<{
                occupancy: number,
                bedrooms?: number | null,
                rates?: Array<{
                    nights: number,
                    bedrooms?: number | null,
                    rate?: number | null
                }>
            }>
        }>;
}

export interface PropertyUpdatePoliciesParams {
    property: number;
    booking_category?: "request_to_book" | "instant_booking";
    babies_allowed?: boolean;
    children_allowed?: boolean;
    pets_allowed?: boolean;
    smoking_allowed?: boolean;
    parties_allowed?: boolean;
    checkin_window?: {
            from?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible",
            to?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible"
        };
    checkout_time?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible";
    max_booking_window?: number;
    min_prior_notify?: "0" | "1" | "2" | "3" | "7";
    min_children_age?: number;
    min_adults_age?: number;
    adults_age_from?: number;
    policy_description?: TranslatedText | null;
}

export interface PropertyUpdateRatesSettingsParams {
    property: number;
    base_occupancy?: number;
    default_availability_status?: number;
    tax_class?: number | null;
    payment_schedule?: number;
    min_stay?: number;
    max_stay?: number | null;
    changeover_days?: "0" | "1" | "2" | "3";
    security_deposit_auto_authorize?: boolean;
    security_deposit_authorization_days?: number;
    security_deposit_release_days?: number;
    min_nightly_rate?: number;
    extra_guest_rate?: number;
    security_deposit?: number;
    ta_max_commission_percent?: number;
}

export interface PropertyBulkUpdateParams {
    properties: number[];
    location?: number;
    property_type?: number | null;
    show_exact_address?: boolean;
    marketing_price?: number | null;
    checkin_category?: "doorman_entry" | "lockbox" | "smartlock" | "keypad" | "host_checkin" | "other_checkin";
    checkin_instructions?: TranslatedText | null;
    checkout_instructions?: TranslatedText | null;
    website_visible?: boolean | null;
    legal_entity?: number;
    rental_agreement?: number | null;
}

export interface PropertyBulkUpdatePoliciesParams {
    properties: number[];
    booking_category?: "request_to_book" | "instant_booking";
    babies_allowed?: boolean;
    children_allowed?: boolean;
    pets_allowed?: boolean;
    smoking_allowed?: boolean;
    parties_allowed?: boolean;
    checkin_window?: {
            from?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible",
            to?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible"
        };
    checkout_time?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible";
    max_booking_window?: number;
    min_prior_notify?: "0" | "1" | "2" | "3" | "7";
    min_children_age?: number;
    min_adults_age?: number;
    adults_age_from?: number;
    policy_description?: TranslatedText | null;
}

export interface PropertyBulkUpdateRatesSettingsParams {
    properties: number[];
    base_occupancy?: number;
    default_availability_status?: number;
    tax_class?: number | null;
    payment_schedule?: number;
    min_stay?: number;
    max_stay?: number | null;
    changeover_days?: "0" | "1" | "2" | "3";
    security_deposit_auto_authorize?: boolean;
    security_deposit_authorization_days?: number;
    security_deposit_release_days?: number;
    min_nightly_rate?: number;
    extra_guest_rate?: number;
    security_deposit?: number;
    ta_max_commission_percent?: number;
}

export interface PropertyBulkSetRatesAvailabilityParams {
    properties: number[];
    daterange: DateRange;
    rate?: number | null;
    min_stay?: number | null;
    checkin_restricted?: boolean | null;
    checkout_restricted?: boolean | null;
    availability_status?: string | null;
}

export interface PropertyBulkSyncFeesParams {
    properties: number[];
    fees: Array<{
            fee_type: FeeType,
            amount?: number | null,
            percent?: number | null,
            tax_class?: TaxClass
        }>;
    overwrite: boolean;
}

export interface PropertyBulkCopyRatesParams {
    properties: number[];
    copy_from_date: string;
    apply_from_date: string;
    months: "3" | "6" | "12";
}

export interface PropertyUpdateHostRevenueShareParams {
    property: number;
    tax_class?: number | null;
    type: "revenue_share" | "commission";
    service_fee_amount: number;
    host_percent: number;
    apply_on: "accommodation" | "subtotal" | "total";
    apply_with_tax?: boolean | null;
    exclude_ta_commission?: boolean | null;
}

export interface PropertyGetApplicableDiscountsParams {
    id: number;
    daterange?: DateRange;
}

export interface PropertySyncFeesParams {
    property: number;
    fees: Array<{
            fee_type: FeeType,
            amount?: number | null,
            percent?: number | null,
            tax_class?: TaxClass
        }>;
    overwrite?: boolean;
}

export interface PropertySyncTagsParams {
    property: number;
    tags?: string[];
}

export interface PropertyGetQuoteParams {
    property: number;
    booking?: number;
    channel?: number | null;
    public?: boolean;
    force?: boolean;
    daterange: DateRange;
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
    fees?: Array<{
            id?: number | null,
            name?: string | null,
            total?: number
        }>;
    overlap_fees?: boolean;
    commission_amount?: number;
    commission_percent?: number;
    commission_apply_on?: "accommodation" | "subtotal" | "total";
    commission_is_charged_by_ta?: boolean;
    commission_apply_with_tax?: boolean;
    total_accommodation_with_fees?: number;
    total_accommodation?: number;
    currency?: {
            id?: Currency,
            iso_code?: string
        };
    booker?: number | null;
    coupon_code?: string;
    ignore?: Array<"all" | "policies" | "restrictions" | "children_allowed" | "babies_allowed" | "pets_allowed" | "max_occupancy" | "min_prior_notify" | "max_booking_window" | "checkin_restricted" | "checkout_restricted" | "min_stay" | "max_stay" | "availability">;
    booker_data?: {
            id?: Account,
            full_name: string,
            first_name?: string | null,
            last_name?: string | null,
            email: string,
            phone?: string | null
        };
}

export interface PropertyGetHomeownerQuoteParams {
    property: number;
    booking?: number;
    daterange: DateRange;
    booker?: number | null;
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
}

export interface PropertyCreateBookingParams {
    property: number;
    booker_id?: number | null;
    booker?: {
            id?: Account,
            full_name: string,
            first_name?: string | null,
            last_name?: string | null,
            email: string,
            phone?: string | null
        };
    status?: "cancelled" | "confirmed" | "completed" | "expired_hold" | "expired_host_confirmation" | "hold" | "pending_host_confirmation" | "pending_payment" | "rejected_by_host" | "voided_by_customer" | "relocated";
    daterange: DateRange;
    currency?: {
            id?: Currency,
            iso_code?: string
        };
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
    fees?: Array<{
            id?: number | null,
            name?: string | null,
            total?: number
        }>;
    overlap_fees?: boolean;
    total_accommodation_with_fees?: number;
    total_accommodation?: number;
    commission_amount?: number;
    commission_percent?: number;
    commission_apply_on?: "accommodation" | "subtotal" | "total";
    commission_is_charged_by_ta?: boolean;
    commission_apply_with_tax?: boolean;
    card?: {
            name?: string,
            number?: string,
            expiration_month?: number,
            expiration_year?: number,
            cvv?: string | null
        };
    payment_method?: string;
    card_token?: any;
    allow_automated_processing?: boolean;
    guests: Array<{
            id?: Account,
            first_name?: string | null,
            last_name?: string | null,
            full_name?: string | null,
            email?: string | null,
            secondary_email?: string | null,
            phone?: string | null,
            secondary_phone?: string | null,
            company?: string | null,
            vat_id?: string | null,
            address?: string | null,
            country?: Country,
            gender?: "female" | "male",
            birthdate?: string | null,
            birth_year?: number | null,
            notes?: string | null,
            external_id?: string | null,
            source?: string | null
        }>;
    coupon_code?: string;
    ignore?: Array<"all" | "policies" | "restrictions" | "children_allowed" | "babies_allowed" | "pets_allowed" | "max_occupancy" | "min_prior_notify" | "max_booking_window" | "checkin_restricted" | "checkout_restricted" | "min_stay" | "max_stay" | "availability">;
    quote_id?: string | null;
    payment_schedule?: {
            id?: PaymentSchedule,
            steps?: Array<{
                short_description?: string | null,
                type?: "on_reservation" | "before_checkin",
                days?: number | null,
                charge_percent?: number
            }>
        };
    tracking?: {
            utm_source?: string | null,
            utm_content?: string | null,
            utm_medium?: string | null,
            utm_campaign?: string | null,
            gclid?: string | null,
            mclid?: string | null,
            device?: string | null,
            cost_us_cents?: number | null,
            timestamp?: string | null
        };
    force?: boolean;
    skip_host_confirmation?: boolean;
    source_name?: string | null;
    external_id?: string | null;
    channel?: number | null;
    channel_external_id?: string | null;
    sub_channel_name?: string | null;
    sub_channel_external_id?: string | null;
    handles_payment?: boolean;
    hold?: boolean;
    hold_hours?: number;
    pending_expiration_hours?: number;
    guest_message?: string | null;
    notes?: string | null;
    point_of_conversion?: string | null;
    security_deposit_amount?: number;
    booking_category?: "request_to_book" | "instant_booking";
    metadata?: any;
    selected_payment_method?: number | null;
    thread?: {
            provider?: string,
            thread_external_id?: string
        };
    convert_inquiry?: number | null;
}

export interface PropertyCreateHomeownerBookingParams {
    property: number;
    booker?: number | null;
    daterange: DateRange;
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
    quote_id: string | null;
    guests: Array<{
            id?: Account,
            first_name?: string | null,
            last_name?: string | null,
            full_name?: string | null,
            email?: string | null,
            secondary_email?: string | null,
            phone?: string | null,
            secondary_phone?: string | null,
            company?: string | null,
            vat_id?: string | null,
            address?: string | null,
            country?: Country,
            gender?: "female" | "male",
            birthdate?: string | null,
            birth_year?: number | null,
            notes?: string | null,
            external_id?: string | null,
            source?: string | null
        }>;
    notes?: string | null;
    convert_inquiry?: number | null;
}

export interface PropertyUploadFloorImageParams {
    id: number;
    description?: TranslatedText | null;
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface PropertyDeleteFloorImageParams {
    id: number;
}

export interface PropertyUpdateFloorImageParams {
    id: number;
    description?: TranslatedText | null;
    tags?: Array<"Activities" | "Animals" | "BBQ facilities" | "Balcony/Terrace" | "Bathroom" | "Beach" | "Bedroom" | "Breakfast" | "Canoeing" | "Children playground" | "City view" | "Cycling" | "Dining area" | "Diving" | "Entertainment" | "Facade/entrance" | "Featured" | "Fitness centre/facilities" | "Floor plan" | "Food and drinks" | "Garden" | "Garden view" | "Golfcourse" | "Hiking" | "Hot Tub" | "Kids's club" | "Kitchen or kitchenette" | "Lake view" | "Landmark view" | "Living room" | "Lobby or reception" | "Lounge or bar" | "Massage" | "Mountain view" | "Nearby landmark" | "Neighbourhood" | "Parking" | "Patio" | "Pool view" | "Property building" | "Restaurant/places to eat" | "River view" | "Sauna" | "Sea view" | "Shower" | "Skiing" | "Snorkeling" | "Spa and wellness centre/facilities" | "Sports" | "Street view" | "Swimming pool" | "Table tennis" | "Tennis court" | "Toilet" | "Windsurfing">;
}

export interface PropertyOrderFloorImagesParams {
    id: number;
    order: number[];
}

export interface PropertyChannelErrorsParams {
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

export interface PropertyCreateVideoParams {
    id: number;
}

export interface PropertySetCustomFieldsParams {
    id: number;
    custom_fields: any;
}
