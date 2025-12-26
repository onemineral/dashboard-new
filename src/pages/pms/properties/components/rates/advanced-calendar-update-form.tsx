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
import {useEffect, useMemo, useState} from "react";
import {Property} from "@sdk/generated";
import {DateRange} from "@sdk/generated/shared.ts";
import {parseISO, getDay, eachDayOfInterval} from "date-fns";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {PlaneLanding, PlaneTakeoff} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {cn} from "@/lib/utils.ts";

interface DaySettings {
    rate?: number | null;
    min_stay?: number | null;
    checkin_restricted?: boolean | null;
    checkout_restricted?: boolean | null;
}

/**
 * RestrictionIconButton - Icon button with popover for check-in/check-out restrictions
 *
 * Props:
 * - type: 'checkin' | 'checkout' - Type of restriction
 * - value: boolean | null | undefined - Current restriction value
 * - onChange: (value: boolean | null) => void - Change handler
 * - disabled: boolean - Whether the button is disabled
 */
interface RestrictionIconButtonProps {
    type: 'checkin' | 'checkout';
    value: boolean | null | undefined;
    onChange: (value: boolean | null) => void;
    disabled?: boolean;
}

function RestrictionIconButton({ type, value, onChange, disabled }: RestrictionIconButtonProps) {
    const intl = useIntl();
    const [open, setOpen] = useState(false);
    
    const currentValue =
        value === null || value === undefined
            ? 'no-change'
            : value
            ? 'restricted'
            : 'allowed';
    
    const Icon = type === 'checkin' ? PlaneLanding : PlaneTakeoff;
    
    const title = type === 'checkin'
        ? intl.formatMessage({
            defaultMessage: "Check-in Restriction",
            description: "Title for check-in restriction popover"
          })
        : intl.formatMessage({
            defaultMessage: "Check-out Restriction",
            description: "Title for check-out restriction popover"
          });
    
    const handleSelect = (newValue: boolean | null) => {
        onChange(newValue);
        setOpen(false);
    };
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        currentValue === 'allowed' && "text-green-600 hover:text-green-700",
                        currentValue === 'restricted' && "text-red-600 hover:text-red-700",
                        currentValue === 'no-change' && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <Icon className={'size-4'} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-60 p-3" align="center">
                <div className="space-y-2">
                    <h4 className="text-sm mb-3 text-muted-foreground">{title}</h4>
                    <div className="space-y-1">
                        <Button
                            variant={currentValue === 'no-change' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleSelect(null)}
                        >
                            <span className={'h-3 w-1 bg-muted-foreground'}></span>
                            <FormattedMessage
                                defaultMessage="No change"
                                description="Option for no change in restrictions"
                            />
                        </Button>
                        <Button
                            variant={currentValue === 'allowed' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleSelect(false)}
                        >
                            <span className={'h-3 w-1 bg-green-600'}></span>
                            <FormattedMessage
                                defaultMessage="Allow"
                                description="Option to allow check-in or check-out"
                            />
                        </Button>
                        <Button
                            variant={currentValue === 'restricted' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleSelect(true)}
                        >
                            <span className={'h-3 w-1 bg-red-600'}></span>
                            <FormattedMessage
                                defaultMessage="Restrict"
                                description="Option to restrict check-in or check-out"
                            />
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

interface AdvancedCalendarUpdateFormData {
    daterange: DateRange;
    advanced?: {
        monday?: DaySettings;
        tuesday?: DaySettings;
        wednesday?: DaySettings;
        thursday?: DaySettings;
        friday?: DaySettings;
        saturday?: DaySettings;
        sunday?: DaySettings;
    };
}

const getDaysOfWeek = (intl: ReturnType<typeof useIntl>) => [
    {
        key: 'monday' as const,
        label: intl.formatMessage({ defaultMessage: 'Monday', description: 'Day of week: Monday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Mon', description: 'Short day of week: Monday' }),
        dayIndex: 1
    },
    {
        key: 'tuesday' as const,
        label: intl.formatMessage({ defaultMessage: 'Tuesday', description: 'Day of week: Tuesday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Tue', description: 'Short day of week: Tuesday' }),
        dayIndex: 2
    },
    {
        key: 'wednesday' as const,
        label: intl.formatMessage({ defaultMessage: 'Wednesday', description: 'Day of week: Wednesday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Wed', description: 'Short day of week: Wednesday' }),
        dayIndex: 3
    },
    {
        key: 'thursday' as const,
        label: intl.formatMessage({ defaultMessage: 'Thursday', description: 'Day of week: Thursday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Thu', description: 'Short day of week: Thursday' }),
        dayIndex: 4
    },
    {
        key: 'friday' as const,
        label: intl.formatMessage({ defaultMessage: 'Friday', description: 'Day of week: Friday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Fri', description: 'Short day of week: Friday' }),
        dayIndex: 5
    },
    {
        key: 'saturday' as const,
        label: intl.formatMessage({ defaultMessage: 'Saturday', description: 'Day of week: Saturday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Sat', description: 'Short day of week: Saturday' }),
        dayIndex: 6
    },
    {
        key: 'sunday' as const,
        label: intl.formatMessage({ defaultMessage: 'Sunday', description: 'Day of week: Sunday' }),
        shortLabel: intl.formatMessage({ defaultMessage: 'Sun', description: 'Short day of week: Sunday' }),
        dayIndex: 0
    },
];

export default function AdvancedCalendarUpdateForm({property, daterange, onClose, onBack}: {
    onClose: () => void;
    onBack: () => void;
    property: Property;
    daterange: { start: string; end: string } | null
}) {
    const intl = useIntl();
    const daysOfWeek = getDaysOfWeek(intl);

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
        advanced: z.object({
            monday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
            tuesday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
            wednesday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
            thursday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
            friday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
            saturday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
            sunday: z.object({
                rate: z.number().positive().optional().nullable(),
                min_stay: z.number().int().positive().optional().nullable(),
                checkin_restricted: z.boolean().optional().nullable(),
                checkout_restricted: z.boolean().optional().nullable(),
            }).optional(),
        }).optional(),
    });

    // Filter schema based on permissions
    const validationSchema = useZodSchema('property', 'set-rates-availability', fullSchema);

    const form = useForm<AdvancedCalendarUpdateFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            daterange: daterange || undefined,
            advanced: {
                monday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
                tuesday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
                wednesday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
                thursday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
                friday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
                saturday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
                sunday: { rate: undefined, min_stay: undefined, checkin_restricted: undefined, checkout_restricted: undefined },
            }
        }
    });

    const dateRangeValue = form.watch('daterange');

    // Calculate which days are in the selected date range
    const activeDays = useMemo(() => {
        if (!dateRangeValue?.start || !dateRangeValue?.end) {
            return new Set<number>();
        }

        try {
            const startDate = typeof dateRangeValue.start === 'string' 
                ? parseISO(dateRangeValue.start) 
                : dateRangeValue.start;
            const endDate = typeof dateRangeValue.end === 'string' 
                ? parseISO(dateRangeValue.end) 
                : dateRangeValue.end;

            const days = eachDayOfInterval({ start: startDate, end: endDate });
            const dayIndices = days.map(date => getDay(date));
            return new Set(dayIndices);
        } catch {
            return new Set<number>();
        }
    }, [dateRangeValue]);

    const handleMutationError = useMutationErrorHandler(form);

    const mutation = useMutation({
        mutationFn: async (data: AdvancedCalendarUpdateFormData) => {
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
        mutation.mutate(data);
    });

    return <>
        <form onSubmit={onSubmit}
              className="space-y-4 flex-1 flex flex-col w-full mt-4">
            <div className="space-y-4">
                {/* Day of Week Settings */}
                <div className="space-y-3">
                    
                    {/* Responsive Table Wrapper */}
                        <div className="inline-block min-w-full align-middle">
                            <Table className="min-w-full divide-y divide-border table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead scope="col" className="text-left text-xs font-medium w-[15%] sm:w-auto">
                                            <FormattedMessage
                                                defaultMessage="Day"
                                                description="Table header for day name"
                                            />
                                        </TableHead>
                                        <TableHead scope="col" className="text-left text-xs font-medium max-w-[28%] w-full">
                                            <div className="truncate">
                                                <FormattedMessage
                                                    defaultMessage="Rate"
                                                    description="Table header for rate"
                                                />
                                            </div>
                                        </TableHead>
                                        <TableHead scope="col" className="text-left text-xs font-medium max-w-[28%] w-full">
                                            <div className="truncate">
                                                <FormattedMessage
                                                    defaultMessage="Min Stay"
                                                    description="Table header for minimum stay"
                                                />
                                            </div>
                                        </TableHead>
                                        <TableHead scope={'col'}></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {daysOfWeek.map((day) => {
                                        const isActive = activeDays.has(day.dayIndex);
                                        
                                        return (
                                            <TableRow key={day.key} className={!isActive ? 'opacity-40 pointer-events-none' : ''}>
                                                <TableCell className="text-sm font-medium truncate">
                                                    <span className="hidden sm:inline">{day.label}</span>
                                                    <span className="sm:hidden">{day.shortLabel}</span>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <Controller
                                                        name={`advanced.${day.key}.rate`}
                                                        control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <ResourceInput
                                                                resource={'property'}
                                                                field={'rate'}
                                                                errorsAsTooltip
                                                                label={''}
                                                                action={'set-rates-availability'}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                onBlur={field.onBlur}
                                                                error={fieldState.error?.message}
                                                                options={{currency: property.currency}}
                                                                disabled={!isActive}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Controller
                                                        name={`advanced.${day.key}.min_stay`}
                                                        control={form.control}
                                                        render={({field, fieldState}) => (
                                                            <ResourceInput
                                                                resource={'property'}
                                                                field={'min_stay'}
                                                                description={''}
                                                                errorsAsTooltip
                                                                label={''}
                                                                action={'set-rates-availability'}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                onBlur={field.onBlur}
                                                                error={fieldState.error?.message}
                                                                options={{currency: property.currency}}
                                                                disabled={!isActive}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Controller
                                                            name={`advanced.${day.key}.checkin_restricted`}
                                                            control={form.control}
                                                            render={({field}) => (
                                                                <RestrictionIconButton
                                                                    type="checkin"
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    disabled={!isActive}
                                                                />
                                                            )}
                                                        />
                                                        <Controller
                                                            name={`advanced.${day.key}.checkout_restricted`}
                                                            control={form.control}
                                                            render={({field}) => (
                                                                <RestrictionIconButton
                                                                    type="checkout"
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    disabled={!isActive}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                </div>
            </div>
        </form>

        <div className="flex gap-2 py-4 w-full">
            <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={onBack || onClose}
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