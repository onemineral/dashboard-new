import {useContext, useEffect, useMemo} from "react";
import {cn} from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useIntl} from "react-intl";
import {AppContext} from "@/contexts/app-context";

export interface TimezoneSelectProps {
    value?: string | null;
    onChange?: (timezone: string | null) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: boolean;
    /**
     * If true, automatically detects and sets the browser's timezone when no value is provided.
     * Uses Intl.DateTimeFormat().resolvedOptions().timeZone to get the browser's timezone.
     * @default false
     */
    autodetect?: boolean;
}

/**
 * TimezoneSelect Component
 *
 * A timezone selector component that fetches available timezones from the schema
 * and displays them grouped by region in a dropdown. Compatible with react-hook-form.
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <TimezoneSelect
 *   value={timezone}
 *   onChange={setTimezone}
 *   placeholder="Select timezone"
 * />
 *
 * // With autodetect
 * <TimezoneSelect
 *   value={timezone}
 *   onChange={setTimezone}
 *   autodetect
 * />
 *
 * // With react-hook-form
 * <Controller
 *   name="timezone"
 *   control={control}
 *   render={({ field }) => (
 *     <TimezoneSelect
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!errors.timezone}
 *       autodetect
 *     />
 *   )}
 * />
 * ```
 */
export function TimezoneSelect({
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    className,
    error = false,
    autodetect = true,
}: TimezoneSelectProps) {
    const intl = useIntl();
    const {schema} = useContext(AppContext);
    
    // Default translated placeholder
    const defaultPlaceholder = intl.formatMessage({
        defaultMessage: "Select timezone",
        description: "Timezone select placeholder"
    });
    
    // Get timezones from schema
    const timezones = schema.findField('tenant-settings', 'timezone')?.possibleValues;

    // Auto-detect browser timezone if enabled and no value is set
    useEffect(() => {
        if (autodetect && !value && onChange && timezones) {
            try {
                const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                // Check if the detected timezone exists in available timezones
                if (browserTimezone && timezones[browserTimezone]) {
                    onChange(browserTimezone);
                }
            } catch (error) {
                // Silently fail if timezone detection is not supported
                console.warn('Failed to detect browser timezone:', error);
            }
        }
    }, [autodetect, value, onChange, timezones]);

    // Group timezones by region extracted from the timezone key (e.g., "Europe/Lisbon" -> "Europe")
    const timezonesByRegion = useMemo(() => {
        if (!timezones) return {};
        
        const grouped: Record<string, Array<{key: string; value: string}>> = {};
        
        Object.entries(timezones).forEach(([key, value]) => {
            // Extract region from timezone key (e.g., "Europe/Lisbon" -> "Europe")
            const region = key.split('/')[0] || 'Other';
            
            if (!grouped[region]) {
                grouped[region] = [];
            }
            
            grouped[region].push({ key, value: value as string });
        });
        
        // Sort regions and timezones within each region
        const sortedRegions: Record<string, Array<{key: string; value: string}>> = {};
        Object.keys(grouped).sort().forEach(region => {
            sortedRegions[region] = grouped[region].sort((a, b) => a.value.localeCompare(b.value));
        });
        
        return sortedRegions;
    }, [timezones]);

    // Find the selected timezone label
    const selectedTimezoneLabel = useMemo(() => {
        if (!value || !timezones) return null;
        return timezones[value] as string || null;
    }, [value, timezones]);

    // Handle timezone selection
    const handleValueChange = (newValue: string) => {
        onChange?.(newValue);
    };

    if (!timezones) {
        return (
            <div className={cn(
                "flex items-center justify-center h-9 border border-destructive rounded-md px-3 text-sm text-destructive",
                className
            )}>
                Failed to load timezones
            </div>
        );
    }

    return (
        <Select
            value={value || undefined}
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
                <SelectValue placeholder={placeholder || defaultPlaceholder}>
                    {selectedTimezoneLabel}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {Object.keys(timezonesByRegion).length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No timezones available
                    </div>
                ) : (
                    Object.entries(timezonesByRegion).map(([region, tzList]) => (
                        <div key={region}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                {region}
                            </div>
                            {tzList.map((tz) => (
                                <SelectItem key={tz.key} value={tz.key}>
                                    {tz.value}
                                </SelectItem>
                            ))}
                        </div>
                    ))
                )}
            </SelectContent>
        </Select>
    );
}