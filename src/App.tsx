import { Routes, useLocation, Route } from 'react-router-dom'
import { NotFound } from './pages/not-found'
import routes from './routes';
import Layout from './components/application/layout';
import { useState } from 'react';
import { AppContext } from '@/contexts/app-context.tsx'
import { useQuery } from '@tanstack/react-query';
import AppLoader from './components/application/app-loader';
import { UnauthorizedAccess } from './components/application/unauthorized-access';
import { ReactivateSubscription } from './components/application/reactivate-subscription';
import api from './lib/api';
import { Toaster } from './components/ui/sonner';
import Schema from "@/models/Schema.ts";
import {Settings} from "@onemineral/pms-js-sdk";

function App() {
  const [hasAccess, setHasAccess] = useState(false)
  const [askForPayment, setAskForPayment] = useState(false)

  const { isLoading, data } = useQuery<Settings|null>({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const settings = (await api.settings.fetch()).response
        setHasAccess(true)
        setAskForPayment(settings.subscription?.is_active === false)
        return settings
      } catch (e: any) {
        console.error(e)
        if (e.statusCode === 404) {
          setHasAccess(false)
        }
        return null
      }
    },
  })

  if (isLoading) return <AppLoader />;
  if (!hasAccess) return <UnauthorizedAccess />;
  if (askForPayment) return <ReactivateSubscription />;

  return <AppContext.Provider
      value={{
        ...data,
        schema: new Schema(data?.schema)
      } as any}
    >
      <AppRoutes />
      <Toaster
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
    </AppContext.Provider>;
}

const AppRoutes = () => {
  let location = useLocation();
  let background = location;

  const locationStack = [];

  while (location.state?.background) {
    background = location.state.background;
    locationStack.push(location);

    location = location.state.background;
  }

  return <>
      <Layout>
        <Routes location={background}>
          <Route path='*' element={<NotFound/>}/>
          {routes.map((route, index) => <Route path={route.path} key={index} element={route.element} />)}
        </Routes>
      </Layout>
      {locationStack.reverse().map((location) => <Routes location={location} key={location.key}>
          <Route path='*' element={<NotFound/>}/>
          {routes.map((route, index) => <Route path={route.path} key={index} element={route.element} />)}
        </Routes>)}
      </>
}

export default App
