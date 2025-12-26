import { AuthErrorHandler } from './user-config';

export interface ApiParams<T extends object, P extends object> {
    params?: T;
    pathParams?: P;
}

export interface ApiClient {
    request(path: string, params?: any): any;
    setOnAuthErrorHandler(fn: AuthErrorHandler): void;
}

const _ = {};
export default _;
