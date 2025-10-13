import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import { DateRange, Matcher } from "react-day-picker";
import { isAfter, isBefore, isValid, startOfDay } from "date-fns";
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
  getValue: () => DateRange;
}

/**
 * Date range value type
 */
export interface DateRangeValue {
  from: Date | undefined;
  to: Date | undefined;
}

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
 * Default preset date ranges
 */
const defaultPresets: DateRangePreset[] = [
  {
    label: "Last 7 Days",
    getValue: () => {
      const today = startOfDay(new Date());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return { from: weekAgo, to: today };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const today = startOfDay(new Date());
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 29);
      return { from: monthAgo, to: today };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: firstDay, to: startOfDay(today) };
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const today = new Date();
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: firstDayLastMonth, to: lastDayLastMonth };
    },
  },
  {
    label: "This Quarter",
    getValue: () => {
      const today = new Date();
      const quarter = Math.floor(today.getMonth() / 3);
      const firstDay = new Date(today.getFullYear(), quarter * 3, 1);
      return { from: firstDay, to: startOfDay(today) };
    },
  },
];

/**
 * DateRangePicker component for selecting a date range with calendar interface
 * 
 * @example
 * ```tsx
 * // Controlled component
 * const [range, setRange] = useState<DateRangeValue | null>(null);
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
      const [tempValue, setTempValue] = React.useState<DateRangeValue | null>(null);
      const [validationError, setValidationError] = React.useState<string>("");
      const isMobile = useIsMobile();
      
      // Use the formatting hook for consistent date display
      const formatDate = useDateFormat();

      // Determine if component is controlled
      const isControlled = value !== undefined;
      const currentValue = isControlled ? value : internalValue;

      // Preset ranges to use
      const presetRanges = React.useMemo(
        () => (enablePresets ? presets || defaultPresets : []),
        [enablePresets, presets]
      );

      /**
       * Validate date range
       */
      const validateRange = React.useCallback(
        (range: DateRangeValue | null): string => {
          if (!range) return "";

          const { from, to } = range;

          // Check if dates are valid
          if (from && !isValid(from)) {
            return "Invalid start date";
          }
          if (to && !isValid(to)) {
            return "Invalid end date";
          }

          // Check if end date is before start date
          if (from && to && isAfter(from, to)) {
            return "End date must be after start date";
          }

          // Check min date constraint
          if (minDate) {
            if (from && isBefore(from, startOfDay(minDate))) {
              return `Start date must be after ${formatDate(minDate)}`;
            }
            if (to && isBefore(to, startOfDay(minDate))) {
              return `End date must be after ${formatDate(minDate)}`;
            }
          }

          // Check max date constraint
          if (maxDate) {
            if (from && isAfter(from, startOfDay(maxDate))) {
              return `Start date must be before ${formatDate(maxDate)}`;
            }
            if (to && isAfter(to, startOfDay(maxDate))) {
              return `End date must be before ${formatDate(maxDate)}`;
            }
          }

          return "";
        },
        [minDate, maxDate, formatDate]
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
          setTempValue(range as DateRangeValue);
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

        if (isControlled) {
          onChange?.(tempValue);
        } else {
          setInternalValue(tempValue);
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
        setTempValue(range as DateRangeValue);
      }, []);

      /**
       * Handle popover open change
       */
      const handleOpenChange = React.useCallback(
        (isOpen: boolean) => {
          setOpen(isOpen);

          if (isOpen) {
            // Initialize temp value with current value when opening
            setTempValue(currentValue);
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
        if (!currentValue || (!currentValue.from && !currentValue.to)) {
          return null;
        }
        
        return {
          start: currentValue.from?.toISOString() || "",
          end: currentValue.to?.toISOString() || "",
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
                      aria-label="Clear date range"
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
              aria-label="Date range picker"
            >
              <div className="flex flex-col md:flex-row">
                {presetRanges.length > 0 && !isMobile && (
                  <div className="border-b md:border-b-0 md:border-r p-3 space-y-1 max-w-46">
                    <div className="text-sm font-medium px-2 py-1">Quick Select</div>
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
                    defaultMonth={tempValue?.from || currentValue?.from}
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
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApply}
                      disabled={isApplyDisabled}
                      className="min-h-[44px] md:min-h-[32px]"
                      data-testid={`${dataTestId}-apply`}
                    >
                      Apply
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