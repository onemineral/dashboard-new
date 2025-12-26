import { Currency } from "./currency";
import { Language } from "./language";
import { Image } from "./image";
import { TenantSettings } from "./tenant-settings";
import { TenantPolicy } from "./tenant-policy";
import { TenantBilling } from "./tenant-billing";
import { OnlineCheckinConfig } from "./online-checkin-config";
import { User } from "./user";
import { ApiClient } from "../api-client";
import { Geo, TranslatedText, NodeFileUpload } from "./shared";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Tenant {
    id: number;
    name: string;
    subdomain?: string;
    default_currency: Currency;
    default_language: Language;
    logo_light?: Image;
    logo_dark?: Image;
    settings?: TenantSettings;
    policies: TenantPolicy;
    public_multicalendar_url?: string;
    subscription_plan: string;
    billing?: TenantBilling;
    online_checkin_config?: OnlineCheckinConfig;
    payment_method_attached?: boolean;
    pm_type?: string;
    pm_last_four?: string;
    pm_expire_month?: string;
    pm_expire_year?: string;
    users?: User[];
    feature_flags?: any;
    chat_support_flag: boolean;
    created_at: string;
    updated_at: string;
}

export class TenantClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'tenant';

    public async updateSettings(params?: TenantUpdateSettingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-settings`,{params,options});
    }

    public async updatePolicies(params?: TenantUpdatePoliciesParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-policies`,{params,options});
    }

    public async update(params?: TenantUpdateParams, options?: RequestOptions): Promise<Response<Tenant>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async uploadLogoDark(params: TenantUploadLogoDarkParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-logo-dark`,{params,options: {...options, fileUpload: true}});
    }

    public async uploadLogoLight(params: TenantUploadLogoLightParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-logo-light`,{params,options: {...options, fileUpload: true}});
    }

    public async fetch(params: TenantFetchParams, options?: RequestOptions): Promise<Response<Tenant>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: TenantQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Tenant>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async current(params?: TenantCurrentParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/current`,{params,options});
    }

    public async create(params: TenantCreateParams, options?: RequestOptions): Promise<Response<Tenant>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async updateBilling(params: TenantUpdateBillingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-billing`,{params,options});
    }

    public async me(params?: TenantMeParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/me`,{params,options});
    }
}

export interface TenantUpdateSettingsParams {
    credit_card_fee_percent?: number;
    timezone?: "Pacific/Niue" | "Pacific/Pago_Pago" | "Pacific/Honolulu" | "Pacific/Rarotonga" | "Pacific/Tahiti" | "Pacific/Marquesas" | "America/Anchorage" | "Pacific/Gambier" | "America/Los_Angeles" | "America/Tijuana" | "America/Vancouver" | "America/Whitehorse" | "Pacific/Pitcairn" | "America/Dawson_Creek" | "America/Denver" | "America/Edmonton" | "America/Hermosillo" | "America/Mazatlan" | "America/Phoenix" | "America/Belize" | "America/Chicago" | "America/Costa_Rica" | "America/El_Salvador" | "America/Guatemala" | "America/Managua" | "America/Mexico_City" | "America/Regina" | "America/Tegucigalpa" | "America/Winnipeg" | "Pacific/Galapagos" | "America/Bogota" | "America/Cancun" | "America/Cayman" | "America/Guayaquil" | "America/Havana" | "America/Iqaluit" | "America/Jamaica" | "America/Lima" | "America/Nassau" | "America/New_York" | "America/Panama" | "America/Port-au-Prince" | "America/Rio_Branco" | "America/Toronto" | "Pacific/Easter" | "America/Caracas" | "America/Asuncion" | "America/Barbados" | "America/Boa_Vista" | "America/Campo_Grande" | "America/Cuiaba" | "America/Curacao" | "America/Grand_Turk" | "America/Guyana" | "America/Halifax" | "America/La_Paz" | "America/Manaus" | "America/Martinique" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Santo_Domingo" | "America/Thule" | "Atlantic/Bermuda" | "America/St_Johns" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Bahia" | "America/Belem" | "America/Cayenne" | "America/Fortaleza" | "America/Maceio" | "America/Miquelon" | "America/Montevideo" | "America/Paramaribo" | "America/Recife" | "America/Santiago" | "America/Sao_Paulo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Atlantic/Stanley" | "America/Noronha" | "Atlantic/South_Georgia" | "America/Scoresbysund" | "Atlantic/Azores" | "Atlantic/Cape_Verde" | "Africa/Abidjan" | "Africa/Accra" | "Africa/Bissau" | "Africa/Casablanca" | "Africa/El_Aaiun" | "Africa/Monrovia" | "America/Danmarkshavn" | "Atlantic/Canary" | "Atlantic/Faroe" | "Atlantic/Reykjavik" | "Europe/Dublin" | "Europe/Lisbon" | "Europe/London" | "Africa/Algiers" | "Africa/Ceuta" | "Africa/Lagos" | "Africa/Ndjamena" | "Africa/Tunis" | "Africa/Windhoek" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Brussels" | "Europe/Budapest" | "Europe/Copenhagen" | "Europe/Gibraltar" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Monaco" | "Europe/Oslo" | "Europe/Paris" | "Europe/Prague" | "Europe/Rome" | "Europe/Stockholm" | "Europe/Tirane" | "Europe/Vienna" | "Europe/Warsaw" | "Europe/Zurich" | "Africa/Cairo" | "Africa/Johannesburg" | "Africa/Maputo" | "Africa/Tripoli" | "Asia/Amman" | "Asia/Beirut" | "Asia/Damascus" | "Asia/Gaza" | "Asia/Jerusalem" | "Asia/Nicosia" | "Europe/Athens" | "Europe/Bucharest" | "Europe/Chisinau" | "Europe/Helsinki" | "Europe/Istanbul" | "Europe/Kaliningrad" | "Europe/Riga" | "Europe/Sofia" | "Europe/Tallinn" | "Europe/Vilnius" | "Africa/Khartoum" | "Africa/Nairobi" | "Antarctica/Syowa" | "Asia/Baghdad" | "Asia/Qatar" | "Asia/Riyadh" | "Europe/Minsk" | "Europe/Moscow" | "Asia/Tehran" | "Asia/Baku" | "Asia/Dubai" | "Asia/Tbilisi" | "Asia/Yerevan" | "Europe/Samara" | "Indian/Mahe" | "Indian/Mauritius" | "Indian/Reunion" | "Asia/Kabul" | "Antarctica/Mawson" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Dushanbe" | "Asia/Karachi" | "Asia/Tashkent" | "Asia/Yekaterinburg" | "Indian/Kerguelen" | "Indian/Maldives" | "Asia/Colombo" | "Antarctica/Vostok" | "Asia/Almaty" | "Asia/Bishkek" | "Asia/Dhaka" | "Asia/Omsk" | "Asia/Thimphu" | "Indian/Chagos" | "Indian/Cocos" | "Antarctica/Davis" | "Asia/Bangkok" | "Asia/Hovd" | "Asia/Jakarta" | "Asia/Krasnoyarsk" | "Asia/Ho_Chi_Minh" | "Indian/Christmas" | "Antarctica/Casey" | "Asia/Brunei" | "Asia/Hong_Kong" | "Asia/Irkutsk" | "Asia/Kuala_Lumpur" | "Asia/Macau" | "Asia/Makassar" | "Asia/Manila" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Taipei" | "Asia/Ulaanbaatar" | "Australia/Perth" | "Asia/Pyongyang" | "Asia/Dili" | "Asia/Jayapura" | "Asia/Seoul" | "Asia/Tokyo" | "Asia/Yakutsk" | "Pacific/Palau" | "Australia/Adelaide" | "Australia/Darwin" | "Antarctica/DumontDUrville" | "Asia/Magadan" | "Asia/Vladivostok" | "Australia/Brisbane" | "Australia/Hobart" | "Australia/Sydney" | "Pacific/Chuuk" | "Pacific/Guam" | "Pacific/Port_Moresby" | "Pacific/Efate" | "Pacific/Guadalcanal" | "Pacific/Kosrae" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pohnpei" | "Asia/Kamchatka" | "Pacific/Auckland" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Nauru" | "Pacific/Tarawa" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Apia" | "Pacific/Fakaofo" | "Pacific/Tongatapu" | "Pacific/Kiritimati";
    outstanding_amount_auto_charge?: boolean;
    security_deposit_auto_authorize?: boolean;
    security_deposit_authorization_days?: number;
    security_deposit_release_days?: number;
    ical_availability_status?: number;
    default_availability_status?: number;
    default_rental_agreement?: number;
    default_legal_entity?: number;
    languages_spoken?: Array<"ar" | "az" | "bg" | "ca" | "cs" | "da" | "de" | "el" | "en" | "es" | "et" | "fr" | "fi" | "he" | "hi" | "hr" | "hu" | "id" | "is" | "it" | "ja" | "km" | "ko" | "lo" | "lt" | "lv" | "ms" | "nl" | "no" | "pl" | "pt" | "ro" | "ru" | "sk" | "sl" | "sr" | "sv" | "tl" | "th" | "tr" | "uk" | "vi" | "xt" | "zh" | "zh-cn" | "zh-tw">;
    payment_methods?: Array<"visa" | "mastercard" | "american_express" | "diners" | "union_pay_debit" | "union_pay_credit" | "jcb" | "discover" | "cash" | "bank_transfer" | "paypal">;
    payment_page_details?: TranslatedText;
    security_deposit_page_details?: TranslatedText;
}

export interface TenantUpdatePoliciesParams {
    min_stay?: number;
    max_stay?: number | null;
    min_prior_notify?: number;
    min_children_age?: number;
    min_adults_age?: number;
    adults_age_from?: number;
    default_payment_schedule?: number | null;
}

export interface TenantUpdateParams {
    name?: string;
    subdomain?: string;
    default_currency?: number;
    default_language?: number;
    logo_light?: number | null;
    logo_dark?: number | null;
}

export interface TenantUploadLogoDarkParams {
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface TenantUploadLogoLightParams {
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface TenantFetchParams {
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

export interface TenantQueryParams {
    email?: string;
    subdomain?: string;
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

export interface TenantCurrentParams {
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

export interface TenantCreateParams {
    subdomain: string;
    name: string;
    owner_name: string;
    owner_email: string;
    country_iso: string;
    address?: string;
    tax_id?: string;
    phone?: string;
    city?: string;
    postcode?: string;
    legal_name: string;
    business_name?: string | null;
    currency: "EUR" | "RON" | "USD" | "GBP";
    stripe_pm?: string | null;
}

export interface TenantUpdateBillingParams {
    type: "company" | "individual";
    company_name?: string | null;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    address: string;
    postcode: string;
    city: string;
    state?: string | null;
    country: number;
    currency?: "EUR" | "RON" | "USD";
    tax_id?: string | null;
}

export interface TenantMeParams {
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
