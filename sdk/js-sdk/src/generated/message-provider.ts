import { ApiClient } from "../api-client";
import { RequestOptions } from "../request-options";
import { Response } from "../response";

export interface MessageProvider {
    id: string;
    icon_url: string;
    name: string;
    abilities: any;
}

export class MessageProviderClient {
    public constructor(private readonly apiClient: ApiClient) {
    }

    private path: string = 'message-provider';

    public async getByAccount(params: MessageProviderGetByAccountParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-by-account`,{params,options});
    }

    public async getByThread(params: MessageProviderGetByThreadParams, options?: RequestOptions): Promise<Response<any>> {
        return this.apiClient.request(`${this.path}/get-by-thread`,{params,options});
    }
}

export interface MessageProviderGetByAccountParams {
    account: number;
}

export interface MessageProviderGetByThreadParams {
    thread: number;
}
