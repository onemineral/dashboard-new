import { AxiosApiProvider } from './axios-api-provider';
import { AuthErrorHandler, UserConfig, TokenProvider } from './user-config';
import { init } from './generated';

export * from './generated';
export * from './response';
export * from './error';
export type { AuthErrorHandler, UserConfig, TokenProvider };

export function newPmsClient(config: UserConfig) {
    const apiClient = new AxiosApiProvider(config);
    const initialized = init(apiClient);

    return {
        ...initialized,
        setOnAuthErrorHandler(fn: AuthErrorHandler) {
            config.onAuthError = fn;
            apiClient.setOnAuthErrorHandler(fn);
        },
    };
}
