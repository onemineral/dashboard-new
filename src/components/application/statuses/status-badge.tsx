// Status.tsx

/**
 * Highly reusable, type-safe Status component for displaying and optionally changing object statuses.
 *
 * ## Usage Example: Property Status
 * ```tsx
 * import Status, { StatusDefinition } from "./status";
 * import { CheckCircle, XCircle, Clock } from "lucide-react";
 *
 * type PropertyStatus = "enabled" | "disabled" | "pending";
 * const PROPERTY_STATUSES: StatusDefinition<PropertyStatus>[] = [
 *   { value: "enabled", label: "Enabled", icon: CheckCircle, colorClass: "bg-green-100 text-green-800", badgeVariant: "default" },
 *   { value: "pending", label: "Pending", icon: Clock, colorClass: "bg-yellow-100 text-yellow-800", badgeVariant: "secondary" },
 *   { value: "disabled", label: "Disabled", icon: XCircle, colorClass: "bg-gray-100 text-gray-500", badgeVariant: "destructive" },
 * ];
 *
 * <Status
 *   value={currentStatus}
 *   statuses={PROPERTY_STATUSES}
 *   onChange={setStatus}
 *   disabled={isLoading}
 *   showDropdown
 * />
 * ```
 *
 * ## Usage Example: Booking Status
 * ```tsx
 * type BookingStatus = "confirmed" | "cancelled" | "pending";
 * const BOOKING_STATUSES: StatusDefinition<BookingStatus>[] = [
 *   { value: "confirmed", label: "Confirmed", icon: CheckCircle, colorClass: "bg-blue-100 text-blue-800", badgeVariant: "default" },
 *   { value: "pending", label: "Pending", icon: Clock, colorClass: "bg-yellow-100 text-yellow-800", badgeVariant: "secondary" },
 *   { value: "cancelled", label: "Cancelled", icon: XCircle, colorClass: "bg-red-100 text-red-800", badgeVariant: "destructive" },
 * ];
 *
 * <Status
 *   value={bookingStatus}
 *   statuses={BOOKING_STATUSES}
 *   onChange={setBookingStatus}
 *   disabled={isBookingLocked}
 * />
 * ```
 *
 * ## Usage Example: Inquiry Status (Read-only)
 * ```tsx
 * type InquiryStatus = "open" | "closed";
 * const INQUIRY_STATUSES: StatusDefinition<InquiryStatus>[] = [
 *   { value: "open", label: "Open", icon: CheckCircle, colorClass: "bg-green-100 text-green-800", badgeVariant: "default" },
 *   { value: "closed", label: "Closed", icon: XCircle, colorClass: "bg-gray-100 text-gray-500", badgeVariant: "secondary" },
 * ];
 *
 * <Status
 *   value={inquiryStatus}
 *   statuses={INQUIRY_STATUSES}
 *   showDropdown={false}
 * />
 * ```
 */

import * as React from "react";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * StatusDefinition describes a single status variant for use in the Status component.
 * @template T - The string union type representing all possible statuses.
 */
export interface StatusDefinition<T extends string> {
  /** The status value (e.g., "enabled", "pending", "disabled") */
  value: T;
  /** The human-readable label for the status */
  label: string;
  /** The icon to display for the status */
  icon?: React.ElementType;
  /** Optional: Tailwind classes for custom badge color */
  colorClass?: string;
  /** Optional: Variant for the Badge component */
  badgeVariant?: string;
}

/**
 * Props for the reusable Status component.
 * @template T - The string union type representing all possible statuses.
 */
export interface StatusProps<T extends string> {
  /** The current status value */
  value: T;
  /** All possible status definitions for this context */
  statuses: StatusDefinition<T>[];
  /** Callback when the status changes (if dropdown is enabled) */
  onChange?: (newStatus: T) => void|Promise<void>;
  /** Disable the dropdown/status change */
  disabled?: boolean;
  /** Show the dropdown for status change (default: true if onChange and >1 status) */
  showDropdown?: boolean;
  /** Additional className for the badge button */
  className?: string;
  /** aria-label for accessibility */
  ariaLabel?: string;
  /**
   * Optional array of react-query keys to invalidate/refetch when the property status is updated.
   * Each key can be a string, number, or an array (as accepted by react-query).
   */
  refetchQueryKeys?: Array<string | number>;
}

/**
 * A highly reusable, type-safe Status component for displaying and optionally changing object statuses.
 * Supports custom status variants, icons, color schemes, and dropdown for status changes.
 */
export function Status<T extends string>({
  value,
  statuses,
  onChange,
  disabled = false,
  showDropdown,
  className,
  ariaLabel,
  refetchQueryKeys,
}: StatusProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const queryClient = useQueryClient();

  const current = React.useMemo(
    () => statuses.find((s) => s.value === value),
    [statuses, value]
  );

  // Only show dropdown if enabled, onChange is provided, and there are multiple statuses
  const canShowDropdown = showDropdown && !!onChange && statuses.length > 1;

  if (!current) {
    // Optionally, render a fallback or throw
    return (
      <Badge variant="secondary" className={cn("opacity-60", className)}>
        Unknown
      </Badge>
    );
  }

  const handleChange = async (newValue: T) => {
    if (onChange && newValue !== value && !disabled) {
      setIsSaving(true);
      await onChange(newValue);
      setIsSaving(false);

      // Invalidate and refetch queries if refetchQueryKeys is provided
      if (Array.isArray(refetchQueryKeys)) {
        await queryClient.invalidateQueries({
            queryKey: refetchQueryKeys
          });
      }
    }
  };

  const badgeContent = (<>
      {/* Status Icon or Spinner */}
      {current.icon ? 
      <span className={cn("flex items-center", {
        'animate-spin': isSaving
      })}>
        {React.createElement(current.icon, {
            size: 14,
            "aria-hidden": true,
          })}
      </span> : null}
      {current.label}
      {canShowDropdown && !disabled && (
        <ChevronDown
          className={cn("ml-1 size-4")}
          aria-hidden="true"
          data-testid="status-dropdown-chevron"
        />
      )}
    </>);

  const badgeClass = cn(
    {'opacity-70 pointer-events-none': isSaving},
    "cursor-pointer select-none justify-center flex items-center gap-1",
    current.colorClass,
    className
  );

  if (canShowDropdown) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel || current.label}
            aria-haspopup="menu"
            aria-expanded={open}
            disabled={disabled || isSaving}
            className={cn("focus:outline-none")}
          >
            <Badge
              variant={current.badgeVariant as any}
              className={badgeClass}
              tabIndex={0}
            >
              {badgeContent}
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(val) => handleChange(val as T)}
          >
            {statuses.map((s) => (
              <DropdownMenuRadioItem
                key={s.value}
                value={s.value}
                disabled={disabled}
                aria-label={s.label}
                data-testid={`status-option-${s.value}`}
              > 
                  {s.icon ? React.createElement(s.icon, {
                    size: 14,
                    className: cn(s.colorClass, '!bg-transparent'),
                    "aria-hidden": true,
                  }) : null}
                {s.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Just a badge (no dropdown)
  return (
    <Badge
      variant={current.badgeVariant as any}
      className={badgeClass}
      aria-label={ariaLabel || current.label}
      tabIndex={0}
    >
      {badgeContent}
    </Badge>
  );
}

export default Status;