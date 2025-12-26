import {useContext, useEffect} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useQuery, useMutation} from "@tanstack/react-query";
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
import {CurrencySelect} from "@/components/application/inputs/currency-select";
import {PaymentGatewayFeatures} from "@/pages/payment-methods/components/payment-gateway-features";
import {Badge} from "@/components/ui/badge";
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
import {Currency} from "@sdk/generated";
import {usePaymentProviderSetup} from "@/pages/payment-methods/hooks/use-payment-provider-setup";

type RedsysFormData = {
    merchantCode: string;
    terminal: string;
    signatureKey: string;
    defaultCurrency: number | null;
    selectedCurrencies: number[];
};

/**
 * NewRedsysConnection Component
 *
 * Allows users to connect their Redsys payment gateway by providing merchant credentials.
 * Uses react-hook-form with zod validation for robust form handling.
 *
 * @example
 * ```tsx
 * // Route: /payment-method/redsys/new/:legalEntityId?
 * <NewRedsysConnection />
 * ```
 */
export default function CreateRedsysConnection() {
    const intl = useIntl();
    const navigate = useNavigate();
    const {tenant} = useContext(AppContext);
    const {legalEntityId} = useParams<{ legalEntityId?: string }>();

    // Fetch legal entity and payment gateway
    const {legalEntity, paymentGateway, isLoading: setupLoading, hasError: setupError} = usePaymentProviderSetup("Redsys", legalEntityId);

    // Fetch all available currencies
    const currenciesQuery = useQuery({
        queryKey: ["currency.query"],
        queryFn: async () => {
            const response = await api.currency.query({
                sort: [{field: "name", direction: "asc", locale: "en"}],
                paginate: {perpage: 100},
            });
            return response.response?.data || [];
        },
    });

    // Setup react-hook-form with zod validation
    const {control, handleSubmit, formState: {errors}, watch, setValue} = useForm<RedsysFormData>({
        resolver: zodResolver(
            z.object({
                merchantCode: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Merchant Code is required",
                        description: "Error message for missing Redsys Merchant Code",
                    }),
                }),
                terminal: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Terminal is required",
                        description: "Error message for missing Redsys Terminal",
                    }),
                }),
                signatureKey: z.string().min(1, {
                    message: intl.formatMessage({
                        defaultMessage: "Signature Key is required",
                        description: "Error message for missing Redsys Signature Key",
                    }),
                }),
                defaultCurrency: z.number().nullable().refine(val => val !== null, {
                    message: intl.formatMessage({
                        defaultMessage: "Default currency is required",
                        description: "Error message for missing default currency",
                    }),
                }),
                selectedCurrencies: z.array(z.number()),
            }).refine(data => {
                if (data.defaultCurrency !== null && data.selectedCurrencies.length > 0) {
                    return data.selectedCurrencies.includes(data.defaultCurrency);
                }
                return true;
            }, {
                message: intl.formatMessage({
                    defaultMessage: "Default currency must be included in allowed currencies",
                    description: "Error message when default currency is not in allowed currencies",
                }),
                path: ["defaultCurrency"],
            })
        ),
        defaultValues: {
            merchantCode: "",
            terminal: "1",
            signatureKey: "",
            defaultCurrency: null,
            selectedCurrencies: [],
        },
    });

    const defaultCurrency = watch("defaultCurrency");
    const selectedCurrencies = watch("selectedCurrencies");

    // Auto-select EUR as default currency when currencies load
    useEffect(() => {
        if (currenciesQuery.data && !defaultCurrency) {
            const eurCurrency = currenciesQuery.data.find((c: Currency) => c.iso_code === "EUR");
            if (eurCurrency) {
                setValue("defaultCurrency", eurCurrency.id);
                setValue("selectedCurrencies", [eurCurrency.id]);
            }
        }
    }, [currenciesQuery.data, defaultCurrency, setValue]);

    // Submission mutation
    const submitMutation = useMutation<void, Error, RedsysFormData>({
        mutationFn: async (data) => {
            try {
                await api.paymentProvider.createRedsys({
                    name: {[tenant.default_language.locale]: "Redsys"},
                    merchant_code: data.merchantCode,
                    terminal: data.terminal,
                    signature_key: data.signatureKey,
                    default_currency: data.defaultCurrency!,
                    currencies: data.selectedCurrencies,
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
                    provider: "Redsys",
                    timestamp: new Date().toISOString(),
                },
            });
            window.dispatchEvent(event);
            navigate(-1);
        },
    });

    // Handle form submission
    const onSubmit = (data: RedsysFormData) => {
        submitMutation.mutate(data);
    };

    // Handle currency checkbox toggle
    const handleCurrencyToggle = (currencyId: number) => {
        const current = selectedCurrencies;
        const updated = current.includes(currencyId)
            ? current.filter((id) => id !== currencyId)
            : [...current, currencyId];
        setValue("selectedCurrencies", updated);
    };

    const isLoading = setupLoading || currenciesQuery.isLoading;
    const hasError = setupError || currenciesQuery.isError;

    return (
        <Page size="md">
            <PageHeader>
                <PageTitle>
                    <FormattedMessage
                        defaultMessage="Connect Redsys Account"
                        description="Page title for connecting Redsys account"
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
                                description="Error title when failing to load Redsys configuration"
                            />
                        </AlertTitle>
                        <AlertDescription>
                            <FormattedMessage
                                defaultMessage="We couldn't load the necessary information. Please try again later."
                                description="Error description when failing to load Redsys configuration"
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
                                                    alt="Redsys"
                                                    className="h-8 max-w-32"
                                                />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            <FormattedMessage
                                                defaultMessage="Accept credit card payments securely with Redsys, Spain's leading payment gateway"
                                                description="Redsys gateway description"
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
                                        defaultMessage="Redsys Credentials"
                                        description="Redsys credentials form title"
                                    />
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    <FormattedMessage
                                        defaultMessage="Enter your Redsys merchant credentials from your Virtual POS configuration"
                                        description="Redsys credentials form description"
                                    />
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Controller
                                    name="merchantCode"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Merchant Code"
                                                    description="Label for Redsys Merchant Code input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Your unique merchant identifier (FUC) provided by Redsys, typically 9 digits"
                                                    description="Description for Redsys Merchant Code input"
                                                />
                                            }
                                            required
                                            error={errors.merchantCode?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="123456789"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="terminal"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Terminal"
                                                    description="Label for Redsys Terminal input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Terminal number assigned by Redsys (usually '1' for single terminal setups)"
                                                    description="Description for Redsys Terminal input"
                                                />
                                            }
                                            required
                                            error={errors.terminal?.message}
                                        >
                                            <Input
                                                type="text"
                                                placeholder="1"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="signatureKey"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Signature Key (SHA-256)"
                                                    description="Label for Redsys Signature Key input"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="Secret signature key used to authenticate transactions (Clave secreta de firma)"
                                                    description="Description for Redsys Signature Key input"
                                                />
                                            }
                                            required
                                            error={errors.signatureKey?.message}
                                        >
                                            <Input
                                                type="password"
                                                autoComplete="off"
                                                placeholder="sq7HjrUOBfKmC576ILgskD5srU870gJ7"
                                                disabled={submitMutation.isPending}
                                                {...field}
                                            />
                                        </InputField>
                                    )}
                                />

                                <Controller
                                    name="defaultCurrency"
                                    control={control}
                                    render={({field}) => (
                                        <InputField
                                            label={
                                                <FormattedMessage
                                                    defaultMessage="Default Currency"
                                                    description="Label for default currency select"
                                                />
                                            }
                                            description={
                                                <FormattedMessage
                                                    defaultMessage="The main currency your Redsys account is configured with. Transactions in other currencies will be converted to this currency."
                                                    description="Description for default currency select"
                                                />
                                            }
                                            required
                                            error={errors.defaultCurrency?.message}
                                        >
                                            <CurrencySelect
                                                className={'max-w-80'}
                                                value={field.value}
                                                onChange={(value) => {
                                                    const currencyId = value ? parseInt(value as string) : null;
                                                    field.onChange(currencyId);
                                                    // Automatically add default currency to selected currencies
                                                    if (currencyId && !selectedCurrencies.includes(currencyId)) {
                                                        setValue("selectedCurrencies", [...selectedCurrencies, currencyId]);
                                                    }
                                                }}
                                                disabled={submitMutation.isPending}
                                                error={!!errors.defaultCurrency}
                                            />
                                        </InputField>
                                    )}
                                />

                                <InputField
                                    label={
                                        <FormattedMessage
                                            defaultMessage="Allowed Currencies"
                                            description="Label for allowed currencies selection"
                                        />
                                    }
                                    description={
                                        <FormattedMessage
                                            defaultMessage="Select all currencies this payment gateway can process. Payment amounts in other currencies will be converted to the default currency when processing."
                                            description="Description for allowed currencies selection"
                                        />
                                    }
                                    optional
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {currenciesQuery.data?.map((currency: Currency) => {
                                            const isSelected = selectedCurrencies.includes(currency.id);
                                            return (
                                                <Badge
                                                    key={currency.id}
                                                    variant={isSelected ? "secondary" : "outline"}
                                                    className={`gap-2 py-2 px-3 ${
                                                        isSelected ? "border-2 border-primary" : ""
                                                    } ${
                                                        submitMutation.isPending
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "cursor-pointer hover:bg-accent"
                                                    }`}
                                                    onClick={() => !submitMutation.isPending && handleCurrencyToggle(currency.id)}
                                                    role="button"
                                                    tabIndex={submitMutation.isPending ? -1 : 0}
                                                    aria-disabled={submitMutation.isPending}
                                                    onKeyDown={(e) => {
                                                        if (!submitMutation.isPending && (e.key === 'Enter' || e.key === ' ')) {
                                                            e.preventDefault();
                                                            handleCurrencyToggle(currency.id);
                                                        }
                                                    }}
                                                >
                                                    <span className="font-medium">{currency.iso_code}</span>
                                                    <span className="text-muted-foreground">{currency.symbol}</span>
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </InputField>

                                <div className="pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="link" className="h-auto p-0 text-sm text-left items-start">
                                                <HelpCircle className="size-4 mr-1.5 mt-1"/>
                                                <span className={'text-wrap'}><FormattedMessage
                                                    defaultMessage="Need help finding your Redsys credentials? View setup instructions"
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
                                                        defaultMessage="Follow these steps to obtain your Redsys credentials and configure your payment gateway"
                                                        description="Setup instructions dialog description"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 mt-4">
                                                <div className="space-y-3 text-sm">
                                                    <p className="font-medium">
                                                        <FormattedMessage
                                                            defaultMessage="To connect your Redsys account, you need to obtain your Virtual POS credentials from your Redsys account:"
                                                            description="Instructions introduction"
                                                        />
                                                    </p>

                                                    <ol className="list-decimal list-inside space-y-2 ml-2">
                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Log in to your {link} using your banking credentials."
                                                                description="Step 1: Log in to Redsys"
                                                                values={{
                                                                    link: (
                                                                        <a
                                                                            href="https://canales.redsys.es/"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-800 hover:underline inline-flex items-center gap-1"
                                                                        >
                                                                            <FormattedMessage
                                                                                defaultMessage="Redsys Administration Panel"
                                                                                description="Link text for Redsys Admin Panel"
                                                                            />
                                                                            <ExternalLink className="size-3"/>
                                                                        </a>
                                                                    ),
                                                                }}
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Navigate to 'Virtual POS Configuration' or 'Configuración TPV Virtual' section."
                                                                description="Step 2: Navigate to Virtual POS Configuration. IMPORTANT: Keep 'Configuración TPV Virtual' in Spanish as users need to find this menu item which may be in Spanish."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Find your 'Merchant Code' (FUC - Código de comercio), typically a 9-digit number."
                                                                description="Step 3: Find Merchant Code. IMPORTANT: Keep 'FUC' and 'Código de comercio' as technical terms."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Locate your 'Terminal' number (Número de terminal), usually '1' for standard setups."
                                                                description="Step 4: Find Terminal. IMPORTANT: Keep 'Número de terminal' in Spanish."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Generate or retrieve your 'Signature Key SHA-256' (Clave secreta de firma). If you don't have one, you'll need to generate it in the security section."
                                                                description="Step 5: Get Signature Key. IMPORTANT: Keep 'SHA-256' and 'Clave secreta de firma' as technical terms."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Ensure your Virtual POS is configured for 'REST API' integration mode."
                                                                description="Step 6: Check integration mode. IMPORTANT: Keep 'REST API' as a technical term."
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Select your default currency (typically EUR for Spain) and all currencies you want to accept."
                                                                description="Step 7: Select currencies"
                                                            />
                                                        </li>

                                                        <li>
                                                            <FormattedMessage
                                                                defaultMessage="Copy your credentials and paste them in the form to connect your Redsys account."
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
                                                                defaultMessage="Make sure to use production credentials, not test credentials, for live payments."
                                                                description="Important notice about using production environment"
                                                            />
                                                        </p>
                                                        <p>
                                                            <FormattedMessage
                                                                defaultMessage="Keep your Signature Key secure and never share it publicly. It's used to authenticate all transactions."
                                                                description="Security warning about signature key"
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
                                                description="Error title when Redsys connection fails"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            {submitMutation.error?.message || (
                                                <FormattedMessage
                                                    defaultMessage="The credentials you provided are incorrect. Please verify your Merchant Code, Terminal, and Signature Key and try again."
                                                    description="Error description when Redsys connection fails"
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
                                                description="Success title when Redsys connection succeeds"
                                            />
                                        </AlertTitle>
                                        <AlertDescription>
                                            <FormattedMessage
                                                defaultMessage="Your Redsys account has been successfully connected and is ready to process payments."
                                                description="Success description when Redsys connection succeeds"
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
                                description="Button label while connecting to Redsys"
                            />
                        ) : (
                            <FormattedMessage
                                defaultMessage="Connect Redsys Account"
                                description="Button label to connect Redsys account"
                            />
                        )}
                    </Button>
                </div>
            </PageFooter>
        </Page>
    );
}