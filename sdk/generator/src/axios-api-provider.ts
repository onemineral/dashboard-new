import { ApiClient } from './api-client';
import { TokenProvider } from './token-provider';
import { UserConfig } from './user-config';
import { OMAuthenticationError } from './error';
import axios, { AxiosInstance } from 'axios';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export class AxiosApiProvider implements ApiClient {
    private readonly axiosClient: AxiosInstance;
    private readonly tokenProvider?: TokenProvider;

    public constructor(config: UserConfig) {
        this.tokenProvider = config.tokenProvider;

        const { baseURL } = config;
        this.axiosClient = axios.create({
            baseURL,
            headers: DEFAULT_HEADERS,
        });
    }

    public async request(path: string, params: any): Promise<any> {
        return this.makeRequest(path, params);
    }

    private async makeRequest(path: string, params: any): Promise<any> {
        // If token provider exists try to get the token.
        // If token is null or undefined throw an unauthenticated error
        if (this.tokenProvider) {
            const token = this.tokenProvider.get();
            if (!token) {
                throw new OMAuthenticationError({
                    statusCode: 401,
                    message: 'No token provided',
                });
            }
        }

        // Add token in the `Authorization` header as a bearer token

        // If a token provider was not set in the configuration we will
        // try to make the request with `credentials: true` in case the
        // authorization is provided by a cookie.
        const rawResponse = await this.axiosClient.request({
            method: 'post',
            withCredentials: true,
            url: path,
            data: params,
        });

        if ('current_page' in rawResponse.data) {
            return {
                headers: rawResponse.headers,
                lastResponse: {
                    statusCode: rawResponse.status,
                },
                data: rawResponse.data.data,
            };
        }

        return {
            headers: rawResponse.headers,
            lastResponse: {
                statusCode: rawResponse.status,
            },
            ...rawResponse.data,
        };
    }
}
