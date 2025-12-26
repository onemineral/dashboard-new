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

type PayPalFormData = {
    clientId: string;
    clientSecret: string;
};

/**
 * NewPayPalConnection Component
 *
 * Allows users to connect their PayPal account by providing API credentials.
 * Uses react-hook-form with zod validation for robust form handling.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/paypal/new/:legalEntityId?
 * <NewPayPalConnection />
 * ```
 */
export default function CreatePayPalConnection() {
    const navigate = useNavigate();
    const intl = useIntl();
    const {tenant} = useContext(AppContext);
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading, hasError} = usePaymentProviderSetup("PayPal", legalEntityId);

    // Setup react-hook-form with zod validation
    const {control, handleSubmit, formState: {errors}} = useForm<PayPalFormData>({
        resolver: zodResolver(
            z.object({
                clientId: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Client ID is required",
                        description: "Error message for missing PayPal Client ID",
                    }),
                }),
                clientSecret: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Client Secret is required",
                        description: "Error message for missing PayPal Client Secret",
                    }),
                }),
            })
        ),
        defaultValues: {
            clientId: "",
            clientSecret: "",
        },
    });

    // Submission mutation
    const submitMutation = useMutation<void, Error, PayPalFormData>({
        mutationFn: async (data) => {
            try {
                await api.paymentProvider.createPaypal({
                    name: {[tenant.default_language.locale]: 'PayPal'},
                    client_id: data.clientId,
                    secret: data.clientSecret,
                    legal_entity: legalEntity?.id as number
                });
            } catch (error) {
                const errorMessage = (error as any).responseBody?.message || 'Unknown error occurred';
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            // Dispatch custom event to notify listeners
            const event = new CustomEvent("PaymentMethodConfigured", {
                detail: {
                    provider: "PayPal",
                    timestamp: new Date().toISOString(),
                },
            });
            window.dispatchEvent(event);
            navigate(-1);
        },
    });

    // Handle form submission
    const onSubmit = (data: PayPalFormData) => {
        submitMutation.mutate(data);
    };

    return (
        <Page size="md">
            <PageHeader>
                <PageTitle>
                    <FormattedMessage
                        defaultMessage="Connect PayPal Account"
                        description="Page title for connecting PayPal account"
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
                        </div>
                    </div>
                ) : hasError ? (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4"/>
                        <AlertTitle>
                            <FormattedMessage
                                defaultMessage="Failed to load configuration"
                                description="Error title when failing to load PayPal configuration"
                            />
                        </AlertTitle>
                        <AlertDescription>
                            <FormattedMessage
                                defaultMessage="We couldn't load the necessary information. Please try again later."
                                description="Error description when failing to load PayPal configuration"
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
                                                    alt="PayPal"
                                                    className="h-8 max-w-32"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Accept payments securely with PayPal"
                                                description="PayPal gateway description"
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
                                        defaultMessage="PayPal Credentials"
                                        description="PayPal credentials form title"
                                    />
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Enter your PayPal application credentials"
                                        description="API credentials form description"
                                    />
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="clientId"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Client ID"
                                                    description="Label for PayPal Client ID input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your PayPal application Client ID from the Developer Dashboard"
                                                    description="Description for PayPal Client ID input"
                                                />
                                            }
                                            required
                                            error={errors.clientId?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="AeB1234567890xyz..."
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="clientSecret"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Client Secret"
                                                    description="Label for PayPal Client Secret input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your PayPal application Client Secret from the Developer Dashboard"
                                                    description="Description for PayPal Client Secret input"
                                                />
                                            }
                                            required
                                            error={errors.clientSecret?.message}
                                        >
                                            <Input
                                                type="password"
                                                autoComplete="off"
                                                placeholder="EcD1234567890xyz..."
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
                                                    defaultMessage="Need help finding your PayPal credentials? View setup instructions"
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
                                                        defaultMessage="Follow these steps to obtain your PayPal API credentials"
                                                        description="Setup instructions dialog description"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 mt-4">
                                                <div className="space-y-3 text-sm">
                                                    <p className="font-medium">
                                                        <FormattedMessage
                                                            defaultMessage="To connect your PayPal account, you need to create a PayPal application and obtain your API credentials:"
                                                            description="Instructions introduction"
                                                        />
                                                    </p>

                                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Go to the {link} and log in with your PayPal Business account."
                                                                description="Step 1: Navigate to PayPal Developer Portal"
                                                                values={{
                                                                    link: (
                                                                        <a
                                                                            href="https://developer.paypal.com/dashboard/"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-800 hover:underline inline-flex items-center gap-1"
                                                                        >
                                                                            <FormattedMessage
                                                                                defaultMessage="PayPal Developer Dashboard"
                                                                                description="Link text for PayPal Developer Dashboard"
                                                                            />
                                                                            <ExternalLink className="size-3"/>
                                                                        </a>
                                                                    ),
                                                                }}
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage='Navigate to "Apps & Credentials" from the top menu.'
                                                                description="Step 2: Navigate to Apps & Credentials menu. IMPORTANT: Keep 'Apps & Credentials' in English in parentheses after translation, as users need to find this exact menu item in PayPal's interface which may be in English."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage='Switch to "Live" mode using the toggle at the top.'
                                                                description="Step 3: Select Live environment. IMPORTANT: Keep 'Live' in English in parentheses after translation, as this is the exact label in PayPal's interface."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage='Click "Create App" button to create a new application.'
                                                                description="Step 4: Create new app. IMPORTANT: Keep 'Create App' in English in parentheses after translation, as this is the exact button label in PayPal's interface."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Enter an app name (e.g., 'My Property Management System') and click 'Create App'."
                                                                description="Step 5: Name your app. IMPORTANT: Keep 'Create App' button label in English in parentheses after translation."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Under 'Features', ensure the following permissions are enabled:"
                                                                description="Step 6: Configure permissions intro. IMPORTANT: Keep 'Features' in English in parentheses after translation, as this is the exact section name in PayPal's interface."
                                                            />
                                                            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                                                                <li>
                                                                    <FormattedMessage
                                                                        defaultMessage="Expanded checkout"
                                                                        description="PayPal permission: Issue refunds. IMPORTANT: Keep the English permission name in parentheses if it makes sense after translation."
                                                                    />
                                                                </li>
                                                                <li>
                                                                    <FormattedMessage
                                                                        defaultMessage="JavaScript SDK v6"
                                                                        description="PayPal permission: JavaScript SDK v6. IMPORTANT: Keep the English permission name in parentheses after translation if it makes sense, as these are exact permission names in PayPal's interface."
                                                                    />
                                                                </li>
                                                                <li>
                                                                    <FormattedMessage
                                                                        defaultMessage="Save payment methods (for storing payment methods)"
                                                                        description="PayPal permission: Vault. IMPORTANT: Keep 'Save payment methods' in English in parentheses after translation if it makes sense, as this is the exact permission name in PayPal's interface."
                                                                    />
                                                                </li>
                                                            </ul>
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage='Copy the "Client ID" and "Secret" from the app details page.'
                                                                description="Step 7: Copy credentials. IMPORTANT: Keep 'Client ID' and 'Secret' in English in parentheses after translation if it makes sense, as these are the exact field labels in PayPal's interface."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Paste the credentials in the form to connect your PayPal account."
                                                                description="Step 8: Paste credentials"
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
                                                    <AlertDescription>
                                                        <FormattedMessage
                                                            defaultMessage="Make sure to use credentials from the Live environment for production payments."
                                                            description="Important notice about using live environment"
                                                        />
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
                                                description="Error title when PayPal connection fails"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            {submitMutation.error?.message || (
                                                <FormattedMessage
                                                    defaultMessage="The credentials you provided are incorrect. Please verify your Client ID and Client Secret and try again."
                                                    description="Error description when PayPal connection fails"
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
                                                description="Success title when PayPal connection succeeds"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            <FormattedMessage
                                                defaultMessage="Your PayPal account has been successfully connected."
                                                description="Success description when PayPal connection succeeds"
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
                                description="Button label while connecting to PayPal"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Connect PayPal Account"
                                description="Button label to connect PayPal account"
                            />
                        )}
                    </Button>
                </div>
            </PageFooter>
        </Page>
    );
}