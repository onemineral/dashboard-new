import {FormattedMessage, useIntl} from "react-intl";
import {Controller, useForm} from "react-hook-form";
import ResourceInput from "@/components/application/inputs/resource-input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMutation} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {toast} from "sonner";
import {useMutationErrorHandler} from "@/hooks/use-mutation-error-handler.ts";
import {z} from "zod";
import {useZodSchema} from "@/hooks/use-zod-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {Property} from "@sdk/generated";
import {DateRange} from "@sdk/generated/shared.ts";

interface CalendarUpdateFormData {
    daterange: DateRange;
    availability_status?: string;
    rate?: number;
    min_stay?: number;
}

export default function SimpleCalendarUpdateForm({property, daterange, onClose, onBack}: {
    onClose: () => void;
    onBack: () => void;
    property: Property;
    daterange: { start: string; end: string } | null
}) {
    const intl = useIntl();

    // Define the full schema with all possible fields
    const fullSchema = z.object({
        daterange: z.object({
            start: z.union([z.string(), z.date()]).optional(),
            end: z.union([z.string(), z.date()]).optional(),
        }).refine((val) => val.start && val.end, {
            message: intl.formatMessage({
                defaultMessage: "Please select a date range",
                description: "Error message when date range is required but not selected"
            })
        }),
        rate: z.number({
            invalid_type_error: intl.formatMessage({
                defaultMessage: "Rate must be a valid number",
                description: "Error message when rate is not a valid number"
            })
        }).positive(intl.formatMessage({
            defaultMessage: "Rate must be a positive number",
            description: "Error message when rate is not a positive number"
        })).optional().nullable(),
        min_stay: z.number({
            invalid_type_error: intl.formatMessage({
                defaultMessage: "Minimum stay must be a valid number",
                description: "Error message when minimum stay is not a valid number"
            })
        }).int().positive(intl.formatMessage({
            defaultMessage: "Minimum stay must be a positive number",
            description: "Error message when minimum stay is not a positive number"
        })).optional().nullable(),
    });

    // Filter schema based on permissions
    const validationSchema = useZodSchema('property', 'set-rates-availability', fullSchema);

    const form = useForm<CalendarUpdateFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            daterange: daterange || undefined,
            rate: undefined,
            min_stay: undefined,
        }
    });

    const handleMutationError = useMutationErrorHandler(form, {
        validationMessage: intl.formatMessage({
            defaultMessage: "Please check the form for errors",
            description: "Error message when form validation fails"
        }),
        genericMessage: intl.formatMessage({
            defaultMessage: "Failed to update calendar",
            description: "Error message when calendar update fails"
        })
    });

    const mutation = useMutation({
        mutationFn: async (data: CalendarUpdateFormData) => {
            return (await api.property.setRatesAvailability({
                property: property.id,
                ...data,
            })).response;
        },
        onSuccess: () => {
            toast.success(intl.formatMessage({
                defaultMessage: "Calendar updated successfully",
                description: "Success message after updating calendar rates and availability"
            }));

            // Emit custom event for calendar update success
            window.dispatchEvent(new CustomEvent('multicalendar:calendar-updated', {
                detail: {
                    property: property,
                    daterange: form.getValues('daterange')
                }
            }));

            onClose();
        },
        onError: handleMutationError
    });

    useEffect(() => {
        if (daterange) {
            form.setValue('daterange', daterange);
        }
    }, [daterange, form]);

    const onSubmit = form.handleSubmit((data) => {
        // @ts-ignore
        mutation.mutate(data);
    });

    return <>
        <form onSubmit={onSubmit}
              className="space-y-4 flex-1 flex flex-col mt-4">
            <div className="space-y-4">
                    <Controller
                        name="rate"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <ResourceInput
                                resource={'property'}
                                field={'rate'}
                                placeholder={''}
                                action={'set-rates-availability'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                options={{currency: property.currency}}
                                infoTooltip={intl.formatMessage({
                                    defaultMessage: "Set the base nightly rate for this period. The final price charged to guests may include additional fees such as extra guest charges, length-of-stay discounts, and promotional offers.",
                                    description: "Tooltip explaining the base rate field in calendar update form"
                                })}
                            />
                        )}
                    />

                    <Controller
                        name="min_stay"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <ResourceInput
                                resource={'property'}
                                placeholder={''}
                                field={'min_stay'}
                                action={'set-rates-availability'}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                options={{currency: property.currency}}
                                infoTooltip={intl.formatMessage({
                                    defaultMessage: "Set the minimum number of nights required for bookings with check-in dates within this period. Guests will not be able to book stays shorter than this duration.",
                                    description: "Tooltip explaining the minimum stay field in calendar update form"
                                })}
                            />
                        )}
                    />
            </div>
        </form>

        <div className="flex gap-2 py-4">
            <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onBack}
            >
                <FormattedMessage
                    defaultMessage="Back"
                    description="Button text to go back from the form"
                />
            </Button>
            <Button
                type="submit"
                className="flex-1"
                onClick={onSubmit}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <FormattedMessage
                        defaultMessage="Saving..."
                        description="Button text while saving the form"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Save Changes"
                        description="Button text to save the form"
                    />
                )}
            </Button>
        </div>
    </>;
}