import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response, PaginatedResponse } from "../response";

export interface Workflow {
    id: number;
    name: string;
    api_id: string;
    description: string;
    enabled: boolean;
    resource_type: "booking" | "inquiry" | "property";
    resource_field: string;
    resource_field_description: string;
    delay_type: "after" | "before";
    delay_value: number;
    delay_unit: "minutes" | "hours" | "days";
    use_default_timezone: boolean;
    time?: string | null;
    force_schedule: boolean;
    repeat_on_updates: boolean;
    action: string;
    action_description: string;
    parameters: any;
    where: any;
    created_at: string;
    updated_at: string;
}

export class WorkflowClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'workflow';

    public async create(params: WorkflowCreateParams, options?: RequestOptions): Promise<Response<Workflow>> {
        return this.apiClient.request(`${this.path}/create`,{params,options});
    }

    public async update(params: WorkflowUpdateParams, options?: RequestOptions): Promise<Response<Workflow>> {
        return this.apiClient.request(`${this.path}/update`,{params,options});
    }

    public async del(params: WorkflowDeleteParams, options?: RequestOptions): Promise<Response<Workflow>> {
        return this.apiClient.request(`${this.path}/delete`,{params,options});
    }

    public async fetch(params: WorkflowFetchParams, options?: RequestOptions): Promise<Response<Workflow>> {
        return this.apiClient.request(`${this.path}/fetch`,{params,options});
    }

    public async query(params?: WorkflowQueryParams, options?: RequestOptions): Promise<PaginatedResponse<Workflow>> {
        return this.apiClient.request(`${this.path}/query`,{params,options});
    }

    public async availableWorkflows(options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/available-workflows`,{options});
    }

    public async updateStatus(params: WorkflowUpdateStatusParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/update-status`,{params,options});
    }
}

export interface WorkflowCreateParams {
    name: string;
    description?: string;
    resource_type: "booking" | "inquiry" | "property";
    resource_field: string;
    delay_type: "after" | "before";
    delay_value: number;
    delay_unit: "minutes" | "hours" | "days";
    use_default_timezone?: boolean;
    time?: string | null;
    force_schedule?: boolean;
    repeat_on_updates?: boolean;
    action: string;
    parameters?: any;
    where?: {
            conditions?: any,
            conditions_logic?: string | null,
            aggregate_conditions?: any,
            aggregate_conditions_logic?: string | null
        };
}

export interface WorkflowUpdateParams {
    id: number;
    name: string;
    description?: string;
    resource_type: "booking" | "inquiry" | "property";
    resource_field: string;
    delay_type: "after" | "before";
    delay_value: number;
    delay_unit: "minutes" | "hours" | "days";
    use_default_timezone?: boolean;
    time?: string | null;
    force_schedule?: boolean;
    repeat_on_updates?: boolean;
    action: string;
    parameters?: any;
    where?: {
            conditions?: any,
            conditions_logic?: string | null,
            aggregate_conditions?: any,
            aggregate_conditions_logic?: string | null
        };
}

export interface WorkflowDeleteParams {
    id: number;
}

export interface WorkflowFetchParams {
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

export interface WorkflowQueryParams {
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

export interface WorkflowUpdateStatusParams {
    id: number;
    enabled: boolean;
}
