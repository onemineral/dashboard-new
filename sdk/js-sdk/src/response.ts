import { AxiosHeaderValue } from 'axios';

export type Response<T> = {
    headers: { [key: string]: AxiosHeaderValue | undefined };
    lastResponse: {
        statusCode: number;
    };
    response: T;
};

export type PaginatedResponse<T> = {
    headers: { [key: string]: AxiosHeaderValue | undefined };
    lastResponse: {
        statusCode: number;
    };
    response: {
        data: T[];
        current_page: number;
        last_page: number;
        per_page: number;
        from: number;
        to: number;
        total: number;
    };
};
