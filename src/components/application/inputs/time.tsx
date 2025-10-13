import * as React from "react";
import {Clock, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useEffect} from "react";

/**
 * Time value structure returned by onChange
 */
export interface TimeValue {
    hours: number;
    minutes: number;
}

/**
 * Props for the TimePicker component
 */
export interface TimePickerProps {
    /** Current time value in HH:mm format (e.g., "14:30") */
    value?: string | null;
    /** Default time value for uncontrolled component */
    defaultValue?: string | null;
    /** Callback fired when time changes - returns {hours, minutes} */
    onChange?: (time: TimeValue | null) => void;
    /** Callback fired on blur for form validation */
    onBlur?: () => void;
    /** Minimum time in HH:mm format */
    minTime?: string;
    /** Maximum time in HH:mm format */
    maxTime?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Whether the input has an error state */
    error?: boolean;
    /** Additional CSS class name */
    className?: string;
    /** Test ID for testing */
    "data-testid"?: string;
    /** ARIA label for accessibility */
    "aria-label"?: string;
    /** ARIA invalid state */
    "aria-invalid"?: boolean;
    /** ARIA described by for error messages */
    "aria-describedby"?: string;
}

/**
 * Parse HH:mm string to TimeValue
 */
const parseTime = (timeString: string | null | undefined): TimeValue | null => {
    if (!timeString) return null;

    const parts = timeString.split(":");
    if (parts.length !== 2) return null;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) return null;
    if (hours < 0 || hours > 23) return null;
    if (minutes < 0 || minutes > 59) return null;

    return {hours, minutes};
};

/**
 * Format TimeValue to HH:mm string (24-hour format)
 */
const formatTime = (time: TimeValue | null): string => {
    if (!time) return "";
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`;
};

/**
 * Format TimeValue to HH:mm string for native input
 */
const formatTimeForNative = (time: TimeValue | null): string => {
    if (!time) return "";
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`;
};

/**
 * Format TimeValue to 12-hour AM/PM format
 */
const formatTimeTo12Hour = (time: TimeValue | null): string => {
    if (!time) return "";

    const hours = time.hours;
    const minutes = time.minutes;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Validate time against min/max constraints
 */
const isTimeInRange = (
    time: TimeValue,
    minTime?: string,
    maxTime?: string
): boolean => {
    const totalMinutes = time.hours * 60 + time.minutes;

    if (minTime) {
        const min = parseTime(minTime);
        if (min) {
            const minTotalMinutes = min.hours * 60 + min.minutes;
            if (totalMinutes < minTotalMinutes) return false;
        }
    }

    if (maxTime) {
        const max = parseTime(maxTime);
        if (max) {
            const maxTotalMinutes = max.hours * 60 + max.minutes;
            if (totalMinutes > maxTotalMinutes) return false;
        }
    }

    return true;
};

/**
 * TimePicker Component
 *
 * An inline time picker component with keyboard navigation, accessibility,
 * and mobile support. Uses 24-hour format and accepts time in HH:mm format,
 * returning {hours, minutes} on change.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [time, setTime] = useState<TimeValue | null>(null);
 * <TimePicker
 *   value={time ? formatTimeForNative(time) : null}
 *   onChange={setTime}
 * />
 *
 * // With InputWrapper
 * <InputWrapper label="Appointment Time" required error={errors.time?.message}>
 *   <TimePicker
 *     value={time}
 *     onChange={(val) => setTime(val)}
 *     error={!!errors.time}
 *   />
 * </InputWrapper>
 *
 * // With React Hook Form
 * <Controller
 *   name="appointmentTime"
 *   control={control}
 *   rules={{ required: "Time is required" }}
 *   render={({ field, fieldState }) => (
 *     <InputWrapper
 *       label="Appointment Time"
 *       required
 *       error={fieldState.error?.message}
 *     >
 *       <TimePicker
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *         error={!!fieldState.error}
 *       />
 *     </InputWrapper>
 *   )}
 * />
 *
 * // With time constraints
 * <TimePicker
 *   value={time}
 *   onChange={setTime}
 *   minTime="09:00"
 *   maxTime="17:00"
 * />
 * ```
 */
export const TimePicker = React.memo(
    React.forwardRef<HTMLDivElement, TimePickerProps>(
        (
            {
                value,
                defaultValue,
                onChange,
                onBlur,
                minTime,
                maxTime,
                disabled = false,
                error = false,
                className,
                "data-testid": dataTestId,
                "aria-label": ariaLabel,
                "aria-invalid": ariaInvalid,
                "aria-describedby": ariaDescribedBy,
            },
            ref
        ) => {
            const [tempHours, setTempHours] = React.useState<string>(() => {
                const initial = parseTime(value || defaultValue);
                return initial ? initial.hours.toString().padStart(2, "0") : "";
            });
            const [tempMinutes, setTempMinutes] = React.useState<string>(() => {
                const initial = parseTime(value || defaultValue);
                return initial ? initial.minutes.toString().padStart(2, "0") : "";
            });

            const hoursInputRef = React.useRef<HTMLInputElement>(null);
            const minutesInputRef = React.useRef<HTMLInputElement>(null);

            /**
             * Handle time change with validation
             */
            const handleTimeChange = React.useCallback(
                (time: TimeValue | null) => {
                    // Validate time range if time is provided
                    if (time && !isTimeInRange(time, minTime, maxTime)) {
                        return;
                    }
                    onChange?.(time);
                },
                [onChange, minTime, maxTime]
            );

            /**
             * Handle clear button
             */
            const handleClear = React.useCallback(
                (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTimeChange(null);
                    setTempHours("");
                    setTempMinutes("");
                    onBlur?.();
                },
                [handleTimeChange, onBlur]
            );

            /**
             * Handle hours input change
             */
            const handleHoursChange = React.useCallback(
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    let val = e.target.value.replace(/[^\d]/g, "");

                    // Limit to 2 digits
                    if (val.length > 2) {
                        val = val.slice(0, 2);
                    }
                    setTempHours(val);
                },
                []
            );

            useEffect(() => {
                if (tempHours?.length === 2) {
                    minutesInputRef.current?.focus();
                }
            }, [tempHours]);

            /**
             * Handle minutes input change
             */
            const handleMinutesChange = React.useCallback(
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    let val = e.target.value.replace(/[^\d]/g, "");

                    // Limit to 2 digits
                    if (val.length > 2) {
                        val = val.slice(0, 2);
                    }

                    setTempMinutes(val);
                },
                []
            );

            /**
             * Handle blur - validate and update time
             */
            const handleBlur = React.useCallback(() => {
                // Pad and validate both fields
                let hours = tempHours;
                let minutes = tempMinutes;

                // Pad hours if single digit
                if (hours.length === 1) {
                    hours = hours.padStart(2, '0');
                    setTempHours(hours);
                }

                // Pad minutes if single digit
                if (minutes.length === 1) {
                    minutes = minutes.padStart(2, '0');
                    setTempMinutes(minutes);
                }

                // Clamp hours to valid range
                if (hours.length === 2) {
                    const hoursNum = parseInt(hours, 10);
                    if (hoursNum > 23) {
                        hours = '23';
                        setTempHours(hours);
                    }
                }

                // Clamp minutes to valid range
                if (minutes.length === 2) {
                    const minutesNum = parseInt(minutes, 10);
                    if (minutesNum > 59) {
                        minutes = '59';
                        setTempMinutes(minutes);
                    }
                }

                // Update time if both fields are complete
                if (hours.length === 2 && minutes.length === 2) {
                    const hoursNum = parseInt(hours, 10);
                    const minutesNum = parseInt(minutes, 10);
                    if (!isNaN(hoursNum) && !isNaN(minutesNum)) {
                        handleTimeChange({hours: hoursNum, minutes: minutesNum});
                    }
                } else if (hours === "" && minutes === "") {
                    handleTimeChange(null);
                }

                onBlur?.();
            }, [tempHours, tempMinutes, handleTimeChange, onBlur]);

            /**
             * Calculate 12-hour format display text
             */
            const displayText = React.useMemo(() => {
                if (tempHours.length === 2 && tempMinutes.length === 2) {
                    const hoursNum = parseInt(tempHours, 10);
                    const minutesNum = parseInt(tempMinutes, 10);
                    if (!isNaN(hoursNum) && !isNaN(minutesNum) && hoursNum >= 0 && hoursNum <= 23 && minutesNum >= 0 && minutesNum <= 59) {
                        return formatTimeTo12Hour({hours: hoursNum, minutes: minutesNum});
                    }
                }
                return null;
            }, [tempHours, tempMinutes]);

            // Desktop inline time picker
            return (
                <div
                    ref={ref}
                    className={cn(
                        "flex items-center gap-2 h-9 w-full rounded-md border border-input bg-transparent px-3 shadow-xs transition-colors",
                        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring",
                        error && "border-destructive",
                        disabled && "cursor-not-allowed opacity-50",
                        className
                    )}
                    data-testid={dataTestId}
                    aria-label={ariaLabel || "Time picker"}
                    aria-invalid={ariaInvalid !== undefined ? ariaInvalid : error}
                    aria-describedby={ariaDescribedBy}
                    onClick={() => hoursInputRef.current?.focus()}
                >
                    <Clock className="size-4 shrink-0 opacity-50" aria-hidden="true"/>

                    <div className="flex items-center gap-1 flex-1">
                        {/* Hours Input */}
                        <Input
                            ref={hoursInputRef}
                            type="text"
                            inputMode="numeric"
                            value={tempHours}
                            onChange={handleHoursChange}
                            onBlur={handleBlur}
                            disabled={disabled}
                            maxLength={2}
                            className="w-10 h-6 p-0 text-center font-mono border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            aria-label="Hours"
                            placeholder={'hh'}
                            aria-valuemin={0}
                            aria-valuemax={23}
                            data-testid={dataTestId ? `${dataTestId}-hours` : undefined}
                        />
                        <span className="text-sm font-bold">:</span>
                        {/* Minutes Input */}
                        <Input
                            ref={minutesInputRef}
                            type="text"
                            inputMode="numeric"
                            value={tempMinutes}
                            onChange={handleMinutesChange}
                            onBlur={handleBlur}
                            disabled={disabled}
                            maxLength={2}
                            placeholder={'mm'}
                            className="w-10 h-6 p-0 text-center font-mono border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            aria-label="Minutes"
                            aria-valuemin={0}
                            aria-valuemax={59}
                            data-testid={dataTestId ? `${dataTestId}-minutes` : undefined}
                        />
                    </div>

                    {displayText && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap"
                              aria-label="Time in 12-hour format">
              {displayText}
            </span>
                    )}

                    {(tempHours || tempMinutes) && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring p-0.5"
                            aria-label="Clear time"
                            tabIndex={-1}
                        >
                            <X className="size-4 shrink-0" aria-hidden="true"/>
                        </button>
                    )}
                </div>
            );
        }
    )
);

TimePicker.displayName = "TimePicker";

/**
 * Export helper functions for external use
 */
export {parseTime, formatTime, formatTimeForNative, formatTimeTo12Hour};