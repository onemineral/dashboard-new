import { newPmsClient } from '@onemineral/pms-js-sdk';
import {config} from "@/config.ts";

const api = newPmsClient({
    baseURL: config.appUrl + '/rest/',
    onAuthError: () => {
        window.location.assign(
            config.appUrl +
            '/auth/login/admin?redirect_to=' +
            encodeURIComponent(window.location.href),
        );
    },
});

export default api;
