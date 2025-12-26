import PropertyCalendar from "@/pages/pms/properties/calendar/property-calendar.tsx";
import UpdatePropertyCalendar from "@/pages/pms/properties/calendar/update-property-calendar";
import Dashboard from "./pages/dashboard";
import MultiCalendar from "@/pages/pms/multi-calendar.tsx";
import PropertiesList from "@/pages/pms/properties";
import AmenitiesList from "./pages/pms/amenities";
import Form from "@/pages/form.tsx";
import ResourceInputsPage from "@/pages/resource-inputs.tsx";
import CreatePayPalConnection from "@/pages/payment-methods/providers/paypal/create-paypal.tsx";
import CreateRedsysConnection from "@/pages/payment-methods/providers/redsys/create-redsys.tsx";
import CreateAuthorizeNetConnection from "@/pages/payment-methods/providers/authorize.net/create-authorizenet.tsx";
import CreatePayUInConnection from "@/pages/payment-methods/providers/payu.in/create-payuin.tsx";
import CreateRazorpayConnection from "@/pages/payment-methods/providers/razorpay/create-razorpay.tsx";
import CreateXmoneyConnection from "@/pages/payment-methods/providers/xmoney/create-xmoney.tsx";
import CreateStripeConnection from "@/pages/payment-methods/providers/stripe/create-stripe.tsx";

export type LocalRoute = {
    element: any,
    path: string,
};

const routes: LocalRoute[] = [
    {path: '/', element: <Dashboard />},

    // PMS
    {path: '/pms/multi-calendar', element: <MultiCalendar />},
    {path: '/pms/properties', element: <PropertiesList />},
    {path: '/pms/properties/:id/calendar', element: <PropertyCalendar />},
    {path: '/pms/amenities', element: <AmenitiesList />},

    // Payment methods
    {path: '/payment-method/Stripe Connect/create/:legalEntityId?', element: <CreateStripeConnection />},
    {path: '/payment-method/Redsys/create/:legalEntityId?', element: <CreateRedsysConnection />},
    {path: '/payment-method/PayPal/create/:legalEntityId?', element: <CreatePayPalConnection />},
    {path: '/payment-method/xMoney/create/:legalEntityId?', element: <CreateXmoneyConnection />},
    {path: '/payment-method/Authorize.net/create/:legalEntityId?', element: <CreateAuthorizeNetConnection />},
    {path: '/payment-method/PayU.in/create/:legalEntityId?', element: <CreatePayUInConnection />},
    {path: '/payment-method/RazorPay/create/:legalEntityId?', element: <CreateRazorpayConnection />},


    // @todo: remove
    {path: '/dashboard', element: <Dashboard />},
    {path: '/form', element: <Form />},
    {path: '/resource-inputs', element: <ResourceInputsPage />},
    {path: '/calendar/:id', element: <PropertyCalendar />},
    {path: '/calendar-update/:id/:start?/:end?', element: <UpdatePropertyCalendar />},
];

export default routes;
