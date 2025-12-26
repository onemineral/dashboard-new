import { Workflow } from "./workflow";
import { Booking } from "./booking";
import { Inquiry } from "./inquiry";
import { Geo } from "./shared";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";

export interface WorkflowSchedule {
    id: number;
    workflow: Workflow;
    resource: {
            type: 'booking' | 'inquiry',
            record: Booking | Inquiry
        };
    resource_type: "booking" | "inquiry" | "property";
    enabled: boolean;
    execute_at: string;
    timezone: "Pacific/Niue" | "Pacific/Pago_Pago" | "Pacific/Honolulu" | "Pacific/Rarotonga" | "Pacific/Tahiti" | "Pacific/Marquesas" | "America/Anchorage" | "Pacific/Gambier" | "America/Los_Angeles" | "America/Tijuana" | "America/Vancouver" | "America/Whitehorse" | "Pacific/Pitcairn" | "America/Dawson_Creek" | "America/Denver" | "America/Edmonton" | "America/Hermosillo" | "America/Mazatlan" | "America/Phoenix" | "America/Belize" | "America/Chicago" | "America/Costa_Rica" | "America/El_Salvador" | "America/Guatemala" | "America/Managua" | "America/Mexico_City" | "America/Regina" | "America/Tegucigalpa" | "America/Winnipeg" | "Pacific/Galapagos" | "America/Bogota" | "America/Cancun" | "America/Cayman" | "America/Guayaquil" | "America/Havana" | "America/Iqaluit" | "America/Jamaica" | "America/Lima" | "America/Nassau" | "America/New_York" | "America/Panama" | "America/Port-au-Prince" | "America/Rio_Branco" | "America/Toronto" | "Pacific/Easter" | "America/Caracas" | "America/Asuncion" | "America/Barbados" | "America/Boa_Vista" | "America/Campo_Grande" | "America/Cuiaba" | "America/Curacao" | "America/Grand_Turk" | "America/Guyana" | "America/Halifax" | "America/La_Paz" | "America/Manaus" | "America/Martinique" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Santo_Domingo" | "America/Thule" | "Atlantic/Bermuda" | "America/St_Johns" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Bahia" | "America/Belem" | "America/Cayenne" | "America/Fortaleza" | "America/Maceio" | "America/Miquelon" | "America/Montevideo" | "America/Paramaribo" | "America/Recife" | "America/Santiago" | "America/Sao_Paulo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Atlantic/Stanley" | "America/Noronha" | "Atlantic/South_Georgia" | "America/Scoresbysund" | "Atlantic/Azores" | "Atlantic/Cape_Verde" | "Africa/Abidjan" | "Africa/Accra" | "Africa/Bissau" | "Africa/Casablanca" | "Africa/El_Aaiun" | "Africa/Monrovia" | "America/Danmarkshavn" | "Atlantic/Canary" | "Atlantic/Faroe" | "Atlantic/Reykjavik" | "Europe/Dublin" | "Europe/Lisbon" | "Europe/London" | "Africa/Algiers" | "Africa/Ceuta" | "Africa/Lagos" | "Africa/Ndjamena" | "Africa/Tunis" | "Africa/Windhoek" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Brussels" | "Europe/Budapest" | "Europe/Copenhagen" | "Europe/Gibraltar" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Monaco" | "Europe/Oslo" | "Europe/Paris" | "Europe/Prague" | "Europe/Rome" | "Europe/Stockholm" | "Europe/Tirane" | "Europe/Vienna" | "Europe/Warsaw" | "Europe/Zurich" | "Africa/Cairo" | "Africa/Johannesburg" | "Africa/Maputo" | "Africa/Tripoli" | "Asia/Amman" | "Asia/Beirut" | "Asia/Damascus" | "Asia/Gaza" | "Asia/Jerusalem" | "Asia/Nicosia" | "Europe/Athens" | "Europe/Bucharest" | "Europe/Chisinau" | "Europe/Helsinki" | "Europe/Istanbul" | "Europe/Kaliningrad" | "Europe/Riga" | "Europe/Sofia" | "Europe/Tallinn" | "Europe/Vilnius" | "Africa/Khartoum" | "Africa/Nairobi" | "Antarctica/Syowa" | "Asia/Baghdad" | "Asia/Qatar" | "Asia/Riyadh" | "Europe/Minsk" | "Europe/Moscow" | "Asia/Tehran" | "Asia/Baku" | "Asia/Dubai" | "Asia/Tbilisi" | "Asia/Yerevan" | "Europe/Samara" | "Indian/Mahe" | "Indian/Mauritius" | "Indian/Reunion" | "Asia/Kabul" | "Antarctica/Mawson" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Dushanbe" | "Asia/Karachi" | "Asia/Tashkent" | "Asia/Yekaterinburg" | "Indian/Kerguelen" | "Indian/Maldives" | "Asia/Colombo" | "Antarctica/Vostok" | "Asia/Almaty" | "Asia/Bishkek" | "Asia/Dhaka" | "Asia/Omsk" | "Asia/Thimphu" | "Indian/Chagos" | "Indian/Cocos" | "Antarctica/Davis" | "Asia/Bangkok" | "Asia/Hovd" | "Asia/Jakarta" | "Asia/Krasnoyarsk" | "Asia/Ho_Chi_Minh" | "Indian/Christmas" | "Antarctica/Casey" | "Asia/Brunei" | "Asia/Hong_Kong" | "Asia/Irkutsk" | "Asia/Kuala_Lumpur" | "Asia/Macau" | "Asia/Makassar" | "Asia/Manila" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Taipei" | "Asia/Ulaanbaatar" | "Australia/Perth" | "Asia/Pyongyang" | "Asia/Dili" | "Asia/Jayapura" | "Asia/Seoul" | "Asia/Tokyo" | "Asia/Yakutsk" | "Pacific/Palau" | "Australia/Adelaide" | "Australia/Darwin" | "Antarctica/DumontDUrville" | "Asia/Magadan" | "Asia/Vladivostok" | "Australia/Brisbane" | "Australia/Hobart" | "Australia/Sydney" | "Pacific/Chuuk" | "Pacific/Guam" | "Pacific/Port_Moresby" | "Pacific/Efate" | "Pacific/Guadalcanal" | "Pacific/Kosrae" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pohnpei" | "Asia/Kamchatka" | "Pacific/Auckland" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Nauru" | "Pacific/Tarawa" | "Pacific/Wake" | "Pacific/Wallis" | "Pacific/Apia" | "Pacific/Fakaofo" | "Pacific/Tongatapu" | "Pacific/Kiritimati";
    should_run: boolean;
    run_status: "pending" | "running" | "finished" | "failed" | "skipped";
    run_id: string;
    error: string;
    conditions_passed: boolean;
    force_run: boolean;
    created_at: string;
    updated_at: string;
}

export class WorkflowScheduleClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'workflow-schedule';

    public async query(params: WorkflowScheduleQueryParams, options?: RequestOptions): Promise<PaginatedResponse<WorkflowSchedule>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async fetch(params: WorkflowScheduleFetchParams, options?: RequestOptions): Promise<Response<WorkflowSchedule>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async enable(params: WorkflowScheduleEnableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/enable`,{params,options});
    }

    public async disable(params: WorkflowScheduleDisableParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/disable`,{params,options});
    }

    public async forceRun(params: WorkflowScheduleForceRunParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/force-run`,{params,options});
    }

    public async retry(params: WorkflowScheduleRetryParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/retry`,{params,options});
    }
}

export interface WorkflowScheduleQueryParams {
    resource: {
            type: 'booking' | 'inquiry',
            record: Booking | Inquiry
        };
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

export interface WorkflowScheduleFetchParams {
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

export interface WorkflowScheduleEnableParams {
    id: number;
}

export interface WorkflowScheduleDisableParams {
    id: number;
}

export interface WorkflowScheduleForceRunParams {
    id: number;
}

export interface WorkflowScheduleRetryParams {
    id: number;
}
