import OnboardingLanguageSelection from "@/pages/onboarding/language-selection.tsx";
import OnboardingAirbnbConnect from "@/pages/onboarding/airbnb-connect.tsx";
import OnboardingMainSettings from "@/pages/onboarding/main-settings.tsx";
import OnboardingPaymentsSetup from "@/pages/onboarding/payments-setup.tsx";
import OnboardingRentalAgreement from "@/pages/onboarding/rental-agreement.tsx";

export const OnboardingSteps = [
    {
        key: 'languages',
        component: OnboardingLanguageSelection,
    },
    {
        key: 'airbnb',
        component: OnboardingAirbnbConnect,
    },
    {
        key: 'payments',
        component: OnboardingPaymentsSetup,
    },
    {
        key: 'main-settings',
        component: OnboardingMainSettings,
    },
    {
        key: 'rental-agreement',
        component: OnboardingRentalAgreement,
    },
];