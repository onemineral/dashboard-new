import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useQuery } from "@tanstack/react-query";
import OnboardingProgress from "@/pages/onboarding/components/progress.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OnboardingStepProps } from "@/pages/onboarding/index.tsx";
import api from "@/lib/api.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { CreditCard, XCircle } from "lucide-react";
import { useModalNavigate } from "@/hooks/use-modal-navigate.ts";

/**
 * OnboardingPaymentsSetup Component
 *
 * Step in the onboarding process where users can set up their payment gateway.
 * This step displays payment gateways as a logo cloud where users can click
 * on any logo to connect that payment provider.
 *
 * Payment gateways are used for:
 * - Processing payments on the website
 * - Processing payments on VRBO
 * - Processing payments on Booking.com
 * - Sending payment links to guests
 *
 * @example
 * ```tsx
 * <OnboardingPaymentsSetup
 *   onSave={() => {}}
 *   onBack={() => {}}
 *   currentStep={3}
 *   totalSteps={5}
 * />
 * ```
 */
export default function OnboardingPaymentsSetup(props: OnboardingStepProps) {
  const navigate = useModalNavigate();
  
  // Listen for PaymentMethodConfigured event
  useEffect(() => {
    const handlePaymentMethodConfigured = () => {
      props.onSave();
    };

    window.addEventListener("PaymentMethodConfigured", handlePaymentMethodConfigured);

    return () => {
      window.removeEventListener("PaymentMethodConfigured", handlePaymentMethodConfigured);
    };
  }, [props]);

  // Fetch available payment gateways
  const paymentGatewaysQuery = useQuery({
    queryKey: ["payment-gateways.list"],
    queryFn: async () => {
      const response = await api.paymentGateway.query({sort: [{field: 'name', direction: 'asc'}]});
      return response.response;
    },
  });

  const handleSkip = () => {
    props.onSave();
  };

  return (
    <>
      <h1 className="text-xl flex-1 font-medium text-balance">
        <FormattedMessage
          defaultMessage="Select your preferred payment provider"
          description="Payment gateway setup page title"
        />
      </h1>
      <p className="text-muted-foreground">
        <FormattedMessage
          defaultMessage="Choose a payment gateway to accept online payments, process bookings, and send secure payment links to your guests."
          description="Payment gateway setup page description"
        />
      </p>

      <OnboardingProgress currentStep={props.currentStep} totalSteps={props.totalSteps} className="my-8" />

      {paymentGatewaysQuery.isLoading ? (
        <div className="w-full py-8">
          <div className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center justify-center p-8 rounded-lg border border-border bg-card h-32">
                <Skeleton className="h-12 w-32" />
              </div>
            ))}
          </div>
        </div>
      ) : paymentGatewaysQuery.isError ? (
        <div className="w-full p-10 text-center rounded-lg border border-destructive/50 bg-destructive/5">
          <XCircle className="size-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-medium mb-2">
            <FormattedMessage
              defaultMessage="Failed to load payment gateways"
              description="Error message when payment gateways fail to load"
            />
          </h3>
          <p className="text-sm text-muted-foreground">
            <FormattedMessage
              defaultMessage="We couldn't load the available payment gateways. Please try again later."
              description="Error description when payment gateways fail to load"
            />
          </p>
        </div>
      ) : !paymentGatewaysQuery.data?.data || paymentGatewaysQuery.data.data.length === 0 ? (
        <div className="w-full p-10 text-center rounded-lg border border-muted">
          <CreditCard className="size-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            <FormattedMessage
              defaultMessage="No payment gateways available"
              description="Message when no payment gateways are available"
            />
          </h3>
          <p className="text-sm text-muted-foreground">
            <FormattedMessage
              defaultMessage="There are currently no payment gateways available to configure."
              description="Description when no payment gateways are available"
            />
          </p>
        </div>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-6">
            {paymentGatewaysQuery.data.data.map((gateway) => (
              <button
                key={gateway.id}
                onClick={() => navigate(`/payment-method/${gateway.provider}/create`)}
                className="group cursor-pointer flex items-center justify-center p-4 rounded-lg border border-border bg-card hover:border-primary h-24"
                aria-label={`Connect to ${gateway.name}`}
              >
                {gateway.logo_url ? (
                  <img
                    src={gateway.logo_url}
                    alt={`${gateway.name} logo`}
                    className="max-h-12 w-full object-contain group-hover:grayscale-0 transition-all duration-200"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="size-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="ml-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {gateway.name}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          className="w-full"
        >
          <FormattedMessage
            defaultMessage="Skip for now"
            description="Button label to skip payment gateway setup"
          />
        </Button>
          <div>&nbsp;</div>
      </div>
    </>
  );
}