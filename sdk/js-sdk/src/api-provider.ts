export interface ApiParams<T extends object, P extends object> {
    params?: T;
    pathParams?: P;
}

export interface ApiProvider {
    request(path: string, params: any): any;
}
