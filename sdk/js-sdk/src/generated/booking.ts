import { Property } from "./property";
import { PartnerAccount } from "./partner-account";
import { Currency } from "./currency";
import { DateRange, NodeFileUpload } from "./shared";
import { Channel } from "./channel";
import { BookingProduct } from "./booking-product";
import { ServiceRequest } from "./service-request";
import { SecurityDeposit } from "./security-deposit";
import { BookingGuest } from "./booking-guest";
import { Account } from "./account";
import { BookingPaymentScheduleStep } from "./booking-payment-schedule-step";
import { BookingTaCommission } from "./booking-ta-commission";
import { BookingHostRevenueShare } from "./booking-host-revenue-share";
import { CreditCard } from "./credit-card";
import { OnlineCheckin } from "./online-checkin";
import { Payment } from "./payment";
import { BookingWebsite } from "./booking-website";
import { PaymentMethod } from "./payment-method";
import { Inquiry } from "./inquiry";
import { Document } from "./document";
import { Discount } from "./discount";
import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { PaginatedResponse, Response } from "../response";
import { Country } from "./country";
import { PaymentSchedule } from "./payment-schedule";

export interface Booking {
    id: number;
    uuid: string;
    property: Property;
    stay_property: Property;
    booker?: PartnerAccount;
    currency: Currency;
    type: "guest" | "homeowner";
    checkin: string;
    checkin_time: string;
    checkout: string;
    checkout_time: string;
    daterange: DateRange;
    length_of_stay?: number;
    booking_window?: number;
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
    status: "cancelled" | "confirmed" | "completed" | "expired_hold" | "expired_host_confirmation" | "hold" | "pending_host_confirmation" | "pending_payment" | "rejected_by_host" | "voided_by_customer" | "relocated";
    security_deposit_status?: "pending" | "failed" | "authorized" | "captured" | "refunded" | "released";
    payment_status?: "unpaid" | "paid" | "partial_paid" | "refunded";
    handles_payment: boolean;
    expiration_hours?: number;
    expires_at?: string;
    point_of_conversion?: string | null;
    next_payment_due_date?: string;
    next_payment_amount?: number;
    source_name?: string | null;
    external_id?: string | null;
    channel?: Channel;
    channel_external_id?: string | null;
    sub_channel_name?: string | null;
    sub_channel_external_id?: string | null;
    checkin_changeover_days?: number;
    checkout_changeover_days?: number;
    reason_for_travel?: "leisure" | "work";
    notes?: string | null;
    concierge_notes?: string | null;
    guest_message?: string | null;
    cancel_reason?: string;
    reject_reason?: string;
    reject_message_to_guest?: string;
    confirmed_at?: string;
    rejected_at?: string;
    cancelled_at?: string;
    last_stay_updated_at?: string;
    online_checkin_completed_at?: string;
    external_online_checkin_completed_at?: string;
    external_online_checkin_completed_by?: string;
    external_pin_code_generated_at?: string;
    external_pin_code_generated_by?: string;
    total?: number;
    total_pretax?: number;
    total_accommodation?: number;
    total_accommodation_pretax?: number;
    total_fees?: number;
    total_fees_pretax?: number;
    total_taxes?: number;
    total_outstanding?: number;
    total_paid?: number;
    total_refunded?: number;
    total_pm_share?: number;
    accommodation_pm_share?: number;
    guest_total?: number;
    products?: BookingProduct[];
    service_requests?: ServiceRequest[];
    payment_link?: string;
    security_deposit_link?: string;
    summary_url?: string;
    security_deposits?: SecurityDeposit[];
    additional_guests?: BookingGuest[];
    main_guest?: Account;
    payment_schedule_steps?: BookingPaymentScheduleStep[];
    ta_commission?: BookingTaCommission;
    host_revenue_share?: BookingHostRevenueShare;
    credit_cards?: CreditCard[];
    online_checkin?: OnlineCheckin;
    payments?: Payment[];
    websites?: BookingWebsite[];
    relocated_to_booking?: Booking;
    relocated_from_booking?: Booking;
    has_valid_cc_attached?: boolean;
    has_automated_cc_processing?: boolean;
    booking_category?: "request_to_book" | "instant_booking";
    protection_enabled: boolean;
    protection_channel?: Channel;
    protection_status?: "protected" | "none";
    protection_status_message?: string | null;
    guest_verification_enabled: boolean;
    guest_verification_channel?: Channel;
    guest_verification_status?: "verified" | "pending" | "processing" | "failed";
    guest_verification_status_message?: string | null;
    selected_payment_method?: PaymentMethod;
    converted_from_inquiry?: Inquiry;
    documents?: Document[];
    coupon?: Discount;
    created_at: string;
    updated_at: string;
    custom_fields?: any;
}

export class BookingClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'booking';

    public async query(params?: BookingQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Booking>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async autocomplete(params?: BookingAutocompleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/autocomplete`,{params,options});
    }

    public async fetch(params: BookingFetchParams, options?: RequestOptions): Promise<Response<Booking>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async update(params: BookingUpdateParams, options?: RequestOptions): Promise<Response<Booking>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async updateStay(params: BookingUpdateStayParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-stay`,{params,options});
    }

    public async updateStayProperty(params: BookingUpdateStayPropertyParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-stay-property`,{params,options});
    }

    public async updateHomeownerStay(params: BookingUpdateHomeownerStayParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-homeowner-stay`,{params,options});
    }

    public async importBooking(params: BookingImportBookingParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import-booking`,{params,options});
    }

    public async importBookings(params: BookingImportBookingsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import-bookings`,{params,options});
    }

    public async importFromFile(params: BookingImportFromFileParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/import-from-file`,{params,options: {...options, fileUpload: true}});
    }

    public async updateTaCommission(params: BookingUpdateTaCommissionParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-ta-commission`,{params,options});
    }

    public async updateHostRevenueShare(params: BookingUpdateHostRevenueShareParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-host-revenue-share`,{params,options});
    }

    public async updatePaymentSchedule(params: BookingUpdatePaymentScheduleParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-payment-schedule`,{params,options});
    }

    public async fetchPayments(params: BookingFetchPaymentsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/fetch-payments`,{params,options});
    }

    public async export(params?: BookingExportParams, options?: RequestOptions): Promise<PaginatedResponse<any>> {
        return this.apiClient.request(`${this.path}/export`,{params,options});
    }

    public async report(params: BookingReportParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/report`,{params,options});
    }

    public async cancel(params: BookingCancelParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/cancel`,{params,options});
    }

    public async confirm(params: BookingConfirmParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/confirm`,{params,options});
    }

    public async complete(params: BookingCompleteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/complete`,{params,options});
    }

    public async expire(params: BookingExpireParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/expire`,{params,options});
    }

    public async hold(params: BookingHoldParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/hold`,{params,options});
    }

    public async pendingHostConfirmation(params: BookingPendingHostConfirmationParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/pending-host-confirmation`,{params,options});
    }

    public async pendingPayment(params: BookingPendingPaymentParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/pending-payment`,{params,options});
    }

    public async reject(params: BookingRejectParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/reject`,{params,options});
    }

    public async void(params: BookingVoidParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/void`,{params,options});
    }

    public async syncAvailability(params: BookingSyncAvailabilityParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-availability`,{params,options});
    }

    public async relocate(params: BookingRelocateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/relocate`,{params,options});
    }

    public async syncAdditionalGuests(params: BookingSyncAdditionalGuestsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sync-additional-guests`,{params,options});
    }

    public async getMessagingAccounts(params: BookingGetMessagingAccountsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-messaging-accounts`,{params,options});
    }

    public async setCustomFields(params: BookingSetCustomFieldsParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/set-custom-fields`,{params,options});
    }
}

export interface BookingQueryParams {
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
    public?: boolean;
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

export interface BookingAutocompleteParams {
    q?: string | null;
    limit?: number | null;
}

export interface BookingFetchParams {
    id: number;
    no_auto_relations?: boolean | null;
    public?: boolean;
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

export interface BookingUpdateParams {
    id: number;
    booker?: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    point_of_conversion?: string | null;
    source_name?: string | null;
    external_id?: string | null;
    checkin_changeover_days?: number;
    checkout_changeover_days?: number;
    reason_for_travel?: "leisure" | "work";
    notes?: string | null;
    concierge_notes?: string | null;
    guest_message?: string | null;
    external_online_checkin_completed_at?: string;
    external_pin_code_generated_at?: string;
    main_guest?: number;
    selected_payment_method?: number | null;
    additional_guests?: Array<{
            booking?: Booking,
            first_name?: string | null,
            last_name?: string | null,
            full_name?: string | null,
            email?: string | null,
            phone?: string | null,
            age?: number | null,
            company?: string | null,
            address?: string | null,
            city?: string | null,
            state?: string | null,
            postcode?: string | null,
            country?: Country,
            gender?: "female" | "male",
            birthdate?: string | null,
            citizenship_country?: Country,
            id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit",
            id_number?: string | null,
            id_issue_date?: string | null
        }>;
    guests?: Array<{
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
    channel?: number | null;
    channel_external_id?: string | null;
    metadata?: any;
    thread?: {
            provider?: string,
            thread_external_id?: string
        };
}

export interface BookingUpdateStayParams {
    id: number;
    force?: boolean;
    daterange: DateRange;
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
    total_accommodation_with_fees?: number;
    total_accommodation?: number;
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
    coupon_code?: string;
    ignore?: Array<"all" | "policies" | "restrictions" | "children_allowed" | "babies_allowed" | "pets_allowed" | "max_occupancy" | "min_prior_notify" | "max_booking_window" | "checkin_restricted" | "checkout_restricted" | "min_stay" | "max_stay" | "availability">;
    quote_id?: string | null;
}

export interface BookingUpdateStayPropertyParams {
    booking: number;
    stay_property: number;
}

export interface BookingUpdateHomeownerStayParams {
    id: number;
    daterange: DateRange;
    quote_id: string | null;
    adults: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
}

export interface BookingImportBookingParams {
    property: number;
    shallow?: boolean;
    daterange: DateRange;
    status: "cancelled" | "confirmed" | "completed" | "expired_hold" | "expired_host_confirmation" | "hold" | "pending_host_confirmation" | "pending_payment" | "rejected_by_host" | "voided_by_customer" | "relocated";
    type?: "guest" | "homeowner";
    created_at?: string;
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
    currency?: {
            id?: Currency,
            iso_code?: string
        };
    booker?: number | null;
    booker_data?: {
            id?: Account,
            full_name: string,
            first_name?: string | null,
            last_name?: string | null,
            email: string,
            phone?: string | null
        };
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
    ignore_guest_on_update?: boolean | null;
    coupon_code?: string;
    source_name?: string | null;
    external_id?: string | null;
    channel?: number | null;
    channel_external_id?: string | null;
    handles_payment?: boolean;
    guest_message?: string | null;
    notes?: string | null;
    point_of_conversion?: string | null;
    security_deposit_amount?: number;
    metadata?: any;
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
    payments?: Array<{
            id?: string,
            amount?: number,
            type?: "charge" | "refund",
            status?: "success" | "success_pending" | "failed" | "pending" | "requires_action" | "voided"
        }>;
    convert_inquiry?: number | null;
    thread?: {
            provider?: string,
            thread_external_id?: string
        };
}

export interface BookingImportBookingsParams {
    reservations: Array<{
            property: number,
            shallow: boolean,
            daterange: DateRange,
            status: "cancelled" | "confirmed" | "completed" | "expired_hold" | "expired_host_confirmation" | "hold" | "pending_host_confirmation" | "pending_payment" | "rejected_by_host" | "voided_by_customer" | "relocated",
            type?: "guest" | "homeowner",
            created_at: string,
            adults: number,
            children?: number | null,
            babies?: number | null,
            pets?: boolean | null,
            bedrooms?: number | null,
            fees?: Array<{
                id?: number | null,
                name?: string | null,
                total?: number
            }>,
            overlap_fees?: boolean,
            total_accommodation_with_fees?: number,
            total_accommodation?: number,
            commission_amount?: number,
            commission_percent?: number,
            commission_apply_on?: "accommodation" | "subtotal" | "total",
            commission_is_charged_by_ta?: boolean,
            commission_apply_with_tax?: boolean,
            currency?: {
                id?: Currency,
                iso_code?: string
            },
            booker?: Account,
            booker_data?: {
                id?: Account,
                full_name: string,
                first_name?: string | null,
                last_name?: string | null,
                email: string,
                phone?: string | null
            },
            guests?: Array<{
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
            }>,
            ignore_guest_on_update?: boolean | null,
            coupon_code?: string,
            source_name?: string | null,
            external_id?: string | null,
            channel?: Channel,
            channel_external_id?: string | null,
            handles_payment?: boolean,
            guest_message?: string | null,
            notes?: string | null,
            point_of_conversion?: string | null,
            security_deposit_amount?: number,
            metadata?: any,
            payment_schedule?: {
                id?: PaymentSchedule,
                steps?: Array<{
                    short_description?: string | null,
                    type?: "on_reservation" | "before_checkin",
                    days?: number | null,
                    charge_percent?: number
                }>
            },
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
            },
            card?: {
                name?: string,
                number?: string,
                expiration_month?: number,
                expiration_year?: number,
                cvv?: string | null
            },
            payment_method?: string,
            card_token?: any,
            allow_automated_processing?: boolean,
            payments: Array<{
                id?: string,
                amount?: number,
                type?: "charge" | "refund",
                status?: "success" | "success_pending" | "failed" | "pending" | "requires_action" | "voided"
            }>,
            convert_inquiry?: number | null,
            thread?: {
                provider?: string,
                thread_external_id?: string
            }
        }>;
}

export interface BookingImportFromFileParams {
    file: string | Blob | Buffer | NodeFileUpload;
}

export interface BookingUpdateTaCommissionParams {
    booking: number;
    tax_class?: number | null;
    percent?: number | null;
    apply_on?: "accommodation" | "subtotal" | "total";
    apply_with_tax?: boolean | null;
    total?: number | null;
    is_charged_by_ta?: boolean | null;
}

export interface BookingUpdateHostRevenueShareParams {
    booking: number;
    tax_class?: number | null;
    type?: "revenue_share" | "commission";
    service_fee_amount?: number;
    host_percent?: number | null;
    apply_on?: "accommodation" | "subtotal" | "total";
    apply_with_tax?: boolean | null;
    exclude_ta_commission?: boolean | null;
    total?: number | null;
}

export interface BookingUpdatePaymentScheduleParams {
    booking: number;
    payment_schedule_steps?: Array<{
            short_description?: string | null,
            type?: "on_reservation" | "before_checkin",
            days?: number | null,
            charge_percent?: number
        }>;
}

export interface BookingFetchPaymentsParams {
    booking: number;
}

export interface BookingExportParams {
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
    public?: boolean;
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

export interface BookingReportParams {
    status?: "cancelled" | "confirmed" | "completed" | "expired_hold" | "expired_host_confirmation" | "hold" | "pending_host_confirmation" | "pending_payment" | "rejected_by_host" | "voided_by_customer" | "relocated";
    start_date: string;
    end_date: string;
}

export interface BookingCancelParams {
    id: number;
    force?: boolean;
    reason?: string | null;
}

export interface BookingConfirmParams {
    id: number;
    force?: boolean;
    ignore_availability?: boolean;
}

export interface BookingCompleteParams {
    id: number;
    force?: boolean;
}

export interface BookingExpireParams {
    id: number;
    force?: boolean;
}

export interface BookingHoldParams {
    id: number;
    force?: boolean;
    ignore_availability?: boolean;
}

export interface BookingPendingHostConfirmationParams {
    id: number;
    force?: boolean;
    ignore_availability?: boolean;
}

export interface BookingPendingPaymentParams {
    id: number;
    force?: boolean;
    ignore_availability?: boolean;
}

export interface BookingRejectParams {
    id: number;
    force?: boolean;
    reason: "dates_not_available" | "not_a_good_fit" | "waiting_for_better_reservation" | "not_comfortable";
    message_to_guest: string;
}

export interface BookingVoidParams {
    id: number;
    force?: boolean;
}

export interface BookingSyncAvailabilityParams {
    booking: number;
}

export interface BookingRelocateParams {
    booking: number;
    property: number;
    clone_booking?: boolean;
    booker?: number;
    ignore?: Array<"all" | "policies" | "restrictions" | "children_allowed" | "babies_allowed" | "pets_allowed" | "max_occupancy" | "min_prior_notify" | "max_booking_window" | "checkin_restricted" | "checkout_restricted" | "min_stay" | "max_stay" | "availability">;
    daterange?: DateRange;
    adults?: number;
    children?: number | null;
    babies?: number | null;
    pets?: boolean | null;
    bedrooms?: number | null;
    commission_amount?: number;
    commission_percent?: number;
    commission_apply_on?: "accommodation" | "subtotal" | "total";
    commission_is_charged_by_ta?: boolean;
    commission_apply_with_tax?: boolean;
    total_accommodation_with_fees?: number;
    total_accommodation?: number;
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
    force?: boolean;
}

export interface BookingSyncAdditionalGuestsParams {
    booking: number;
    additional_guests?: Array<{
            booking?: Booking,
            first_name?: string | null,
            last_name?: string | null,
            full_name?: string | null,
            email?: string | null,
            phone?: string | null,
            age?: number | null,
            company?: string | null,
            address?: string | null,
            city?: string | null,
            state?: string | null,
            postcode?: string | null,
            country?: Country,
            gender?: "female" | "male",
            birthdate?: string | null,
            citizenship_country?: Country,
            id_type?: "national_id" | "passport" | "drivers_license" | "residency_permit",
            id_number?: string | null,
            id_issue_date?: string | null
        }>;
}

export interface BookingGetMessagingAccountsParams {
    id: number;
}

export interface BookingSetCustomFieldsParams {
    id: number;
    custom_fields: any;
}
