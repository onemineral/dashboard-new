export type Response<T> = T & {
    headers: { [key: string]: string };
    lastResponse: {
        statusCode: number;
    };
};

export type PaginatedResponse<T> = {
    headers: { [key: string]: string };
    lastResponse: {
        statusCode: number;
    };
    data: T[];
};
