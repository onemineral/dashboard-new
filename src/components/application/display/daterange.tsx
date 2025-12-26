import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {useDateFormat} from "@/hooks/use-format.ts";

interface DateRangeDisplayProps {
  /**
   * The date range to display
   */
  value: {
    start: string;
    end: string;
  } | null;
  
  /**
   * Additional className for the container
   */
  className?: string;
  
  /**
   * Additional className for each date
   */
  dateClassName?: string;
  
  /**
   * Additional className for the arrow icon
   */
  arrowClassName?: string;
  
  /**
   * Show single date if start and end are the same
   * @default true
   */
  collapseSameDate?: boolean;
  
  /**
   * Placeholder text when no date range is provided
   */
  placeholder?: string;
  
  /**
   * Test ID for testing
   */
  "data-testid"?: string;
}

export function DateRange({
  value,
  className,
  dateClassName,
  arrowClassName,
  collapseSameDate = true,
  placeholder = "No date range",
  "data-testid": testId,
}: DateRangeDisplayProps) {

  const dateFormat = useDateFormat();

  // Handle null/undefined value
  if (!value || !value.start || !value.end) {
    return (
      <span
        className={cn("text-sm text-muted-foreground", className)}
        data-testid={testId}
      >
        {placeholder}
      </span>
    );
  }

  try {
    // Parse dates
    const startDate = new Date(value.start);
    const endDate = new Date(value.end);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return (
        <span
          className={cn("text-sm text-destructive", className)}
          data-testid={testId}
        >
          Invalid date range
        </span>
      );
    }

    // Format dates
    const formattedStart = dateFormat(startDate);
    const formattedEnd = dateFormat(endDate);

    // If same date and collapse is enabled, show only one date
    if (collapseSameDate && formattedStart === formattedEnd) {
      return (
        <span
          className={cn("text-sm font-medium", className)}
          data-testid={testId}
        >
          <span className={cn("text-foreground", dateClassName)}>
            {formattedStart}
          </span>
        </span>
      );
    }
    
    return (
      <span
        className={cn("inline-flex items-center gap-1.5", className)}
        data-testid={testId}
      >
        <span className={dateClassName}>
          {formattedStart}
        </span>
        <ArrowRight
          className={cn("size-3.5 shrink-0", arrowClassName)}
          aria-hidden="true"
        />
        <span className={dateClassName}>
          {formattedEnd}
        </span>
      </span>
    );
  } catch (error: any) {
    return (
      <span
        className={cn("text-sm text-destructive", className)}
        data-testid={testId}
      >
        Error formatting date range
      </span>
    );
  }
}