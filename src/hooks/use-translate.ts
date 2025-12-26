import {useContext} from "react";
import {AppContext} from "@/contexts/app-context.tsx";

export function useTranslate() {
    const {tenant} = useContext(AppContext);

    return (text: any, locale?: string) => {
        if (!text) {
            return null;
        }

        if (typeof text === 'string') {
            return text;
        }

        if (locale && text[locale]) {
            return text[locale];
        }

        if(tenant.default_language?.locale && text[tenant.default_language.locale]) {
            return text[tenant.default_language.locale];
        }

        if(text.en) {
            return text.en;
        }

        const values = Object.values(text);
        for(let i = 0; i < values.length; i++) {
            if(values[i]) {
                return values[i];
            }
        }
    }
}