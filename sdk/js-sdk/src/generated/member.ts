import { ExperienceManager } from './experience-manager';
import { EstateManager } from './estate-manager';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { Response } from '../response';

export interface Member {
    salesforce_id: string;
    first_name: string;
    last_name: string;
    alias: string;
    email: string;
    preferred_name: string;
    preffered_name: string;
    host_dashboard_kpi_1: string;
    host_dashboard_kpi_2: string;
    usd_balance: string;
    g_balance: string;
    accessibility_requirements: string;
    profile_photo: string;
    drinks_notes: string;
    transportation_sea: string;
    dietary_restrictions: string;
    accommodation_temperature: string;
    drinks_likes: string;
    drinks_dislikes: string;
    wish_list: string;
    entertainment_arts: string;
    food_notes: string;
    accommodation_ambiance: string;
    entertainment_other: string;
    interests_tags: string;
    food_likes: string;
    spa_preferences: string;
    health_fitness_notes: string;
    food_dislikes: string;
    transportation_air: string;
    transportation_land: string;
    salutation: string;
    accessibility_notes: string;
    entertainment_cinema: string;
    entertainment_music: string;
    accommodation_style: string;
    accommodation_features: string;
    parent_account_id: string;
    impersonated_account_id: string;
    original_profile_id: string;
    wallet_id: string;
    role: string;
    dates: Array<{
        date: string;
        description: string;
    }>;
    events: Array<{
        name: string;
        description: string;
    }>;
    recipes: Array<{
        link: string;
        description: string;
    }>;
    experience_manager: ExperienceManager;
    estates_manager: EstateManager;
}

export class MemberClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'member';

    public async fetch(params?: MemberFetchParams, options?: RequestOptions): Promise<Response<Member>> {
        return this.apiClient.request(`${this.path}/fetch`, {
            params,
            options,
        });
    }

    public async wallet(params: MemberWalletParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/wallet`, {
            params,
            options,
        });
    }

    public async update(params: MemberUpdateParams, options?: RequestOptions): Promise<Response<Member>> {
        return this.apiClient.request(`${this.path}/update`, {
            params,
            options,
        });
    }

    public async uploadProfilePhoto(params: MemberUploadProfilePhotoParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/upload-profile-photo`, {
            params,
            options,
        });
    }

    public async invite(params: MemberInviteParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/invite`, {
            params,
            options,
        });
    }

    public async sfUpdate(params: MemberSfUpdateParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/sf-update`, {
            params,
            options,
        });
    }

    public async downloadReceipt(params: MemberDownloadReceiptParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/download-receipt`, {
            params,
            options,
        });
    }
}

export interface MemberFetchParams {
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

export interface MemberWalletParams {
    wallet_id: string;
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

export interface MemberUpdateParams {
    preferred_name: string;
    alias: string;
    bio?: string;
}

export interface MemberUploadProfilePhotoParams {
    file_name: string;
    content_type: string;
    data: string;
}

export interface MemberInviteParams {
    sf_id: string;
}

export interface MemberSfUpdateParams {
    sf_ids: string[];
}

export interface MemberDownloadReceiptParams {
    receipt: string;
}
