import {createContext, useContext} from 'react';
import Schema from "@/models/Schema.ts";
import {Currency, Language, Profile, Subscription, Tenant} from "@sdk/generated";

export const AppContext = createContext<{
    schema: Schema;
    profile: Profile;
    locales: { [key: string]: {iso: string; native: string; name: string} };
    languages: Language[];
    tenant: Tenant;
    currencies: Currency[];
    onboarding: any;
    redirect_to: string;
    ui_locale: string;
    subscription?: Subscription;
    // @ts-ignore
}>({});

export const useAppContext = () => {
    return useContext(AppContext);
}