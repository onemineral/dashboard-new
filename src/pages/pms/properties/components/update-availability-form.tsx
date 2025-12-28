import {FormattedMessage, useIntl} from "react-intl";
import {Controller, useForm} from "react-hook-form";
import ResourceInput from "@/components/application/inputs/resource-input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useMutation} from "@tanstack/react-query";
import api from "@/lib/api.ts";
import {toast} from "sonner";
import {z} from "zod";
import {useZodSchema} from "@/hooks/use-zod-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {Property} from "@sdk/generated";
import {DateRange} from "@sdk/generated/shared.ts";
import {AvailabilityStatusSelect} from "@/components/application/inputs/availability-status-select.tsx";
import {InputField} from "@/components/application/inputs/input-field.tsx";

interface UpdateAvailabilityFormData {
    daterange: DateRange;
    availability_status: string;
    notes?: string | null;
}

export default function UpdateAvailabilityForm({property, daterange, onClose, onBack}: {
    onBack: () => void;
    onClose: () => void;
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
        availability_status: z.string({
            required_error: intl.formatMessage({
                defaultMessage: "Availability status is required",
                description: "Error message when availability status is required but not selected"
            })
        }),
        notes: z.string().optional().nullable(),
    });

    // Filter schema based on permissions
    const validationSchema = useZodSchema('property', 'set-availability', fullSchema);

    const form = useForm<UpdateAvailabilityFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            daterange: daterange || undefined,
            availability_status: undefined,
            notes: undefined,
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: UpdateAvailabilityFormData) => {
            return (await api.property.setAvailability({
                property: property.id,
                ...data,
            })).response;
        },
        onSuccess: () => {
            toast.success(intl.formatMessage({
                defaultMessage: "Availability updated successfully",
                description: "Success message after updating availability"
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
        onError: (error: any) => {
            toast.error(error?.message || intl.formatMessage({
                defaultMessage: "Failed to update availability",
                description: "Error message when availability update fails"
            }));

            console.log(error.responseBody?.errors);
        }
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
              className="space-y-4 flex-1 flex flex-col mt-4 px-4">
            <div className="space-y-1">
                <h3 className="font-medium text-center text-foreground">
                    <FormattedMessage
                        defaultMessage="Update availability for selected dates"
                        description="Title for updating availability information"
                    />
                </h3>
            </div>

            <div className="space-y-4">
                <Controller
                    name="availability_status"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <InputField label={intl.formatMessage({
                            defaultMessage: 'Availability',
                            description: 'Label for availability selector (will have 2 options: available and unavailable)'
                        })} error={fieldState.error?.message}>
                            <AvailabilityStatusSelect
                                selectFirstItem={true}
                                placeholder={''}
                                valueType={'id'}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                value={field.value}
                                allowedTypes={['unavailable', 'available']}
                            />
                        </InputField>
                    )}
                />

                <Controller
                    name="notes"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <ResourceInput
                            resource={'property'}
                            field={'notes'}
                            action={'set-availability'}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            infoTooltip={intl.formatMessage({
                                defaultMessage: "Add optional notes to document the reason for this availability change. These notes will be saved in the availability history for future reference.",
                                description: "Tooltip explaining the notes field in update availability form"
                            })}
                        />
                    )}
                />
            </div>
        </form>

        <div className="flex gap-2 p-4">
            <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onBack}
            >
                <FormattedMessage
                    defaultMessage="Back"
                    description="Button text to go back to previous screen"
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
                        description="Button text while saving the calendar updates"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Update"
                        description="Button text to update the selected dates"
                    />
                )}
            </Button>
        </div>
    </>;
}