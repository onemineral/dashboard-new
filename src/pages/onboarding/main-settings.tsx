import {useContext, useEffect, useState} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {FormattedMessage, useIntl} from "react-intl";
import {useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import {useForm, Controller} from "react-hook-form";
import OnboardingProgress from "@/pages/onboarding/components/progress.tsx";
import {InputField} from "@/components/application/inputs/input-field.tsx";
import {CurrencySelect} from "@/components/application/inputs/currency-select.tsx";
import {TimezoneSelect} from "@/components/application/inputs/timezone-select.tsx";
import {CountrySelect} from "@/components/application/inputs/country-select.tsx";
import {PhoneInput} from "@/components/application/inputs/phone.tsx";
import {FileUpload} from "@/components/application/inputs/upload/file-upload.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import api from "@/lib/api.ts";
import {OnboardingStepProps} from "@/pages/onboarding/index.tsx";
import {Image, LegalEntity} from "@sdk/generated";
import {Separator} from "@/components/ui/separator.tsx";

interface MainSettingsFormData {
    brandName: string;
    legalName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: number;
    postcode: string;
    taxId: string | undefined;
    displayCurrency: number;
    displayTimezone: string;
}

/**
 * OnboardingMainSettings Component
 *
 * Step 2 of the onboarding process where users configure their main PMS settings:
 * - Brand Name: The main company/property name shown in communications
 * - Display Currency: Currency used for displaying aggregated financial data
 * - Default Minimum Stay: Default minimum booking length (optional, can be overridden per property)
 * - Default Maximum Stay: Default maximum booking length (optional, can be overridden per property)
 * - Display Timezone: Timezone for displaying timestamps in the UI
 *
 * @example
 * ```tsx
 * <OnboardingMainSettings />
 * ```
 */
export default function OnboardingMainSettings(props: OnboardingStepProps) {
    const {tenant} = useContext(AppContext);
    const intl = useIntl();
    const queryClient = useQueryClient();
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [existingLogo, setExistingLogo] = useState<Image | null>(null);

    // Fetch current tenant with billing relation to pre-populate form
    const tenantQuery = useQuery({
        queryKey: ['tenant.current', {with: ['billing.country']}],
        queryFn: async () => {
            const response = await api.tenant.current({with: ['billing.country', 'logo_dark']});
            return response.response;
        },
    });

    // Fetch legal entity
    const legalEntityQuery = useQuery({
        queryKey: ['legal-entity'],
        queryFn: async () => {
            const response = await api.legalEntity.query({});
            // Return the first legal entity (or null if none exists)
            return response.response.data?.[0] || null;
        },
    });

    // React Hook Form setup
    const {control, handleSubmit, formState: {errors}, reset} = useForm<MainSettingsFormData>({
        defaultValues: {
            brandName: tenant.name || '',
            legalName: '',
            firstName: '',
            lastName: '',
            phone: undefined,
            email: '',
            address: '',
            city: '',
            country: undefined,
            postcode: '',
            taxId: '',
            displayCurrency: tenant.default_currency?.id,
            displayTimezone: tenant.settings?.timezone,
        },
    });

    // Update form when tenant data is loaded
    useEffect(() => {
        if (tenantQuery.data) {
            const billing = tenantQuery.data.billing;
            reset({
                brandName: tenantQuery.data.name || '',
                legalName: billing?.company_name || '',
                firstName: billing?.first_name || '',
                lastName: billing?.last_name || '',
                phone: billing?.phone_number || null,
                email: billing?.email || '',
                address: billing?.address || '',
                city: billing?.city || '',
                country: billing?.country?.id || null,
                postcode: billing?.postcode || '',
                taxId: billing?.tax_id || '',
                displayCurrency: tenantQuery.data.default_currency?.id,
                displayTimezone: tenantQuery.data.settings?.timezone,
            });
            
            // Set existing logo if available
            if (tenantQuery.data.logo_dark) {
                setExistingLogo(tenantQuery.data.logo_dark);
            }
        }
    }, [tenantQuery.data, reset]);

    // Mutation for uploading logo
    const uploadLogo = useMutation({
        mutationFn: async (file: File) => {
            await api.tenant.uploadLogoDark({
                file: file
            });
        },
    });

    // Handle logo upload
    const handleLogoUpload = async (file: File) => {
        await uploadLogo.mutateAsync(file);
    };

    // Mutation for saving main settings
    const saveMainSettings = useMutation({
        mutationFn: async (data: MainSettingsFormData) => {
            // Update tenant basic info
            await api.tenant.update({
                name: data.brandName,
                default_currency: data.displayCurrency,
            });

            // Update tenant settings (timezone)
            await api.tenant.updateSettings({
                // @ts-ignore - timezone type is too long to include all values
                timezone: data.displayTimezone,
            });

            // Update existing legal entity
            await api.legalEntity.update({
                id: (legalEntityQuery.data as LegalEntity).id,
                legal_name: data.legalName,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                email: data.email,
                address: data.address,
                city: data.city,
                country: data.country as number,
                postcode: data.postcode,
                business_name: data.brandName,
                tax_id: data.taxId,
            });

            // Update billing information (keeping this for backward compatibility)
            await api.tenant.updateBilling({
                company_name: data.legalName,
                first_name: data.firstName,
                last_name: data.lastName,
                phone_number: data.phone,
                email: data.email,
                address: data.address,
                city: data.city,
                country: data.country as number,
                postcode: data.postcode,
                type: data.taxId ? 'company' : 'individual',
                tax_id: data.taxId,
            });

            await api.profileSettings.update({
                // @ts-ignore - timezone type is too long to include all values
                timezone: data.displayTimezone,
            });

            await queryClient.refetchQueries({
                queryKey: ['settings']
            });
        },
        onSuccess: () => {
            console.log('Main settings saved successfully');
            props.onSave();
        },
        onError: (error) => {
            console.error('Failed to save main settings:', error);
        },
    });

    const onSubmit = (data: MainSettingsFormData) => {
        saveMainSettings.mutate(data);
    };

    // Show loading state while fetching tenant and legal entity data
    const isLoading = tenantQuery.isLoading || legalEntityQuery.isLoading;

    if (isLoading) {
        return <>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-8" />

            <OnboardingProgress currentStep={props.currentStep} totalSteps={props.totalSteps} className={'my-8'}/>

            <div className="w-full space-y-6">
                {/* Contact Information Section */}
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-80" />
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Business Information Section */}
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Legal Name */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full max-w-2xl" />
                    <Skeleton className="h-10 w-full max-w-sm" />
                </div>

                {/* Tax ID */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full max-w-2xl" />
                    <Skeleton className="h-10 w-full max-w-sm" />
                </div>

                {/* Business Address Section */}
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full max-w-2xl" />
                </div>
            </div>
        </>;
    }

    return <>
        <h1 className={"text-xl flex-1 font-medium text-balance"}>
            <FormattedMessage
                defaultMessage="Let's configure your main settings"
                description="Main settings onboarding page title"
            />
        </h1>
        <p className="text-muted-foreground">
            <FormattedMessage
                defaultMessage="Set up your brand name, currency, and other core settings."
                description="Main settings onboarding page description"
            />
        </p>

        <OnboardingProgress currentStep={props.currentStep} totalSteps={props.totalSteps} className={'my-8'}/>

        {/* Main Settings Form */}
        <div className="w-full space-y-6">
            {/* First Name and Last Name on same line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="firstName"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            defaultMessage: "First name is required",
                            description: "First name required validation message"
                        })
                    }}
                    render={({field}) => (
                        <InputField
                            label={
                                <FormattedMessage
                                    defaultMessage="First Name"
                                    description="Label for first name input"
                                />
                            }
                            error={errors.firstName?.message}
                            required
                        >
                            <Input
                                {...field}
                                placeholder={intl.formatMessage({
                                    defaultMessage: "John",
                                    description: "Placeholder for first name input"
                                })}
                            />
                        </InputField>
                    )}
                />

                <Controller
                    name="lastName"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            defaultMessage: "Last name is required",
                            description: "Last name required validation message"
                        })
                    }}
                    render={({field}) => (
                        <InputField
                            label={
                                <FormattedMessage
                                    defaultMessage="Last Name"
                                    description="Label for last name input"
                                />
                            }
                            error={errors.lastName?.message}
                            required
                        >
                            <Input
                                {...field}
                                placeholder={intl.formatMessage({
                                    defaultMessage: "Doe",
                                    description: "Placeholder for last name input"
                                })}
                            />
                        </InputField>
                    )}
                />
            </div>

            {/* Email and Phone on same line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            defaultMessage: "Email is required",
                            description: "Email required validation message"
                        }),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: intl.formatMessage({
                                defaultMessage: "Invalid email address",
                                description: "Email pattern validation message"
                            })
                        }
                    }}
                    render={({field}) => (
                        <InputField
                            label={
                                <FormattedMessage
                                    defaultMessage="Email"
                                    description="Label for email input"
                                />
                            }
                            error={errors.email?.message}
                            required
                        >
                            <Input
                                {...field}
                                type="email"
                                placeholder={intl.formatMessage({
                                    defaultMessage: "contact@example.com",
                                    description: "Placeholder for email input"
                                })}
                            />
                        </InputField>
                    )}
                />

                <Controller
                    name="phone"
                    control={control}
                    rules={{
                        required: intl.formatMessage({
                            defaultMessage: "Phone number is required",
                            description: "Phone required validation message"
                        })
                    }}
                    render={({field}) => (
                        <InputField
                            label={
                                <FormattedMessage
                                    defaultMessage="Phone"
                                    description="Label for phone input"
                                />
                            }
                            error={errors.phone?.message}
                            required
                        >
                            <PhoneInput
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={!!errors.phone}
                                defaultCountry="US"
                            />
                        </InputField>
                    )}
                />
            </div>

            <Separator orientation={'horizontal'} className={'my-8'} />

            {/* Legal Name */}
            <Controller
                name="legalName"
                control={control}
                rules={{
                    required: intl.formatMessage({
                        defaultMessage: "Legal name is required",
                        description: "Legal name required validation message"
                    })
                }}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Business Legal Name"
                                description="Label for legal name input"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="If you don't operate under a company, enter your first and last name."
                                description="Description for legal name field"
                            />
                        }
                        error={errors.legalName?.message}
                        required
                    >
                        <Input
                            {...field}
                            className="w-full max-w-sm"
                            placeholder={intl.formatMessage({
                                defaultMessage: "e.g., Sunset Beach Rentals LLC",
                                description: "Placeholder for legal name input"
                            })}
                        />
                    </InputField>
                )}
            />

            {/* Tax ID / VAT ID */}
            <Controller
                name="taxId"
                control={control}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Tax ID / VAT ID"
                                description="Label for tax ID input"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="Leave empty if you don't operate under a company."
                                description="Description for tax ID field"
                            />
                        }
                        error={errors.taxId?.message}
                        optional
                    >
                        <Input
                            {...field}
                            className="w-full max-w-sm"
                            placeholder={intl.formatMessage({
                                defaultMessage: "e.g., VAT123456789 or EIN 12-3456789",
                                description: "Placeholder for tax ID input"
                            })}
                        />
                    </InputField>
                )}
            />

            <Separator orientation={'horizontal'} className={'my-8'} />

            {/* Address */}
            <Controller
                name="address"
                control={control}
                rules={{
                    required: intl.formatMessage({
                        defaultMessage: "Address is required",
                        description: "Address required validation message"
                    })
                }}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Business Address"
                                description="Label for address input"
                            />
                        }
                        error={errors.address?.message}
                        required
                    >
                        <Input
                            {...field}
                            className="w-full max-w-2xl"
                            placeholder={intl.formatMessage({
                                defaultMessage: "123 Main Street",
                                description: "Placeholder for address input"
                            })}
                        />
                    </InputField>
                )}
            />

            {/* Country, City, and Postcode on same line */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                <div className="md:col-span-4">
                    <Controller
                        name="country"
                        control={control}
                        rules={{
                            required: intl.formatMessage({
                                defaultMessage: "Country is required",
                                description: "Country required validation message"
                            })
                        }}
                        render={({field}) => (
                            <InputField
                                label={
                                    <FormattedMessage
                                        defaultMessage="Country"
                                        description="Label for country input"
                                    />
                                }
                                error={errors.country?.message}
                                required
                            >
                                <CountrySelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={!!errors.country}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "Select country",
                                        description: "Placeholder for country selector"
                                    })}
                                />
                            </InputField>
                        )}
                    />
                </div>

                <div className="md:col-span-3">
                    <Controller
                        name="city"
                        control={control}
                        rules={{
                            required: intl.formatMessage({
                                defaultMessage: "City is required",
                                description: "City required validation message"
                            })
                        }}
                        render={({field}) => (
                            <InputField
                                label={
                                    <FormattedMessage
                                        defaultMessage="City"
                                        description="Label for city input"
                                    />
                                }
                                error={errors.city?.message}
                                required
                            >
                                <Input
                                    {...field}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "New York",
                                        description: "Placeholder for city input"
                                    })}
                                />
                            </InputField>
                        )}
                    />
                </div>

                <div className="md:col-span-3">
                    <Controller
                        name="postcode"
                        control={control}
                        rules={{
                            required: intl.formatMessage({
                                defaultMessage: "Postcode is required",
                                description: "Postcode required validation message"
                            })
                        }}
                        render={({field}) => (
                            <InputField
                                label={
                                    <FormattedMessage
                                        defaultMessage="Postcode"
                                        description="Label for postcode input"
                                    />
                                }
                                error={errors.postcode?.message}
                                required
                            >
                                <Input
                                    {...field}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "10001",
                                        description: "Placeholder for postcode input"
                                    })}
                                />
                            </InputField>
                        )}
                    />
                </div>
            </div>

            <Separator orientation={'horizontal'} className={'my-8'} />

            <Controller
                name="brandName"
                control={control}
                rules={{
                    required: intl.formatMessage({
                        defaultMessage: "Brand name is required",
                        description: "Brand name required validation message"
                    }),
                    minLength: {
                        value: 2,
                        message: intl.formatMessage({
                            defaultMessage: "Brand name must be at least 2 characters",
                            description: "Brand name min length validation message"
                        })
                    }
                }}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Brand Name"
                                description="Label for brand name input"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="Your company or property name shown in guest communications and payment links."
                                description="Description for brand name field"
                            />
                        }
                        error={errors.brandName?.message}
                        required
                    >
                        <Input
                            {...field}
                            className="w-full max-w-sm"
                            placeholder={intl.formatMessage({
                                defaultMessage: "e.g., Sunset Beach Rentals",
                                description: "Placeholder for brand name input"
                            })}
                        />
                    </InputField>
                )}
            />

            {/* Logo Upload */}
            <InputField
                label={
                    <FormattedMessage
                        defaultMessage="Brand Logo"
                        description="Label for logo upload input"
                    />
                }
                description={
                    <FormattedMessage
                        defaultMessage="Displayed on payment links and guest communications."
                        description="Description for logo upload field"
                    />
                }
                optional
            >
                <div className="w-full relative">
                    <FileUpload
                        value={logoFile}
                        onChange={setLogoFile}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024}
                        currentUploadedFile={existingLogo ? {
                            url: existingLogo.medium,
                            name: existingLogo.file_name,
                        } : undefined}
                        autoUpload
                        onUpload={handleLogoUpload}
                        placeholder={
                            existingLogo && !logoFile
                                ? intl.formatMessage({
                                    defaultMessage: "Drop new logo here or click to replace.",
                                    description: "Placeholder for logo upload when logo exists"
                                })
                                : intl.formatMessage({
                                    defaultMessage: "Drop logo here or click to browse",
                                    description: "Placeholder for logo upload"
                                })
                        }
                    />
                </div>
            </InputField>

            <Separator orientation={'horizontal'} className={'my-8'} />

            {/* Display Currency */}
            <Controller
                name="displayCurrency"
                control={control}
                rules={{
                    required: intl.formatMessage({
                        defaultMessage: "Display currency is required",
                        description: "Currency required validation message"
                    })
                }}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Display Currency"
                                description="Label for display currency selector"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="Used to display aggregated financial data across all properties. Each property will have its own booking currency."
                                description="Description for display currency field"
                            />
                        }
                        error={errors.displayCurrency?.message}
                        required
                    >
                        <CurrencySelect
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={!!errors.displayCurrency}
                            className="w-full max-w-sm"
                            placeholder={intl.formatMessage({
                                defaultMessage: "Select currency",
                                description: "Placeholder for currency selector"
                            })}
                        />
                    </InputField>
                )}
            />

            {/* Display Timezone */}
            <Controller
                name="displayTimezone"
                control={control}
                rules={{
                    required: intl.formatMessage({
                        defaultMessage: "Display timezone is required",
                        description: "Timezone required validation message"
                    })
                }}
                render={({field}) => (
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Display Timezone"
                                description="Label for display timezone selector"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="Used to display timestamps throughout the dashboard. Each property will have its own timezone."
                                description="Description for display timezone field"
                            />
                        }
                        error={errors.displayTimezone?.message}
                        required
                    >
                        <TimezoneSelect
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={!!errors.displayTimezone}
                            className="w-full max-w-sm"
                            placeholder={intl.formatMessage({
                                defaultMessage: "Select timezone",
                                description: "Placeholder for timezone selector"
                            })}
                        />
                    </InputField>
                )}
            />

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
                <Button
                    variant="outline"
                    className="flex-1"
                    disabled={saveMainSettings.isPending}
                    onClick={props.onBack}
                >
                    <FormattedMessage
                        defaultMessage="Back"
                        description="Back button label"
                    />
                </Button>
                <Button
                    className="flex-1"
                    disabled={saveMainSettings.isPending}
                    onClick={handleSubmit(onSubmit)}
                >
                    <FormattedMessage
                        defaultMessage="Continue"
                        description="Continue button label"
                    />
                </Button>
            </div>
        </div>
    </>;
}
