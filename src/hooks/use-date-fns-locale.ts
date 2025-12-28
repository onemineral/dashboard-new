import {ro, es, de, fr, it, nl, pt, enUS} from 'date-fns/locale'
import {useAppContext} from "@/contexts/app-context.tsx";
export const dateLocales = {
    ro, es, de, fr, it, nl, pt, en: enUS
}

export function useDateFnsLocale() {
    const {ui_locale} = useAppContext();

    // @ts-ignore
    return ui_locale in dateLocales ? dateLocales[ui_locale] : enUS;
}