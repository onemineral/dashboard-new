import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import { DateRange, Matcher } from "react-day-picker";
import { isAfter, isBefore, isValid, startOfDay, parseISO } from "date-fns";
import { useIntl } from "react-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { useDateFormat } from "@/hooks/use-format.ts";
import { DateRange as DateRangeDisplay } from "@/components/application/display/daterange";

/**
 * Week start day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Preset date range configuration
 */
export interface DateRangePreset {
  label: string;
  getValue: () => DateRangeValue;
}

/**
 * Date range value type - uses {start, end} with Date or yyyy-MM-dd string format
 */
export interface DateRangeValue {
  start: Date | string | undefined;
  end: Date | string | undefined;
}

/**
 * Internal date range type used by react-day-picker
 */
interface InternalDateRange {
  from: Date | undefined;
  to: Date | undefined;
}

/**
 * Convert a Date or yyyy-MM-dd string to a Date object
 */
const toDate = (value: Date | string | undefined): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
};

/**
 * Convert DateRangeValue to internal format used by react-day-picker
 */
const toInternalRange = (value: DateRangeValue | null): InternalDateRange | null => {
  if (!value) return null;
  return {
    from: toDate(value.start),
    to: toDate(value.end),
  };
};

/**
 * Convert internal format to DateRangeValue
 */
const fromInternalRange = (range: InternalDateRange | null): DateRangeValue | null => {
  if (!range || (!range.from && !range.to)) return null;
  return {
    start: range.from,
    end: range.to,
  };
};

/**
 * Props for the DateRangePicker component
 */
export interface DateRangePickerProps {
  /** Current date range value */
  value?: DateRangeValue | null;
  /** Default date range value for uncontrolled component */
  defaultValue?: DateRangeValue | null;
  /** Callback fired when date range changes */
  onChange?: (range: DateRangeValue | null) => void;
  /** Callback fired on blur for form validation */
  onBlur?: () => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input has an error state */
  error?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Preset date ranges for quick selection */
  presets?: DateRangePreset[];
  /** Enable preset ranges */
  enablePresets?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Number of months to display */
  numberOfMonths?: number;
  /** Week starts on (0 = Sunday, 1 = Monday, etc.) - default is Monday (1) */
  weekStartsOn?: WeekStartsOn;
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * DateRangePicker component for selecting a date range with calendar interface
 *
 * The component uses {start: Date|string, end: Date|string} format where:
 * - Date objects for programmatic use
 * - yyyy-MM-dd strings for API/storage compatibility
 *
 * @example
 * ```tsx
 * // Controlled component with Date objects
 * const [range, setRange] = useState<DateRangeValue | null>(null);
 * <DateRangePicker value={range} onChange={setRange} />
 *
 * // With yyyy-MM-dd strings
 * const [range, setRange] = useState<DateRangeValue | null>({
 *   start: "2024-01-01",
 *   end: "2024-12-31"
 * });
 * <DateRangePicker value={range} onChange={setRange} />
 *
 * // With presets and validation
 * <DateRangePicker
 *   value={range}
 *   onChange={setRange}
 *   minDate={new Date()}
 *   enablePresets
 *   error={!!errors.dateRange}
 *   errorMessage={errors.dateRange?.message}
 * />
 *
 * // With React Hook Form
 * <Controller
 *   name="dateRange"
 *   control={control}
 *   render={({ field }) => (
 *     <DateRangePicker
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *     />
 *   )}
 * />
 * ```
 */
export const DateRangePicker = React.memo(
  React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
    (
      {
        value,
        defaultValue,
        onChange,
        onBlur,
        minDate,
        maxDate,
        placeholder = "Select date range",
        disabled = false,
        error = false,
        className,
        presets,
        enablePresets = false,
        errorMessage,
        numberOfMonths = 2,
        weekStartsOn = 1,
        "data-testid": dataTestId,
      },
      ref
    ) => {
      // State management
      const [open, setOpen] = React.useState(false);
      const [internalValue, setInternalValue] = React.useState<DateRangeValue | null>(
        defaultValue || null
      );
      const [tempValue, setTempValue] = React.useState<InternalDateRange | null>(null);
      const [validationError, setValidationError] = React.useState<string>("");
      const isMobile = useIsMobile();
      const intl = useIntl();
      
      // Use the formatting hook for consistent date display
      const formatDate = useDateFormat();

      // Determine if component is controlled
      const isControlled = value !== undefined;
      const currentValue = isControlled ? value : internalValue;
      
      // Convert currentValue to internal format for calendar
      const currentInternalValue = toInternalRange(currentValue);

      // Preset ranges to use
      const presetRanges = React.useMemo(
        () => (enablePresets ? presets || [] : []),
        [enablePresets, presets]
      );

      /**
       * Validate date range (internal format)
       */
      const validateRange = React.useCallback(
        (range: InternalDateRange | null): string => {
          if (!range) return "";

          const { from, to } = range;

          // Check if dates are valid
          if (from && !isValid(from)) {
            return intl.formatMessage({ defaultMessage: "Invalid start date", description: "Error message when the start date is invalid" });
          }
          if (to && !isValid(to)) {
            return intl.formatMessage({ defaultMessage: "Invalid end date", description: "Error message when the end date is invalid" });
          }

          // Check if end date is before start date
          if (from && to && isAfter(from, to)) {
            return intl.formatMessage({ defaultMessage: "End date must be after start date", description: "Error message when the end date is before the start date" });
          }

          // Check min date constraint
          if (minDate) {
            if (from && isBefore(from, startOfDay(minDate))) {
              return intl.formatMessage(
                { defaultMessage: "Start date must be after {date}", description: "Error message when the start date is before the minimum date" },
                { date: formatDate(minDate) }
              );
            }
            if (to && isBefore(to, startOfDay(minDate))) {
              return intl.formatMessage(
                { defaultMessage: "End date must be after {date}", description: "Error message when the end date is before the minimum date" },
                { date: formatDate(minDate) }
              );
            }
          }

          // Check max date constraint
          if (maxDate) {
            if (from && isAfter(from, startOfDay(maxDate))) {
              return intl.formatMessage(
                { defaultMessage: "Start date must be before {date}", description: "Error message when the start date is after the maximum date" },
                { date: formatDate(maxDate) }
              );
            }
            if (to && isAfter(to, startOfDay(maxDate))) {
              return intl.formatMessage(
                { defaultMessage: "End date must be before {date}", description: "Error message when the end date is after the maximum date" },
                { date: formatDate(maxDate) }
              );
            }
          }

          return "";
        },
        [minDate, maxDate, formatDate, intl]
      );

      /**
       * Handle date selection in calendar
       */
      const handleSelect = React.useCallback(
        (range: DateRange | undefined) => {
          if (!range) {
            setTempValue(null);
            return;
          }

          // Always allow selection during the picking process
          // Validation will happen when applying
          setTempValue(range as InternalDateRange);

          if(validateRange(range as InternalDateRange)) {
              handleApply();
          }
        },
        []
      );

      /**
       * Handle Apply button click
       */
      const handleApply = React.useCallback(() => {
        const error = validateRange(tempValue);
        
        if (error) {
          setValidationError(error);
          return;
        }

        // Convert internal format back to DateRangeValue
        const newValue = fromInternalRange(tempValue);

        if (isControlled) {
          onChange?.(newValue);
        } else {
          setInternalValue(newValue);
        }

        setValidationError("");
        setOpen(false);
        setTimeout(() => onBlur?.(), 0);
      }, [tempValue, isControlled, onChange, onBlur, validateRange]);

      /**
       * Handle Cancel button click
       */
      const handleCancel = React.useCallback(() => {
        setTempValue(null);
        setValidationError("");
        setOpen(false);
        setTimeout(() => onBlur?.(), 0);
      }, [onBlur]);

      /**
       * Handle Clear button click
       */
      const handleClear = React.useCallback(
        (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          if (isControlled) {
            onChange?.(null);
          } else {
            setInternalValue(null);
          }

          setTempValue(null);
          setValidationError("");
          setTimeout(() => onBlur?.(), 0);
        },
        [isControlled, onChange, onBlur]
      );

      /**
       * Handle preset selection
       */
      const handlePresetSelect = React.useCallback((preset: DateRangePreset) => {
        const range = preset.getValue();
        setTempValue(toInternalRange(range));
      }, []);

      /**
       * Handle popover open change
       */
      const handleOpenChange = React.useCallback(
        (isOpen: boolean) => {
          setOpen(isOpen);

          if (isOpen) {
            // Initialize temp value with current value when opening (convert to internal format)
            setTempValue(toInternalRange(currentValue));
            setValidationError("");
          } else {
            // Reset temp value when closing without applying
            setTempValue(null);
            setValidationError("");
            setTimeout(() => onBlur?.(), 0);
          }
        },
        [currentValue, onBlur]
      );

      /**
       * Build disabled dates matcher
       */
      const disabledMatcher = React.useMemo((): Matcher | Matcher[] | undefined => {
        const matchers: Matcher[] = [];

        if (minDate) {
          matchers.push({ before: startOfDay(minDate) });
        }

        if (maxDate) {
          matchers.push({ after: startOfDay(maxDate) });
        }

        return matchers.length > 0 ? matchers : undefined;
      }, [minDate, maxDate]);

      /**
       * Handle keyboard navigation
       */
      const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
          if (!open) return;

          switch (e.key) {
            case "Escape":
              e.preventDefault();
              handleCancel();
              break;
            case "Enter":
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                handleApply();
              }
              break;
          }
        },
        [open, handleCancel, handleApply]
      );

      // Sync internal value with controlled value
      React.useEffect(() => {
        if (isControlled && value !== internalValue) {
          setInternalValue(value);
        }
      }, [value, isControlled, internalValue]);

      // Convert currentValue to format expected by DateRangeDisplay component
      const displayDateRange = React.useMemo(() => {
        if (!currentValue || (!currentValue.start && !currentValue.end)) {
          return null;
        }
        
        const startDate = toDate(currentValue.start);
        const endDate = toDate(currentValue.end);
        
        return {
          start: startDate ? (typeof currentValue.start === 'string' ? currentValue.start : startDate.toISOString()) : "",
          end: endDate ? (typeof currentValue.end === 'string' ? currentValue.end : endDate.toISOString()) : "",
        };
      }, [currentValue]);

      // Check if Apply button should be disabled
      const isApplyDisabled = React.useMemo(() => {
        if (!tempValue) return true;
        if (!tempValue.from && !tempValue.to) return true;
        return false;
      }, [tempValue]);

      return (
        <div className={cn("flex flex-col gap-1", className)}>
          <Popover open={open} onOpenChange={handleOpenChange} modal>
            <PopoverTrigger asChild>
              <Button
                ref={ref}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={placeholder}
                aria-invalid={error || !!validationError}
                disabled={disabled}
                data-testid={dataTestId}
                className={cn(
                  "w-full justify-between hover:bg-background font-normal",
                  !currentValue && "text-muted-foreground",
                  (error || validationError) && "border-destructive",
                  "touch-manipulation"
                )}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <CalendarIcon className="size-4 shrink-0 opacity-50" aria-hidden="true" />
                  {displayDateRange ? (
                    <DateRangeDisplay
                      value={displayDateRange}
                      className="truncate text-sm"
                      dateClassName="font-normal"
                    />
                  ) : (
                    <span className="truncate">{placeholder}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {currentValue && !disabled && (
                    <a
                      type="button"
                      onClick={handleClear}
                      className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[44px] min-h-[44px] md:min-w-[20px] md:min-h-[20px] flex items-center justify-center"
                      aria-label={intl.formatMessage({ defaultMessage: "Clear date range", description: "ARIA label for the clear date range button" })}
                      tabIndex={-1}
                    >
                      <X className="size-4 shrink-0" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-label={intl.formatMessage({ defaultMessage: "Date range picker", description: "ARIA label for the date range picker dialog" })}
            >
              <div className="flex flex-col md:flex-row">
                {presetRanges.length > 0 && !isMobile && (
                  <div className="border-b md:border-b-0 md:border-r p-3 space-y-1 max-w-46">
                    <div className="text-sm font-medium px-2 py-1">
                      {intl.formatMessage({ defaultMessage: "Quick Select", description: "Header for the quick date range selection presets" })}
                    </div>
                    {presetRanges.map((preset, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start min-h-[44px] md:min-h-[32px]"
                        onClick={() => handlePresetSelect(preset)}
                        data-testid={`${dataTestId}-preset-${index}`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="p-3">
                  <Calendar
                    mode="range"
                    selected={tempValue || undefined}
                    onSelect={(range) => {
                      handleSelect(range);
                    }}
                    numberOfMonths={isMobile ? 1: numberOfMonths}
                    weekStartsOn={weekStartsOn}
                    disabled={disabledMatcher}
                    defaultMonth={tempValue?.from || currentInternalValue?.from}
                    today={new Date()}
                    showOutsideDays={false}
                    modifiersClassNames={{
                      hover: "bg-accent",
                    }}
                    className="rounded-md"
                    data-testid={`${dataTestId}-calendar`}
                  />
                  {validationError && (
                    <div
                      className="mt-2 text-sm text-destructive px-3"
                      role="alert"
                      aria-live="polite"
                    >
                      {validationError}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                      className="min-h-[44px] md:min-h-[32px]"
                      data-testid={`${dataTestId}-cancel`}
                    >
                      {intl.formatMessage({ defaultMessage: "Clear", description: "Button label to clear the selected date range" })}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApply}
                      disabled={isApplyDisabled}
                      className="min-h-[44px] md:min-h-[32px]"
                      data-testid={`${dataTestId}-apply`}
                    >
                      {intl.formatMessage({ defaultMessage: "Apply", description: "Button label to apply the selected date range" })}
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {(error || errorMessage) && !validationError && errorMessage && (
            <div
              className="text-sm text-destructive px-1"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </div>
          )}
        </div>
      );
    }
  )
);

DateRangePicker.displayName = "DateRangePicker";

/**
 * Export types for external use
 */
export type { DateRange, DateRangePreset as Preset };