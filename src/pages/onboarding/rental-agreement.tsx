import {FormattedMessage, useIntl} from "react-intl";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useForm, Controller} from "react-hook-form";
import {useRef, useEffect} from "react";
import OnboardingProgress from "@/pages/onboarding/components/progress.tsx";
import {InputField} from "@/components/application/inputs/input-field.tsx";
import {Textarea} from "@/components/application/inputs/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {OnboardingStepProps} from "@/pages/onboarding/index.tsx";
import {Loader2} from "lucide-react";
import api from "@/lib/api.ts";
import {RadioCard} from "@/components/application/inputs/radio-card-group.tsx";
import {RadioGroup} from "@/components/ui/radio-group.tsx";

type AgreementType = 'vacation-rental' | 'custom';
type CancellationPolicy = 'flexible' | 'strict' | 'non-refundable' | 'custom';

// Detailed descriptions to send to LLM for consistent interpretation
const AGREEMENT_TYPE_DESCRIPTIONS = {
    'vacation-rental': 'Short-term vacation rental agreement for stays typically between 1 night and 30 days. Guest-friendly language covering security deposits, damage liability, check-in/check-out procedures, cancellation policies, house rules, payment terms, property access, and basic liability. Suitable for Airbnb, VRBO, or direct bookings. Emphasizes hospitality while maintaining necessary protections.',
};

const CANCELLATION_POLICY_DESCRIPTIONS = {
    'flexible': `Flexible cancellation policy:
    • Full refund if cancelled at least 24 hours before check-in
    • Non-refundable within 24 hours of check-in`,

    'strict': `Strict cancellation policy:
    • Full refund if cancelled 30+ days before check-in
    • 50% refund if cancelled 7-30 days before check-in
    • No refund if cancelled less than 7 days before check-in`,

    'non-refundable': `Non-refundable cancellation policy:
    • No refunds for cancellations at any time`,
};

interface RentalAgreementFormData {
    agreementType: AgreementType;
    customAgreementType: string;
    cancellationPolicy: CancellationPolicy;
    customCancellationPolicy: string;
    houseRules: {
        noSmoking: boolean;
        noPets: boolean;
        noParties: boolean;
        quietHours: boolean;
    };
    customHouseRules: string;
    additionalInstructions: string;
}

/**
 * OnboardingRentalAgreement Component
 *
 * Step in the onboarding process where users can generate their rental agreement
 * using AI-powered generation with customizable options and natural language instructions.
 *
 * Features:
 * - Quick-select presets for agreement type and cancellation policy
 * - Custom natural language options for full flexibility
 * - House rules selection with custom additions
 * - Additional instructions field for specific requirements
 * - Immediate text editing after generation
 * - Regeneration capability with different options
 *
 * @example
 * ```tsx
 * <OnboardingRentalAgreement
 *   onSave={() => {}}
 *   onBack={() => {}}
 *   currentStep={5}
 *   totalSteps={5}
 * />
 * ```
 */
export default function OnboardingRentalAgreement(props: OnboardingStepProps) {
    const intl = useIntl();
    const customAgreementRef = useRef<HTMLTextAreaElement>(null);
    const customCancellationRef = useRef<HTMLTextAreaElement>(null);
    const queryClient = useQueryClient();

    // React Hook Form setup
    const {control, handleSubmit, watch, setValue, formState: {errors}} = useForm<RentalAgreementFormData>({
        defaultValues: {
            agreementType: 'vacation-rental',
            customAgreementType: '',
            cancellationPolicy: 'strict',
            customCancellationPolicy: '',
            houseRules: {
                noSmoking: true,
                noPets: true,
                noParties: true,
                quietHours: true,
            },
            customHouseRules: '',
            additionalInstructions: '',
        },
        mode: 'onChange',
    });

    // Watch for custom selections
    const agreementType = watch('agreementType');
    const cancellationPolicy = watch('cancellationPolicy');

    // Auto-focus textareas when custom options are selected
    useEffect(() => {
        if (agreementType === 'custom' && customAgreementRef.current) {
            // Small delay to ensure the textarea is visible
            setTimeout(() => {
                customAgreementRef.current?.focus();
            }, 100);
        }
    }, [agreementType]);

    useEffect(() => {
        if (cancellationPolicy === 'custom' && customCancellationRef.current) {
            // Small delay to ensure the textarea is visible
            setTimeout(() => {
                customCancellationRef.current?.focus();
            }, 100);
        }
    }, [cancellationPolicy]);

    // Generate mutation
    const generateMutation = useMutation({
        mutationFn: async (data: RentalAgreementFormData) => {
            const agreementType: string = data.agreementType == 'custom' ? data.customAgreementType : AGREEMENT_TYPE_DESCRIPTIONS[data.agreementType];
            const cancellationPolicy: string = data.cancellationPolicy == 'custom' ? data.customCancellationPolicy : CANCELLATION_POLICY_DESCRIPTIONS[data.cancellationPolicy];
            const houseRules: string = `${data.houseRules.noSmoking && '- No smoking on premises\n'}${data.houseRules.noPets && '- No pets allowed\n'}${data.houseRules.noParties && '- No parties or events\n'}${data.houseRules.quietHours && '- Quiet hours: 10pm - 8am\n\n'}${data.customHouseRules && `- ${data.customHouseRules}`}`;

            await api.rentalAgreement.generate({
                agreement_tye: agreementType,
                cancellation_policy: cancellationPolicy,
                house_rules: houseRules,
                additional_instructions: data.additionalInstructions
            });

            await queryClient.refetchQueries({queryKey: ['settings']});
        },
        onSuccess: () => {
            props.onSave();
        },
        onError: (error) => {
            console.error('Failed to generate rental agreement:', error);
        },
    });

    const handleGenerate = (data: RentalAgreementFormData) => {
        generateMutation.mutate(data);
    };

    return (
        <>
            <h1 className="text-xl flex-1 font-medium text-balance">
                <FormattedMessage
                    defaultMessage="Generate Your Rental Agreement"
                    description="Page title for AI-powered rental agreement generation tool during onboarding"
                />
            </h1>
            <p className="text-muted-foreground">
                <FormattedMessage
                    defaultMessage="Create a customized rental agreement in seconds using AI, then fine-tune it to your needs."
                    description="Explanation that users can generate a rental contract automatically with AI and edit it afterwards"
                />
            </p>

            <OnboardingProgress currentStep={props.currentStep} totalSteps={props.totalSteps} className="my-8"/>

            {/* Options Form */}
            <div className="w-full space-y-6">
                {/* Agreement Type Section */}
                <div className="space-y-3">
                    <h2 className="text-lg font-medium">
                        <FormattedMessage
                            defaultMessage="Agreement Type"
                            description="Section heading for selecting the type of rental agreement (vacation rental or custom)"
                        />
                    </h2>
                    <Controller
                        name="agreementType"
                        control={control}
                        render={({field}) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                                <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
                                    <RadioCard
                                        value="vacation-rental"
                                        title={
                                            <FormattedMessage
                                                defaultMessage="Vacation Rental Agreement"
                                                description="Option for a standard vacation rental agreement for short-term stays"
                                            />
                                        }
                                        isSelected={agreementType === 'vacation-rental'}
                                        onSelect={() => setValue('agreementType', 'vacation-rental')}
                                        hideChildrenUntilSelected
                                    >
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            <FormattedMessage
                                                defaultMessage="Guest-friendly agreement for short-term stays (1-30 nights). Perfect for Airbnb, VRBO, or direct bookings. Covers deposits, cancellation policy, check-in/out procedures, house rules, and guest responsibilities."
                                                description="Detailed explanation of what a vacation rental agreement includes and when to use it"
                                            />
                                        </p>
                                    </RadioCard>

                                    <RadioCard
                                        value="custom"
                                        title={
                                            <FormattedMessage
                                                defaultMessage="Custom"
                                                description="Option to describe a custom rental agreement type in the user's own words"
                                            />
                                        }
                                        isSelected={agreementType === 'custom'}
                                        onSelect={() => setValue('agreementType', 'custom')}
                                        hideChildrenUntilSelected
                                    >
                                        <div>
                                            <InputField error={errors?.customAgreementType?.message}>
                                                <Controller
                                                    name="customAgreementType"
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => {
                                                            if (agreementType === 'custom' && !value?.trim()) {
                                                                return intl.formatMessage({
                                                                    defaultMessage: "Please describe your custom agreement type",
                                                                    description: "Error message when user selects custom agreement type but doesn't provide a description"
                                                                });
                                                            }
                                                            return true;
                                                        }
                                                    }}
                                                    render={({field}) => (
                                                        <Textarea
                                                            ref={customAgreementRef}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            placeholder={intl.formatMessage({
                                                                defaultMessage: "Describe in your own words",
                                                                description: "Placeholder text prompting user to describe their custom agreement type"
                                                            })}
                                                            rows={2}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onFocus={() => {
                                                                if (agreementType !== 'custom') {
                                                                    setValue('agreementType', 'custom');
                                                                }
                                                            }}
                                                            className="bg-background border-none focus-visible:ring-0 shadow-none"
                                                        />
                                                    )}
                                                />
                                            </InputField>
                                        </div>
                                    </RadioCard>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* Cancellation Policy Section */}
                <div className="space-y-3">
                    <h2 className="text-lg font-medium">
                        <FormattedMessage
                            defaultMessage="Cancellation Policy"
                            description="Section heading for selecting refund terms when guests cancel bookings"
                        />
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        <FormattedMessage
                            defaultMessage="This policy will apply to bookings on your website and VRBO. Other OTAs like Airbnb and Booking.com have their own cancellation policies that will apply instead."
                            description="Note explaining that this cancellation policy only applies to direct bookings and VRBO, not to other booking platforms"
                        />
                    </p>
                    <Controller
                        name="cancellationPolicy"
                        control={control}
                        render={({field}) => (
                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                                <div className="grid grid-cols-1 @md:grid-cols-2 gap-3">
                                    <RadioCard
                                        value="flexible"
                                        title={
                                            <FormattedMessage
                                                defaultMessage="Flexible"
                                                description="Most guest-friendly cancellation policy option (full refund up to 24 hours before check-in)"
                                            />
                                        }
                                        isSelected={cancellationPolicy === 'flexible'}
                                        onSelect={() => setValue('cancellationPolicy', 'flexible')}
                                        hideChildrenUntilSelected
                                    >
                                        <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Full refund if cancelled at least 24 hours before check-in"
                                                    description="First rule of flexible cancellation policy: guests get full refund if canceling 24+ hours before arrival"
                                                />
                                            </div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Non-refundable within 24 hours of check-in"
                                                    description="Second rule of flexible cancellation policy: no refunds within 24 hours before check-in or after"
                                                />
                                            </div>
                                        </div>
                                    </RadioCard>

                                    <RadioCard
                                        value="strict"
                                        title={
                                            <FormattedMessage
                                                defaultMessage="Strict (Recommended)"
                                                description="Balanced cancellation policy option with moderate protection (recommended for most hosts)"
                                            />
                                        }
                                        isSelected={cancellationPolicy === 'strict'}
                                        onSelect={() => setValue('cancellationPolicy', 'strict')}
                                        hideChildrenUntilSelected
                                    >
                                        <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="Full refund if cancelled 30+ days before check-in"
                                                    description="First rule of strict cancellation policy: full refund for cancellations 30+ days in advance"
                                                />
                                            </div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="50% refund if cancelled 7-30 days before check-in"
                                                    description="Second rule of strict cancellation policy: partial refund 7-30 days before check-in"
                                                />
                                            </div>
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="No refund if cancelled less than 7 days before check-in"
                                                    description="Third rule of strict cancellation policy: no refund less than 7 days before check-in"
                                                />
                                            </div>
                                        </div>
                                    </RadioCard>

                                    <RadioCard
                                        value="non-refundable"
                                        title={
                                            <FormattedMessage
                                                defaultMessage="Non-Refundable"
                                                description="Strictest policy option: no refunds at any time (usually offered at discounted rates)"
                                            />
                                        }
                                        isSelected={cancellationPolicy === 'non-refundable'}
                                        onSelect={() => setValue('cancellationPolicy', 'non-refundable')}
                                        hideChildrenUntilSelected
                                    >
                                        <div className="text-xs text-muted-foreground leading-relaxed space-y-1.5">
                                            <div>
                                                <FormattedMessage
                                                    defaultMessage="No refunds for cancellations at any time"
                                                    description="Rule of non-refundable cancellation policy: guests never get refunds regardless of when they cancel"
                                                />
                                            </div>
                                        </div>
                                    </RadioCard>

                                    <RadioCard
                                        value="custom"
                                        title={
                                            <FormattedMessage
                                                defaultMessage="Custom"
                                                description="Option to define a custom cancellation policy in the user's own words"
                                            />
                                        }
                                        isSelected={cancellationPolicy === 'custom'}
                                        onSelect={() => setValue('cancellationPolicy', 'custom')}
                                        hideChildrenUntilSelected
                                    >
                                        <div>
                                            <InputField error={errors?.customCancellationPolicy?.message}>
                                                <Controller
                                                    name="customCancellationPolicy"
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => {
                                                            if (cancellationPolicy === 'custom' && !value?.trim()) {
                                                                return intl.formatMessage({
                                                                    defaultMessage: "Please describe your custom cancellation policy",
                                                                    description: "Error message when user selects custom cancellation policy but doesn't provide details"
                                                                });
                                                            }
                                                            return true;
                                                        }
                                                    }}
                                                    render={({field}) => (
                                                        <Textarea
                                                            ref={customCancellationRef}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            placeholder={intl.formatMessage({
                                                                defaultMessage: "Describe your cancellation terms and refund policy",
                                                                description: "Placeholder text prompting user to describe their custom cancellation and refund terms"
                                                            })}
                                                            rows={3}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onFocus={() => {
                                                                if (cancellationPolicy !== 'custom') {
                                                                    setValue('cancellationPolicy', 'custom');
                                                                }
                                                            }}
                                                            className="bg-background border-none focus-visible:ring-0 shadow-none"
                                                        />
                                                    )}
                                                />
                                            </InputField>
                                        </div>
                                    </RadioCard>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* House Rules Section */}
                <div className="space-y-3">
                    <h2 className="text-lg font-medium">
                        <FormattedMessage
                            defaultMessage="Key House Rules"
                            description="Section heading for selecting common property rules (smoking, pets, parties, quiet hours)"
                        />
                    </h2>
                    <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                        <Controller
                            name="houseRules.noSmoking"
                            control={control}
                            render={({field}) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-smoking"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <label
                                        htmlFor="no-smoking"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        <FormattedMessage
                                            defaultMessage="No Smoking"
                                            description="Checkbox label for rule prohibiting smoking on the property"
                                        />
                                    </label>
                                </div>
                            )}
                        />

                        <Controller
                            name="houseRules.noPets"
                            control={control}
                            render={({field}) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-pets"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <label
                                        htmlFor="no-pets"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        <FormattedMessage
                                            defaultMessage="No Pets"
                                            description="Checkbox label for rule prohibiting pets/animals on the property"
                                        />
                                    </label>
                                </div>
                            )}
                        />

                        <Controller
                            name="houseRules.noParties"
                            control={control}
                            render={({field}) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-parties"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <label
                                        htmlFor="no-parties"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        <FormattedMessage
                                            defaultMessage="No Parties/Events"
                                            description="Checkbox label for rule prohibiting parties and events on the property"
                                        />
                                    </label>
                                </div>
                            )}
                        />

                        <Controller
                            name="houseRules.quietHours"
                            control={control}
                            render={({field}) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="quiet-hours"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <label
                                        htmlFor="quiet-hours"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        <FormattedMessage
                                            defaultMessage="Quiet Hours (10pm-8am)"
                                            description="Checkbox label for quiet hours rule requiring guests to be quiet between 10pm and 8am"
                                        />
                                    </label>
                                </div>
                            )}
                        />
                    </div>

                    <InputField
                        className={'mt-6'}
                        label={
                            <FormattedMessage
                                defaultMessage="Additional House Rules"
                                description="Label for text input where users can add house rules not covered by the checkboxes"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="Add any specific rules not listed above"
                                description="Help text explaining users can enter custom house rules beyond the standard options"
                            />
                        }
                        optional
                    >
                        <Controller
                            name="customHouseRules"
                            control={control}
                            render={({field}) => (
                                <Textarea
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={3}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "e.g., No shoes inside, outdoor shower must be used for beach equipment, maximum 2 vehicles in driveway",
                                        description: "Example text showing the type of custom house rules users can add (shoes, outdoor shower, parking)"
                                    })}
                                />
                            )}
                        />
                    </InputField>
                </div>

                {/* Additional Instructions */}
                <div className="space-y-3">
                    <InputField
                        label={
                            <FormattedMessage
                                defaultMessage="Specific Requirements"
                                description="Label for text input where users can specify custom clauses or requirements for the rental agreement"
                            />
                        }
                        description={
                            <FormattedMessage
                                defaultMessage="Describe any other specific clauses, policies, or details you want included in the agreement"
                                description="Help text explaining users can add any additional legal clauses or special requirements to the rental agreement"
                            />
                        }
                        optional
                    >
                        <Controller
                            name="additionalInstructions"
                            control={control}
                            render={({field}) => (
                                <Textarea
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    rows={4}
                                    maxCharacters={1000}
                                    placeholder={intl.formatMessage({
                                        defaultMessage: "e.g., Include hot tub safety rules, mention parking policy for 2 cars, add clause about respecting neighbors, explain pool heating charges...",
                                        description: "Example text showing specific clauses users might add (hot tub safety, parking, neighbors, pool heating)"
                                    })}
                                />
                            )}
                        />
                    </InputField>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 pt-4">
                <Button
                    className="flex-1"
                    onClick={handleSubmit(handleGenerate)}
                    disabled={generateMutation.isPending}
                >
                    {generateMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin"/>
                            <FormattedMessage
                                defaultMessage="Saving..."
                                description="Button text shown while api request is made"
                            />
                        </>
                    ) : (
                        <FormattedMessage
                            defaultMessage="Continue"
                            description="Button text"
                        />
                    )}
                </Button>
            </div>
        </>
    );
}