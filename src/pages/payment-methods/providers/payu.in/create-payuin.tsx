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

type PayUInFormData = {
    key: string;
    salt: string;
};

/**
 * CreatePayUInConnection Component
 *
 * Allows users to connect their PayU.in payment gateway by providing API credentials.
 * Uses react-hook-form with zod validation for robust form handling.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/payu.in/new/:legalEntityId?
 * <CreatePayUInConnection />
 * ```
 */
export default function CreatePayUInConnection() {
    const intl = useIntl();
    const navigate = useNavigate();
    const {tenant} = useContext(AppContext);
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading, hasError} = usePaymentProviderSetup("PayU.in", legalEntityId);

    // Setup react-hook-form with zod validation
    const {control, handleSubmit, formState: {errors}} = useForm<PayUInFormData>({
        resolver: zodResolver(
            z.object({
                key: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Merchant Key is required",
                        description: "Error message for missing PayU.in Merchant Key",
                    }),
                }),
                salt: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Merchant Salt is required",
                        description: "Error message for missing PayU.in Merchant Salt",
                    }),
                }),
            })
        ),
        defaultValues: {
            key: "",
            salt: "",
        },
    });

    // Submission mutation
    const submitMutation = useMutation<void, Error, PayUInFormData>({
        mutationFn: async (data) => {
            try {
                await api.paymentProvider.createPayuIn({
                    name: {[tenant.default_language.locale]: "PayU.in"},
                    key: data.key,
                    salt: data.salt,
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
                    provider: "PayU.in",
                    timestamp: new Date().toISOString(),
                },
            });
            window.dispatchEvent(event);
            navigate(-1);
        },
    });

    // Handle form submission
    const onSubmit = (data: PayUInFormData) => {
        submitMutation.mutate(data);
    };

    return (
        <Page size="md">
            <PageHeader>
                <PageTitle>
                    <FormattedMessage
                        defaultMessage="Connect PayU.in Account"
                        description="Page title for connecting PayU.in account"
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
                                description="Error title when failing to load PayU.in configuration"
                            />
                        </AlertTitle>
                        <AlertDescription>
                            <FormattedMessage
                                defaultMessage="We couldn't load the necessary information. Please try again later."
                                description="Error description when failing to load PayU.in configuration"
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
                                                    alt="PayU.in"
                                                    className="h-8 max-w-32"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Accept payments securely with PayU.in, India's leading payment gateway supporting multiple payment methods including cards, UPI, net banking, and wallets"
                                                description="PayU.in gateway description"
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
                                        defaultMessage="PayU.in Credentials"
                                        description="PayU.in credentials form title"
                                    />
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Enter your PayU.in API credentials from your merchant dashboard"
                                        description="PayU.in credentials form description"
                                    />
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="key"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Merchant Key"
                                                    description="Label for PayU.in Merchant Key input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your unique Merchant Key (API Key) provided by PayU.in for authenticating API requests"
                                                    description="Description for PayU.in Merchant Key input"
                                                />
                                            }
                                            required
                                            error={errors.key?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="gtKFFx"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="salt"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Merchant Salt"
                                                    description="Label for PayU.in Merchant Salt input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Secret Merchant Salt (API Salt) used to generate secure hashes for payment requests. Keep this confidential and never share it publicly."
                                                    description="Description for PayU.in Merchant Salt input"
                                                />
                                            }
                                            required
                                            error={errors.salt?.message}
                                        >
                                            <Input
                                                type="password"
                                                autoComplete="off"
                                                placeholder="eCwWELxi"
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
                                                    defaultMessage="Need help finding your PayU.in credentials? View setup instructions"
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
                                                        defaultMessage="Follow these steps to obtain your PayU.in credentials and configure your payment gateway"
                                                        description="Setup instructions dialog description"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 mt-4">
                                                <div className="space-y-3 text-sm">
                                                    <p className="font-medium">
                                                        <FormattedMessage
                                                            defaultMessage="To connect your PayU.in account, you need to obtain your API credentials from your merchant dashboard:"
                                                            description="Instructions introduction"
                                                        />
                                                    </p>

                                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Log in to your {link} using your merchant credentials."
                                                                description="Step 1: Log in to PayU.in"
                                                                values={{
                                                                    link: (
                                                                        <a
                                                                            href="https://dashboard.payu.in/"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-800 hover:underline inline-flex items-center gap-1"
                                                                        >
                                                                            <FormattedMessage
                                                                                defaultMessage="PayU.in Merchant Dashboard"
                                                                                description="Link text for PayU.in Merchant Dashboard"
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
                                                                defaultMessage="Click on 'Account Credentials' or 'API Keys' under the Settings section."
                                                                description="Step 3: Find API Credentials section"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="You will see your Merchant Key (also called API Key). This is a unique identifier for your merchant account. Copy this value."
                                                                description="Step 4: Copy Merchant Key"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Below the Merchant Key, you'll find your Merchant Salt (also called API Salt). This is a secret value used for generating secure payment hashes. Copy this value carefully."
                                                                description="Step 5: Copy Merchant Salt"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Ensure you are viewing credentials for the correct environment: use 'Production' credentials for live payments, not 'Test Mode' credentials."
                                                                description="Step 6: Verify environment"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Copy both the Merchant Key and Merchant Salt, then paste them in the form above to connect your PayU.in account to Rentalwise."
                                                                description="Step 7: Copy credentials"
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
                                                                defaultMessage="Make sure you are using Production credentials for live payments, not Test Mode credentials."
                                                                description="Important notice about using production environment"
                                                            />
                                                        </p>
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="Keep your Merchant Salt secure and never share it publicly. It's used to generate secure hashes for all payment requests to your account."
                                                                description="Security warning about merchant salt"
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
                                                description="Error title when PayU.in connection fails"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            {submitMutation.error?.message || (
                                                <FormattedMessage
                                                    defaultMessage="The credentials you provided are incorrect. Please verify your Merchant Key and Merchant Salt and try again."
                                                    description="Error description when PayU.in connection fails"
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
                                                description="Success title when PayU.in connection succeeds"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            <FormattedMessage
                                                defaultMessage="Your PayU.in account has been successfully connected and is ready to process payments."
                                                description="Success description when PayU.in connection succeeds"
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
                                description="Button label while connecting to PayU.in"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Connect PayU.in Account"
                                description="Button label to connect PayU.in account"
                            />
                        )}
                    </Button>
                </div>
            </PageFooter>
        </Page>
    );
}