import {Routes, useLocation, Route} from 'react-router-dom';
import {NotFound} from './pages/not-found'
import routes from './routes';
import Layout from './components/application/layout';
import {useState} from 'react';
import {AppContext} from '@/contexts/app-context.tsx'
import {useQuery} from '@tanstack/react-query';
import AppLoader from './components/application/app-loader';
import {UnauthorizedAccess} from './pages/unauthorized-access.tsx';
import {ReactivateSubscription} from './pages/reactivate-subscription.tsx';
import api from './lib/api';
import {Toaster} from './components/ui/sonner';
import Schema from "@/models/Schema.ts";
import {IntlProvider} from "react-intl";
import {useEffect} from 'react';
import {Onboarding} from "@/pages/onboarding";
import {Settings} from "@sdk/generated";
import {ro, es, de, fr, it, nl, pt} from 'date-fns/locale'
import {setDefaultOptions} from "date-fns";

// Use Vite's import.meta.glob for automatic locale loading
const localeModules = import.meta.glob<{ default: Record<string, string> }>('../lang/compiled/*.json');

async function loadLocaleData(locale: string): Promise<Record<string, string>> {
    const modulePath = `../lang/compiled/${locale}.json`;

    if (modulePath in localeModules) {
        try {
            const module = await localeModules[modulePath]();
            return module.default;
        } catch (error) {
            console.error(`Failed to load locale "${locale}":`, error);
        }
    }

    // Fallback to English
    try {
        const fallbackModule = await localeModules['../lang/compiled/en.json']();
        return fallbackModule.default;
    } catch (error) {
        console.error('Failed to load fallback locale (en):', error);
        return {};
    }
}

function App() {
    const [hasAccess, setHasAccess] = useState(false)
    const [askForPayment, setAskForPayment] = useState(false)
    const [mustOnboard, setMustOnboard] = useState(false);
    const [translations, setTranslations] = useState<Record<string, any>>();

    const {isLoading, data} = useQuery<Settings | null>({
        queryKey: ['settings'],
        queryFn: async () => {
            try {
                const settings = (await api.settings.fetch()).response;
                setHasAccess(true);
                setAskForPayment(settings.subscription?.is_active === false);
                setMustOnboard(!settings.onboarding?.done);
                return settings;
            } catch (e: any) {
                console.error(e)
                if (e.statusCode === 404) {
                    setHasAccess(false)
                }
                return null
            }
        },
    });

    const locale: string = data?.ui_locale || 'en';

    // Load locale messages when locale changes
    useEffect(() => {
        if (data) {
            loadLocaleData(locale).then((msgs) => {
                setTranslations(msgs);
                setDefaultOptions({
                    locale: ro,
                })
            });
        }
    }, [data]);

    if (isLoading || !translations) return <AppLoader />;
    if (!hasAccess) return <UnauthorizedAccess />;
    if (askForPayment) return <ReactivateSubscription />;


    return <AppContext.Provider
        value={{
            ...data,
            schema: new Schema(data?.schema)
        } as any}
    >
        <IntlProvider messages={translations} locale={locale} defaultLocale="en">
            {mustOnboard ? <Onboarding/> : <AppRoute/>}
            <StackRoutes/>
            <Toaster
                position={"bottom-center"}
                toastOptions={{
                    unstyled: true,
                    classNames: {
                        error:
                            "bg-red-50 text-red-800 border border-red-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 [&>svg]:text-red-500",
                        success:
                            "bg-green-50 text-green-800 border border-green-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 [&>svg]:text-green-500",
                        warning:
                            "bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 [&>svg]:text-yellow-500",
                        info:
                            "bg-blue-50 text-blue-800 border border-blue-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 [&>svg]:text-blue-500",
                    },
                }}
            />
        </IntlProvider>
    </AppContext.Provider>;
}

const AppRoute = () => {
    let location = useLocation();
    let background = location;

    while (location.state?.background) {
        background = location.state.background;
        location = location.state.background;
    }

    return <>
        <Layout>
            <Routes location={background}>
                <Route path='*' element={<NotFound/>}/>
                {routes.map((route, index) => <Route path={route.path} key={index} element={route.element}/>)}
            </Routes>
        </Layout>
    </>
}

const StackRoutes = () => {
    let location = useLocation();

    const locationStack = [];

    while (location.state?.background) {
        locationStack.push(location);

        location = location.state.background;
    }

    return <>
        {locationStack.reverse().map((location) => <Routes location={location} key={location.key}>
            <Route path='*' element={<NotFound/>}/>
            {routes.map((route, index) => <Route path={route.path} key={index} element={route.element}/>)}
        </Routes>)}
    </>
}

export default App
