import { TokenProvider } from './token-provider';

export interface UserConfig {
    /**
     * The base url for the One Mineral api.
     */
    baseURL: string;

    /**
     * Optional token provider that should be set if the sdk
     * is used to communicate server to server. Tokens retrieved
     * from the provider will be set in the `Authorization` header
     * as a bearer token.
     *
     * If no token provider is set the sdk will assume cookie auth
     * is used and all the requests with be sent with `credentials: true`
     */
    tokenProvider?: TokenProvider;
}
