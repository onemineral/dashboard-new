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

type XmoneyFormData = {
    api_key: string;
    webhook_secret: string;
};

/**
 * CreateXmoneyConnection Component
 *
 * Allows users to connect their xmoney.com crypto payment gateway by providing API credentials.
 * Uses react-hook-form with zod validation for robust form handling.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/xmoney/new/:legalEntityId?
 * <CreateXmoneyConnection />
 * ```
 */
export default function CreateXmoneyConnection() {
    const intl = useIntl();
    const navigate = useNavigate();
    const {tenant} = useContext(AppContext);
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading, hasError} = usePaymentProviderSetup("Xmoney", legalEntityId);

    // Setup react-hook-form with zod validation
    const {control, handleSubmit, formState: {errors}} = useForm<XmoneyFormData>({
        resolver: zodResolver(
            z.object({
                api_key: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "API Key is required",
                        description: "Error message for missing Xmoney API Key",
                    }),
                }),
                webhook_secret: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Webhook Secret is required",
                        description: "Error message for missing Xmoney Webhook Secret",
                    }),
                }),
            })
        ),
        defaultValues: {
            api_key: "",
            webhook_secret: "",
        },
    });

    // Submission mutation
    const submitMutation = useMutation<void, Error, XmoneyFormData>({
        mutationFn: async (data) => {
            try {
                await api.paymentProvider.createXmoney({
                    name: {[tenant.default_language.locale]: "Xmoney"},
                    api_key: data.api_key,
                    webhook_secret: data.webhook_secret,
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
                    provider: "Xmoney",
                    timestamp: new Date().toISOString(),
                },
            });
            window.dispatchEvent(event);
            navigate(-1);
        },
    });

    // Handle form submission
    const onSubmit = (data: XmoneyFormData) => {
        submitMutation.mutate(data);
    };

    return (
        <Page size="md">
            <PageHeader>
                <PageTitle>
                    <FormattedMessage
                        defaultMessage="Connect Xmoney Account"
                        description="Page title for connecting Xmoney account"
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
                                description="Error title when failing to load Xmoney configuration"
                            />
                        </AlertTitle>
                        <AlertDescription>
                            <FormattedMessage
                                defaultMessage="We couldn't load the necessary information. Please try again later."
                                description="Error description when failing to load Xmoney configuration"
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
                                                    alt="Xmoney"
                                                    className="h-8 max-w-32"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Accept cryptocurrency payments with Xmoney, supporting Bitcoin, Ethereum, USDT, and other major cryptocurrencies with instant settlement"
                                                description="Xmoney gateway description"
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
                                        defaultMessage="Xmoney API Credentials"
                                        description="Xmoney credentials form title"
                                    />
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Enter your Xmoney API credentials from your merchant dashboard"
                                        description="Xmoney credentials form description"
                                    />
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="api_key"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="API Key"
                                                    description="Label for Xmoney API Key input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your unique API Key provided by Xmoney for authenticating API requests and processing crypto payments"
                                                    description="Description for Xmoney API Key input"
                                                />
                                            }
                                            required
                                            error={errors.api_key?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="u_live_api_f1358****"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="webhook_secret"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Webhook Secret"
                                                    description="Label for Xmoney Webhook Secret input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Secret key used to verify webhook authenticity and secure payment notifications. Keep this confidential and never share it publicly."
                                                    description="Description for Xmoney Webhook Secret input"
                                                />
                                            }
                                            required
                                            error={errors.webhook_secret?.message}
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
                                                    defaultMessage="Need help finding your Xmoney credentials? View setup instructions"
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
                                                        defaultMessage="Follow these steps to obtain your Xmoney credentials and configure your crypto payment gateway"
                                                        description="Setup instructions dialog description"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 mt-4">
                                                <div className="space-y-3 text-sm">
                                                    <p className="font-medium">
                                                        <FormattedMessage
                                                            defaultMessage="To connect your Xmoney account, you need to obtain your API credentials from your merchant dashboard:"
                                                            description="Instructions introduction"
                                                        />
                                                    </p>

                                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Log in to your {link} using your merchant credentials."
                                                                description="Step 1: Log in to Xmoney"
                                                                values={{
                                                                    link: (
                                                                        <a
                                                                            href="https://merchants.crypto.xmoney.com/"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-800 hover:underline inline-flex items-center gap-1"
                                                                        >
                                                                            <FormattedMessage
                                                                                defaultMessage="Xmoney account"
                                                                                description="Link text for Xmoney"
                                                                            />
                                                                            <ExternalLink className="size-3"/>
                                                                        </a>
                                                                    ),
                                                                }}
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Once logged in, navigate to 'Integrations' from the main menu."
                                                                description="Step 2: Navigate to Integrations"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Click on the 'API Keys' tab to access your API credentials."
                                                                description="Step 3: Open API Keys tab"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Under 'Type of integration', select 'Custom' from the dropdown menu."
                                                                description="Step 4: Select Custom integration type"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="If your API Key and Webhook Secret are not visible yet, click the 'Generate secrets' button."
                                                                description="Step 5: Generate secrets if needed"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="You will now see your API Key (starts with 'u_live_api_' for live mode or 'u_test_api_' for test mode). Copy this value."
                                                                description="Step 6: Copy API Key"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Below the API Key, you will see your Webhook Secret. Copy this value carefully as it's used to verify webhook authenticity."
                                                                description="Step 7: Copy Webhook Secret"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Ensure you are using Live Mode credentials (u_live_api_) for production payments, not Test Mode credentials (u_test_api_)."
                                                                description="Step 8: Verify environment"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Copy both the API Key and Webhook Secret, then paste them in the form above to connect your Xmoney account."
                                                                description="Step 9: Copy credentials to form"
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
                                                                defaultMessage="Make sure you are using Live Mode credentials (u_live_api_) for production payments, not Test Mode credentials (u_test_api_)."
                                                                description="Important notice about using production environment"
                                                            />
                                                        </p>
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="Keep your API Key and Webhook Secret secure and never share them publicly. They are used to authenticate all API requests and verify webhook authenticity."
                                                                description="Security warning about credentials"
                                                            />
                                                        </p>
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {submitMutation.isError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="size-4"/>
                                        <AlertTitle>
                                            <FormattedMessage
                                                defaultMessage="Connection Failed"
                                                description="Error title when Xmoney connection fails"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            {submitMutation.error?.message || (
                                                <FormattedMessage
                                                    defaultMessage="The credentials you provided are incorrect. Please verify your API Key and Webhook Secret and try again."
                                                    description="Error description when Xmoney connection fails"
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
                                                description="Success title when Xmoney connection succeeds"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            <FormattedMessage
                                                defaultMessage="Your Xmoney account has been successfully connected and is ready to process cryptocurrency payments."
                                                description="Success description when Xmoney connection succeeds"
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
                                description="Button label while connecting to Xmoney"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Connect Xmoney Account"
                                description="Button label to connect Xmoney account"
                            />
                        )}
                    </Button>
                </div>
            </PageFooter>
        </Page>
    );
}