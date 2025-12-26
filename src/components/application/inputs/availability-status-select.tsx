import {useEffect} from "react";
import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {FormattedMessage, useIntl} from "react-intl";
import {AvailabilityStatus} from "@sdk/generated";

export interface AvailabilityStatusSelectProps {
    value?: string | number | null;
    onChange?: (statusId: string | null) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: boolean;
    allowedTypes?: Array<"inquire_only" | "available" | "unavailable" | "booked" | "booking_pending">;
    valueType?: 'id' | 'type';
    selectFirstItem?: boolean;
}

/**
 * AvailabilityStatusSelect Component
 *
 * A simple availability status selector component that fetches availability statuses from the database
 * and displays them in a dropdown. Compatible with react-hook-form.
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <AvailabilityStatusSelect
 *   value={statusId}
 *   onChange={setStatusId}
 *   placeholder="Select availability status"
 * />
 *
 * // With react-hook-form
 * <Controller
 *   name="availability_status"
 *   control={control}
 *   render={({ field }) => (
 *     <AvailabilityStatusSelect
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!errors.availability_status}
 *     />
 *   )}
 * />
 *
 * // With allowed types filter
 * <AvailabilityStatusSelect
 *   value={statusId}
 *   onChange={setStatusId}
 *   allowedTypes={['available', 'unavailable', 'booked']}
 * />
 *
 * // With type as value
 * <AvailabilityStatusSelect
 *   value={statusType}
 *   onChange={setStatusType}
 *   valueType="type"
 * />
 *
 * // With auto-select first item
 * <AvailabilityStatusSelect
 *   value={statusId}
 *   onChange={setStatusId}
 *   selectFirstItem={true}
 * />
 * ```
 */
export function AvailabilityStatusSelect({
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    className,
    error = false,
    allowedTypes,
    valueType = 'id',
    selectFirstItem = false,
}: AvailabilityStatusSelectProps) {
    const intl = useIntl();

    // Default translated placeholder
    const defaultPlaceholder = intl.formatMessage({
        defaultMessage: "Select availability status",
        description: "Availability status select placeholder"
    });
    
    // Fetch availability statuses using react-query
    const {data: statuses = [], isLoading, isError} = useQuery({
        queryKey: ['availability-status.query'],
        queryFn: async () => {
            const response = await api.availabilityStatus.query({
                sort: [{field: 'name', direction: 'asc', locale: 'en'}],
                paginate: {perpage: 100}
            });
            return response.response?.data || [];
        },
    });

    // Filter statuses based on allowedTypes prop
    const filteredStatuses = allowedTypes && allowedTypes.length > 0
        ? statuses.filter((s: AvailabilityStatus) => s.type && allowedTypes.includes(s.type))
        : statuses;

    // Auto-select first item if enabled and no value is set
    useEffect(() => {
        if (selectFirstItem && !value && filteredStatuses.length > 0 && onChange) {
            const firstStatus = filteredStatuses[0];
            handleValueChange(firstStatus.id.toString());
        }
    }, [filteredStatuses]);

    // Find the selected status object based on valueType
    const selectedStatus = filteredStatuses.find((s: AvailabilityStatus) =>
        valueType === 'type' ? s.type === value : s.id.toString() === value?.toString()
    );
    
    // Handle status selection
    const handleValueChange = (newValue: string) => {
        // newValue is always the ID (from SelectItem)
        if (valueType === 'type') {
            // Find status by ID and return its type
            const status = filteredStatuses.find((s: AvailabilityStatus) => s.id.toString() === newValue);
            onChange?.(status?.type || null);
        } else {
            // Return the ID
            onChange?.(newValue);
        }
    };

    if (isLoading) {
        return (
            <div className={cn(
                "flex items-center justify-center h-9 border border-input rounded-md px-3",
                className
            )}>
                <Loader2 className="size-4 animate-spin opacity-50"/>
                <span className="ml-2 text-sm text-muted-foreground">
                    <FormattedMessage
                        defaultMessage="Loading..."
                        description="Loading availability statuses message"
                    />
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={cn(
                "flex items-center justify-center h-9 border border-destructive rounded-md px-3 text-sm text-destructive",
                className
            )}>
                <FormattedMessage
                    defaultMessage="Failed to load availability statuses"
                    description="Error loading availability statuses message"
                />
            </div>
        );
    }

    return (
        <Select
            value={selectedStatus?.id.toString()}
            onValueChange={handleValueChange}
            disabled={disabled}
        >
            <SelectTrigger
                className={cn(
                    "w-full",
                    error && "border-destructive aria-invalid:border-destructive",
                    className
                )}
                aria-invalid={error}
                onBlur={onBlur}
            >
                <SelectValue placeholder={placeholder == undefined ? defaultPlaceholder : placeholder} className="flex items-center justify-between w-full overflow-hidden">
                    {selectedStatus && (
                        <div className="flex items-center gap-2 w-full overflow-hidden">
                            {selectedStatus.calendar_color && (
                                <div
                                    className="size-3 rounded-full shrink-0"
                                    style={{ backgroundColor: selectedStatus.calendar_color }}
                                />
                            )}
                            <span className="truncate">{selectedStatus.name}</span>
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {filteredStatuses.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        <FormattedMessage
                            defaultMessage="No availability statuses available"
                            description="No availability statuses available message"
                        />
                    </div>
                ) : (
                    filteredStatuses.map((status: AvailabilityStatus) => (
                        <SelectItem key={status.id} value={status.id.toString()} className="flex items-center gap-2 w-full overflow-hidden">
                            <div className="flex items-center gap-2 w-full overflow-hidden">
                                {status.calendar_color && (
                                    <div
                                        className="size-3 rounded-full shrink-0"
                                        style={{ backgroundColor: status.calendar_color }}
                                    />
                                )}
                                <span className="truncate">{status.name}</span>
                            </div>
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
}