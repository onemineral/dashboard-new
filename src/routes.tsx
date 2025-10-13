import PropertyCalendar from "@/pages/pms/properties/calendar/property-calendar.tsx";
import UpdatePropertyCalendar from "@/pages/pms/properties/calendar/update-property-calendar";
import Dashboard from "./pages/dashboard";
import Home from "@/pages";
import PropertiesList from "@/pages/pms/properties";
import AmenitiesList from "./pages/pms/amenities";
import Form from "@/pages/form.tsx";
import ResourceInputsPage from "@/pages/resource-inputs.tsx";

export type LocalRoute = {
    element: any,
    path: string,
};

const routes: LocalRoute[] = [
    {path: '/', element: <Home />},

    // PMS
    {path: '/pms/properties', element: <PropertiesList />},
    {path: '/pms/amenities', element: <AmenitiesList />},


    // @todo: remove
    {path: '/dashboard', element: <Dashboard />},
    {path: '/form', element: <Form />},
    {path: '/resource-inputs', element: <ResourceInputsPage />},
    {path: '/calendar/:id', element: <PropertyCalendar />},
    {path: '/calendar-update/:id/:start?/:end?', element: <UpdatePropertyCalendar />},
];

export default routes;
