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

type AuthorizeNetFormData = {
    loginId: string;
    transactionKey: string;
};

/**
 * NewAuthorizeNetConnection Component
 *
 * Allows users to connect their Authorize.net payment gateway by providing API credentials.
 * Uses react-hook-form with zod validation for robust form handling.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/authorizenet/new/:legalEntityId?
 * <NewAuthorizeNetConnection />
 * ```
 */
export default function CreateAuthorizeNetConnection() {
    const intl = useIntl();
    const navigate = useNavigate();
    const {tenant} = useContext(AppContext);
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading, hasError} = usePaymentProviderSetup("Authorize.net", legalEntityId);

    // Setup react-hook-form with zod validation
    const {control, handleSubmit, formState: {errors}} = useForm<AuthorizeNetFormData>({
        resolver: zodResolver(
            z.object({
                loginId: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "API Login ID is required",
                        description: "Error message for missing Authorize.net API Login ID",
                    }),
                }),
                transactionKey: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Transaction Key is required",
                        description: "Error message for missing Authorize.net Transaction Key",
                    }),
                }),
            })
        ),
        defaultValues: {
            loginId: "",
            transactionKey: "",
        },
    });

    // Submission mutation
    const submitMutation = useMutation<void, Error, AuthorizeNetFormData>({
        mutationFn: async (data) => {
            try {
                await api.paymentProvider.createAuthorizeNet({
                    name: {[tenant.default_language.locale]: "Authorize.net"},
                    login_id: data.loginId,
                    transaction_key: data.transactionKey,
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
                    provider: "AuthorizeNet",
                    timestamp: new Date().toISOString(),
                },
            });
            window.dispatchEvent(event);
            navigate(-1);
        },
    });

    // Handle form submission
    const onSubmit = (data: AuthorizeNetFormData) => {
        submitMutation.mutate(data);
    };

    return (
        <Page size="md">
            <PageHeader>
                <PageTitle>
                    <FormattedMessage
                        defaultMessage="Connect Authorize.net Account"
                        description="Page title for connecting Authorize.net account"
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
                                description="Error title when failing to load Authorize.net configuration"
                            />
                        </AlertTitle>
                        <AlertDescription>
                            <FormattedMessage
                                defaultMessage="We couldn't load the necessary information. Please try again later."
                                description="Error description when failing to load Authorize.net configuration"
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
                                                    alt="Authorize.net"
                                                    className="h-8 max-w-32"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Accept credit card payments securely with Authorize.net, a trusted payment gateway used by businesses worldwide"
                                                description="Authorize.net gateway description"
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
                                        defaultMessage="Authorize.net Credentials"
                                        description="Authorize.net credentials form title"
                                    />
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Enter your Authorize.net API credentials from your merchant account"
                                        description="Authorize.net credentials form description"
                                    />
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="loginId"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="API Login ID"
                                                    description="Label for Authorize.net API Login ID input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your unique API Login ID provided by Authorize.net for API authentication"
                                                    description="Description for Authorize.net API Login ID input"
                                                />
                                            }
                                            required
                                            error={errors.loginId?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="5KP3u95bQpv"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="transactionKey"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Transaction Key"
                                                    description="Label for Authorize.net Transaction Key input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Secret transaction key used to authenticate API requests. Keep this secure and never share it publicly."
                                                    description="Description for Authorize.net Transaction Key input"
                                                />
                                            }
                                            required
                                            error={errors.transactionKey?.message}
                                        >
                                            <Input
                                                type="password"
                                                autoComplete="off"
                                                placeholder="4Ktq8wP7fRgN9xL2"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <div className="pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="link"
                                                    className="h-auto p-0 text-sm text-left items-start">
                                                <HelpCircle className="size-4 mr-1.5 mt-1"/>
                                                <span className={'text-wrap'}><FormattedMessage
                                                    defaultMessage="Need help finding your Authorize.net credentials? View setup instructions"
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
                                                        defaultMessage="Follow these steps to obtain your Authorize.net credentials and configure your payment gateway"
                                                        description="Setup instructions dialog description"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 mt-4">
                                                <div className="space-y-3 text-sm">
                                                    <p className="font-medium">
                                                        <FormattedMessage
                                                            defaultMessage="To connect your Authorize.net account, you need to obtain your API credentials from your merchant account:"
                                                            description="Instructions introduction"
                                                        />
                                                    </p>

                                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Log in to your {link} using your merchant credentials."
                                                                description="Step 1: Log in to Authorize.net"
                                                                values={{
                                                                    link: (
                                                                        <a
                                                                            href="https://account.authorize.net/"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-800 hover:underline inline-flex items-center gap-1"
                                                                        >
                                                                            <FormattedMessage
                                                                                defaultMessage="Authorize.net Merchant Interface"
                                                                                description="Link text for Authorize.net Merchant Interface"
                                                                            />
                                                                            <ExternalLink className="size-3"/>
                                                                        </a>
                                                                    ),
                                                                }}
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Navigate to 'Account' in the top menu, then select 'Settings' from the dropdown."
                                                                description="Step 2: Navigate to Account Settings"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Click on 'API Credentials & Keys' in the Security Settings section."
                                                                description="Step 3: Find API Credentials section"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Your API Login ID will be displayed. Copy this value - it's a unique identifier for your account."
                                                                description="Step 4: Copy API Login ID"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="To get your Transaction Key, click 'New Transaction Key' or 'Request New Key'. Note: This will invalidate any existing transaction key."
                                                                description="Step 5: Generate Transaction Key"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Confirm the generation and copy the new Transaction Key immediately - it will only be shown once for security reasons."
                                                                description="Step 6: Save Transaction Key"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Select your default currency (typically USD for US-based businesses) and all currencies you want to accept."
                                                                description="Step 7: Select currencies"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Copy your credentials and paste them in the form to connect your Authorize.net account."
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
                                                                defaultMessage="Make sure your account is set to production mode, not test mode, for live payments."
                                                                description="Important notice about using production environment"
                                                            />
                                                        </p>
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="Keep your Transaction Key secure and never share it publicly. It's used to authenticate all API requests to your account."
                                                                description="Security warning about transaction key"
                                                            />
                                                        </p>
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="The Transaction Key can only be viewed once when generated. If you lose it, you'll need to generate a new one."
                                                                description="Warning about transaction key being shown only once"
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
                                                description="Error title when Authorize.net connection fails"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            {submitMutation.error?.message || (
                                                <FormattedMessage
                                                    defaultMessage="The credentials you provided are incorrect. Please verify your API Login ID and Transaction Key and try again."
                                                    description="Error description when Authorize.net connection fails"
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
                                                description="Success title when Authorize.net connection succeeds"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            <FormattedMessage
                                                defaultMessage="Your Authorize.net account has been successfully connected and is ready to process payments."
                                                description="Success description when Authorize.net connection succeeds"
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
                                description="Button label while connecting to Authorize.net"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Connect Authorize.net Account"
                                description="Button label to connect Authorize.net account"
                            />
                        )}
                    </Button>
                </div>
            </PageFooter>
        </Page>
    );
}