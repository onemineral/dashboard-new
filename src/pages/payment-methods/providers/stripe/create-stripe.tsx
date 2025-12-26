import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Page, PageContent} from "@/components/application/page.tsx";
import {Spinner} from "@/components/ui/spinner";
import {Skeleton} from "@/components/ui/skeleton";
import {FormattedMessage} from "react-intl";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";
import {config} from "@/config.ts";
import {usePaymentProviderSetup} from "@/pages/payment-methods/hooks/use-payment-provider-setup";
import {PaymentGatewayFeatures} from "@/pages/payment-methods/components/payment-gateway-features";
import api from "@/lib/api";

// Popup window dimensions
const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 700;

/**
 * CreateStripeConnection Component
 *
 * Displays Stripe information and automatically opens the Stripe OAuth connection popup.
 * Shows payment gateway details, legal entity info, and available features while waiting.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/stripe/new/:legalEntityId?
 * <CreateStripeConnection />
 * ```
 */
export default function CreateStripeConnection() {
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();
    const [popupBlocked, setPopupBlocked] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const navigate = useNavigate();

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading, hasError} = usePaymentProviderSetup("Stripe Connect", legalEntityId);

    useEffect(() => {
        // Only open popup once data is loaded
        if (isLoading || hasError || !legalEntity) return;

        // Calculate popup position (centered)
        const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
        const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

        const oauthUrl = config.appUrl + "/rest/stripe/redirect?legal_entity=" + legalEntity.id;

        // Open popup window
        const popup = window.open(
            oauthUrl,
            "stripe-oauth",
            `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
        );

        if (popup) {
            setIsWaiting(true);

            // Poll to detect when popup closes
            const pollTimer = setInterval(async () => {
                if (popup.closed) {
                    clearInterval(pollTimer);
                    setIsWaiting(false);

                    // Check if a Stripe payment provider was created
                    try {
                        const response = await api.paymentMethod.query({
                            where: {
                                conditions: [
                                    { field: "legal_entity.id", eq: legalEntity.id },
                                    { field: "provider", eq: "Stripe Connect" }
                                ]
                            },
                            paginate: {perpage: 1}
                        });

                        if (response.response.data && response.response.data.length > 0) {
                            // Stripe payment provider was created successfully
                            // Dispatch custom event to notify listeners

                            const event = new CustomEvent("PaymentMethodConfigured", {
                                detail: {
                                    provider: "Stripe Connect",
                                    timestamp: new Date().toISOString(),
                                },
                            });
                            window.dispatchEvent(event);
                            navigate(-1);
                        }
                    } catch (error) {
                        console.error("Failed to check Stripe connection:", error);
                    }

                    // Close this modal window since OAuth flow is complete
                    window.close();
                }
            }, 200);

            // Cleanup on unmount
            return () => {
                clearInterval(pollTimer);
            };
        } else {
            // Popup was blocked
            setPopupBlocked(true);
        }
    }, [isLoading, hasError, legalEntity]);

    return (
        <Page modal size={'md'}>
            <PageContent>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                        <div className="space-y-6 w-full max-w-2xl">
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-32"/>
                                <Skeleton className="h-4 w-64"/>
                                <Skeleton className="h-24 w-full"/>
                            </div>
                            <div className="flex justify-center">
                                <Spinner className="size-12 text-primary" />
                            </div>
                        </div>
                    </div>
                ) : hasError ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                        <Alert variant="destructive" className="max-w-md">
                            <AlertCircle className="size-4"/>
                            <AlertTitle>
                                <FormattedMessage
                                    defaultMessage="Failed to load configuration"
                                    description="Error title when failing to load Stripe configuration"
                                />
                            </AlertTitle>
                            <AlertDescription>
                                <FormattedMessage
                                    defaultMessage="We couldn't load the necessary information. Please try again later."
                                    description="Error description when failing to load Stripe configuration"
                                />
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <div className="flex flex-col items-center min-h-[400px] gap-6 py-8">
                        {popupBlocked ? (
                            <Alert variant="destructive" className="max-w-md">
                                <AlertCircle className="size-4" />
                                <AlertTitle>
                                    <FormattedMessage
                                        defaultMessage="Popup Blocked"
                                        description="Error title when popup is blocked"
                                    />
                                </AlertTitle>
                                <AlertDescription>
                                    <FormattedMessage
                                        defaultMessage="The Stripe connection window was blocked by your browser. Please allow popups for this site and try again."
                                        description="Error description when popup is blocked"
                                    />
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                {/* Payment Gateway Info */}
                                {paymentGateway && (
                                    <div className="space-y-6 w-full max-w-2xl">
                                        <div className="flex flex-col @lg:flex-row @lg:items-start @lg:justify-between gap-4 pb-6 border-b">
                                            <div className="space-y-2 flex-1">
                                                <div>
                                                    {paymentGateway.logo_url && (
                                                        <img
                                                            src={paymentGateway.logo_url}
                                                            alt="Stripe"
                                                            className="h-8 max-w-32"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    <FormattedMessage
                                                        defaultMessage="Accept payments securely with Stripe, the leading payment platform supporting credit cards, debit cards, digital wallets, and local payment methods worldwide"
                                                        description="Stripe gateway description"
                                                    />
                                                </p>
                                            </div>
                                            {legalEntity && (
                                                <div className="@lg:text-right">
                                                    <div className="text-xs text-muted-foreground">
                                                        <FormattedMessage
                                                            defaultMessage="Legal Entity"
                                                            description="Legal entity label"
                                                        />
                                                    </div>
                                                    <div className="text-sm font-medium break-words">
                                                        {legalEntity.legal_name}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <PaymentGatewayFeatures
                                            availableFeatures={paymentGateway.available_features || []}
                                            mode="available-only"
                                        />
                                    </div>
                                )}

                                {/* Loading State */}
                                <div className="flex flex-col items-center gap-4 mt-6">
                                    <Spinner className="size-12 text-primary" />
                                    <div className="text-center space-y-2">
                                        <h2 className="text-xl font-semibold">
                                            {isWaiting ? (
                                                <FormattedMessage
                                                    defaultMessage="Waiting for Authorization"
                                                    description="Loading title when waiting for Stripe authorization"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="Opening Stripe"
                                                    description="Loading title when opening Stripe"
                                                />
                                            )}
                                        </h2>
                                        <p className="text-sm text-muted-foreground max-w-md">
                                            {isWaiting ? (
                                                <FormattedMessage
                                                    defaultMessage="Please complete the authorization in the Stripe window. This window will close automatically once you're done."
                                                    description="Loading description when waiting for authorization"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="Opening the Stripe authorization window..."
                                                    description="Loading description when opening popup"
                                                />
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </PageContent>
        </Page>
    );
}