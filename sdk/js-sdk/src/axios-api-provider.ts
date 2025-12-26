import { ApiClient } from './api-client';
import { TokenProvider } from './token-provider';
import { AuthErrorHandler, UserConfig } from './user-config';
import { OMAuthenticationError, OMError } from './error';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { PaginatedResponse, Response } from './response';
import { RequestOptions } from './request-options';
import { multipartDataGenerator } from './multipart';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export class AxiosApiProvider implements ApiClient {
    private readonly axiosClient: AxiosInstance;
    private readonly tokenProvider?: TokenProvider;
    private onAuthError?: AuthErrorHandler;

    public constructor(config: UserConfig) {
        this.tokenProvider = config.tokenProvider;
        this.onAuthError = config.onAuthError;

        const { baseURL, defaultHeaders = {} } = config;
        this.axiosClient = axios.create({
            baseURL,
            headers: { ...DEFAULT_HEADERS, ...defaultHeaders },
            withCredentials: !this.tokenProvider,
        });
    }

    public async request(path: string, config: { params?: any; options?: RequestOptions }): Promise<any> {
        const { params, options } = config;
        return this.makeRequest(path, params, options);
    }

    public setOnAuthErrorHandler(fn: AuthErrorHandler) {
        this.onAuthError = fn;
    }

    private async makeRequest(path: string, params: any, options?: RequestOptions): Promise<Response<any> | PaginatedResponse<any>> {
        const requestConfig: AxiosRequestConfig = {
            headers: {},
        };

        if (options?.headers && Object.keys(options.headers).length > 0) {
            requestConfig.headers = options.headers;
        }

        if (options?.onUploadProgress !== undefined) {
            requestConfig.onUploadProgress = options.onUploadProgress;
        }

        if (!('Authorization' in requestConfig.headers!)) {
            // If a token provider was not set in the configuration we will
            // try to make the request with `credentials: true` in case the
            // authorization is provided by a cookie.
            if (this.tokenProvider) {
                const token = this.tokenProvider.get();
                if (!token) {
                    throw new OMAuthenticationError({
                        statusCode: 401,
                        message: 'No authentication token exists',
                    });
                }

                // Add token in the `Authorization` header as a bearer token
                requestConfig.headers!['Authorization'] = `Bearer ${token}`;
            }
        }

        requestConfig.method = 'post';
        requestConfig.url = path;

        if (!options?.fileUpload) {
            requestConfig.data = params;
        } else {
            requestConfig.data = multipartDataGenerator(params, requestConfig.headers);
        }

        try {
            const rawResponse = await this.axiosClient.request(requestConfig);

            return {
                headers: rawResponse.headers,
                lastResponse: {
                    statusCode: rawResponse.status,
                },
                response: rawResponse.data,
            };
        } catch (e) {
            const err = e as AxiosError;

            if (err.response?.status === 401 && this.onAuthError) {
                const authError = new OMAuthenticationError({
                    ...err,
                    statusCode: err.response.status,
                    headers: err.response.headers,
                });

                this.onAuthError(authError);

                throw authError;
            }

            throw new OMError({
                ...err,
                statusCode: err.response?.status,
                headers: err.response?.headers,
            });
        }
    }
}
