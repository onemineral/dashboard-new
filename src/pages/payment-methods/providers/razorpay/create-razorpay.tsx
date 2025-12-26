import {useContext} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useMutation} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Page, PageHeader, PageTitle, PageContent, PageFooter} from "@/components/application/page";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";
import {InputField} from "@/components/application/inputs/input-field";
import {PaymentGatewayFeatures} from "@/pages/payment-methods/components/payment-gateway-features";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import api from "@/lib/api";
import {AlertCircle, CheckCircle2, ExternalLink, Info, HelpCircle} from "lucide-react";
import {AppContext} from "@/contexts/app-context.tsx";
import {usePaymentProviderSetup} from "@/pages/payment-methods/hooks/use-payment-provider-setup";

type RazorpayFormData = {
    key_id: string;
    key_secret: string;
};

/**
 * CreateRazorpayConnection Component
 *
 * Allows users to connect their Razorpay payment gateway by providing API credentials.
 * Uses react-hook-form with zod validation for robust form handling.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/razorpay/new/:legalEntityId?
 * <CreateRazorpayConnection />
 * ```
 */
export default function CreateRazorpayConnection() {
    const intl = useIntl();
    const navigate = useNavigate();
    const {tenant} = useContext(AppContext);
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();

    // Get current domain
    const currentDomain = window.location.origin;

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading, hasError} = usePaymentProviderSetup("Razorpay", legalEntityId);

    // Setup react-hook-form with zod validation
    const {control, handleSubmit, formState: {errors}} = useForm<RazorpayFormData>({
        resolver: zodResolver(
            z.object({
                key_id: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Key ID is required",
                        description: "Error message for missing Razorpay Key ID",
                    }),
                }),
                key_secret: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Key Secret is required",
                        description: "Error message for missing Razorpay Key Secret",
                    }),
                }),
            })
        ),
        defaultValues: {
            key_id: "",
            key_secret: "",
        },
    });

    // Submission mutation
    const submitMutation = useMutation<void, Error, RazorpayFormData>({
        mutationFn: async (data) => {
            try {
                await api.paymentProvider.createRazorpay({
                    name: {[tenant.default_language.locale]: "Razorpay"},
                    key_id: data.key_id,
                    key_secret: data.key_secret,
                    legal_entity: legalEntity?.id as number,
                });
            } catch (error) {
                const errorMessage = (error as any).responseBody?.message || "Unknown error occurred";
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            // Dispatch custom event to notify listeners
            const event = new CustomEvent("PaymentMethodConfigured", {
                detail: {
                    provider: "Razorpay",
                    timestamp: new Date().toISOString(),
                },
            });
            window.dispatchEvent(event);
            navigate(-1);
        },
    });

    // Handle form submission
    const onSubmit = (data: RazorpayFormData) => {
        submitMutation.mutate(data);
    };

    return (
        <Page size="md">
            <PageHeader>
                <PageTitle>
                    <FormattedMessage
                        defaultMessage="Connect Razorpay Account"
                        description="Page title for connecting Razorpay account"
                    />
                </PageTitle>
            </PageHeader>

            <PageContent>
                {isLoading ? (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-32"/>
                            <Skeleton className="h-4 w-64"/>
                            <Skeleton className="h-24 w-full"/>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-full"/>
                            <Skeleton className="h-10 w-full"/>
                            <Skeleton className="h-10 w-full"/>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                    </div>
                ) : hasError ? (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4"/>
                        <AlertTitle>
                            <FormattedMessage
                                defaultMessage="Failed to load configuration"
                                description="Error title when failing to load Razorpay configuration"
                            />
                        </AlertTitle>
                        <AlertDescription>
                            <FormattedMessage
                                defaultMessage="We couldn't load the necessary information. Please try again later."
                                description="Error description when failing to load Razorpay configuration"
                            />
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Payment Gateway Info */}
                        {paymentGateway && (
                            <div className="space-y-6 border-b pb-6">
                                <div
                                    className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div>
                                            {paymentGateway.logo_url && (
                                                <img
                                                    src={paymentGateway.logo_url}
                                                    alt="Razorpay"
                                                    className="h-8 max-w-32"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Accept payments securely with Razorpay, India's leading payment gateway supporting multiple payment methods including cards, UPI, net banking, and digital wallets"
                                                description="Razorpay gateway description"
                                            />
                                        </p>
                                    </div>
                                    {legalEntity && (
                                        <div className="md:text-right">
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

                        {/* Credentials Form */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">
                                    <FormattedMessage
                                        defaultMessage="Razorpay Credentials"
                                        description="Razorpay credentials form title"
                                    />
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Enter your Razorpay API credentials from your dashboard"
                                        description="Razorpay credentials form description"
                                    />
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="key_id"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Key ID"
                                                    description="Label for Razorpay Key ID input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your unique API Key ID provided by Razorpay for authenticating API requests"
                                                    description="Description for Razorpay Key ID input"
                                                />
                                            }
                                            required
                                            error={errors.key_id?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="rzp_test_1DP5mmOlF5G5ag"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="key_secret"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Key Secret"
                                                    description="Label for Razorpay Key Secret input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Secret API Key used to authenticate and authorize API requests. Keep this confidential and never share it publicly."
                                                    description="Description for Razorpay Key Secret input"
                                                />
                                            }
                                            required
                                            error={errors.key_secret?.message}
                                        >
                                            <Input
                                                type="password"
                                                autoComplete="off"
                                                placeholder="••••••••••••••••"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <div className="pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="link" className="h-auto p-0 text-sm text-left items-start">
                                                <HelpCircle className="size-4 mr-1.5 mt-1"/>
                                                <span className={'text-wrap'}><FormattedMessage
                                                    defaultMessage="Need help finding your Razorpay credentials? View setup instructions"
                                                    description="Link to open setup instructions dialog"
                                                /></span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[80vh] overflow-y-auto" size="xl">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Info className="size-5"/>
                                                    <FormattedMessage
                                                        defaultMessage="Setup Instructions"
                                                        description="Setup instructions dialog title"
                                                    />
                                                </DialogTitle>
                                                <DialogDescription>
                                                    <FormattedMessage
                                                        defaultMessage="Follow these steps to obtain your Razorpay credentials and configure your payment gateway"
                                                        description="Setup instructions dialog description"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 mt-4">
                                                <div className="space-y-3 text-sm">
                                                    <p className="font-medium">
                                                        <FormattedMessage
                                                            defaultMessage="To connect your Razorpay account, you need to obtain your API credentials from your dashboard:"
                                                            description="Instructions introduction"
                                                        />
                                                    </p>

                                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Log in to your {link} using your merchant credentials."
                                                                description="Step 1: Log in to Razorpay"
                                                                values={{
                                                                    link: (
                                                                        <a
                                                                            href="https://dashboard.razorpay.com/"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-800 hover:underline inline-flex items-center gap-1"
                                                                        >
                                                                            <FormattedMessage
                                                                                defaultMessage="Razorpay Dashboard"
                                                                                description="Link text for Razorpay Dashboard"
                                                                            />
                                                                            <ExternalLink className="size-3"/>
                                                                        </a>
                                                                    ),
                                                                }}
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Once logged in, navigate to 'Settings' from the left sidebar menu."
                                                                description="Step 2: Navigate to Settings"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Click on 'API Keys' under the Settings section."
                                                                description="Step 3: Find API Keys section"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="If you don't have any API keys yet, click on 'Generate Key' to create a new key pair."
                                                                description="Step 4: Generate API keys if needed"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="You will see your Key ID (starts with 'rzp_test_' for test mode or 'rzp_live_' for live mode). This is your public key. Copy this value."
                                                                description="Step 5: Copy Key ID"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Click on the eye icon or 'Show' button next to the Key Secret to reveal it. This is your secret key used for authentication. Copy this value carefully."
                                                                description="Step 6: Copy Key Secret"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Ensure you are using the correct environment keys: use 'Live Mode' keys (rzp_live_) for production payments, not 'Test Mode' keys (rzp_test_)."
                                                                description="Step 7: Verify environment"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Copy both the Key ID and Key Secret, then paste them in the form above to connect your Razorpay account to Rentalwise."
                                                                description="Step 8: Copy credentials"
                                                            />
                                                        </li>
                                                    </ol>
                                                </div>

                                                <Alert>
                                                    <Info className="size-4"/>
                                                    <AlertTitle>
                                                        <FormattedMessage
                                                            defaultMessage="Important"
                                                            description="Important notice title"
                                                        />
                                                    </AlertTitle>
                                                    <AlertDescription className="space-y-2">
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="Make sure you are using Live Mode keys (rzp_live_) for production payments, not Test Mode keys (rzp_test_)."
                                                                description="Important notice about using production environment"
                                                            />
                                                        </p>
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="Keep your Key Secret secure and never share it publicly. It's used to authenticate all API requests to your account."
                                                                description="Security warning about key secret"
                                                            />
                                                        </p>
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Domain Whitelisting Alert */}
                                <Alert variant={'warning'}>
                                    <Info className="size-4"/>
                                    <AlertTitle>
                                        <FormattedMessage
                                            defaultMessage="Domain Whitelisting Required"
                                            description="Alert title for Razorpay domain whitelisting requirement"
                                        />
                                    </AlertTitle>
                                    <AlertDescription className="space-y-2">
                                        <p>
                                            <FormattedMessage
                                                defaultMessage="You must whitelist <strong>{currentDomain}</strong> and your own website domain in your Razorpay Dashboard (Settings → API Keys → Whitelist Domains)."
                                                description="Description for domain whitelisting requirement"
                                                values={{
                                                    currentDomain,
                                                    strong: (chunks) => <strong>{chunks}</strong>
                                                }}
                                            />
                                        </p>
                                        <p className="text-sm">
                                            <FormattedMessage
                                                defaultMessage="This is required for payment forms to work on both the payment links and your customer-facing website."
                                                description="Explanation for why both domains need whitelisting"
                                            />
                                        </p>
                                    </AlertDescription>
                                </Alert>

                                {submitMutation.isError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="size-4"/>
                                        <AlertTitle>
                                            <FormattedMessage
                                                defaultMessage="Connection Failed"
                                                description="Error title when Razorpay connection fails"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            {submitMutation.error?.message || (
                                                <FormattedMessage
                                                    defaultMessage="The credentials you provided are incorrect. Please verify your Key ID and Key Secret and try again."
                                                    description="Error description when Razorpay connection fails"
                                                />
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {submitMutation.isSuccess && (
                                    <Alert>
                                        <CheckCircle2 className="size-4 text-green-600"/>
                                        <AlertTitle>
                                            <FormattedMessage
                                                defaultMessage="Successfully Connected"
                                                description="Success title when Razorpay connection succeeds"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            <FormattedMessage
                                                defaultMessage="Your Razorpay account has been successfully connected and is ready to process payments."
                                                description="Success description when Razorpay connection succeeds"
                                            />
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </PageContent>

            <PageFooter>
                <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        disabled={submitMutation.isPending}
                        onClick={() => navigate(-1)}
                    >
                        <FormattedMessage
                            defaultMessage="Cancel"
                            description="Cancel button label"
                        />
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading || hasError || submitMutation.isPending}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {submitMutation.isPending ? (
                            <FormattedMessage
                                defaultMessage="Connecting..."
                                description="Button label while connecting to Razorpay"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Connect Razorpay Account"
                                description="Button label to connect Razorpay account"
                            />
                        )}
                    </Button>
                </div>
            </PageFooter>
        </Page>
    );
}