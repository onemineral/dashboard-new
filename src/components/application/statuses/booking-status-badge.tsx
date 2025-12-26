import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {Dot} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { AppContext } from "@/contexts/app-context";

/**
 * All possible booking statuses from the backend
 */
export type BookingStatus =
  | "cancelled"
  | "confirmed"
  | "completed"
  | "expired_hold"
  | "expired_host_confirmation"
  | "hold"
  | "pending_host_confirmation"
  | "pending_payment"
  | "rejected_by_host"
  | "voided_by_customer"
  | "relocated";

/**
 * Status definition with display properties (without label)
 */
interface BookingStatusDefinition {
  icon: React.ElementType;
  colorClass: string;
}

/**
 * Map of booking statuses to their display properties
 */
const BOOKING_STATUS_CONFIG: Record<BookingStatus, BookingStatusDefinition> = {
  confirmed: {
    icon: Dot,
    colorClass: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  completed: {
    icon: Dot,
    colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  cancelled: {
    icon: Dot,
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  expired_hold: {
    icon: Dot,
    colorClass: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  },
  expired_host_confirmation: {
    icon: Dot,
    colorClass: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  },
  hold: {
    icon: Dot,
    colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  pending_host_confirmation: {
    icon: Dot,
    colorClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  pending_payment: {
    icon: Dot,
    colorClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  rejected_by_host: {
    icon: Dot,
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  voided_by_customer: {
    icon: Dot,
    colorClass: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  },
  relocated: {
    icon: Dot,
    colorClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

/**
 * Size variants for the badge
 */
const bookingBadgeVariants = cva("", {
  variants: {
    size: {
      default: "text-xs h-6 px-2.5 [&>svg]:size-3.5",
      sm: "text-[10px] h-5 px-1.5 [&>svg]:size-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface BookingStatusBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children" | "variant">,
    VariantProps<typeof bookingBadgeVariants> {
  /** The current booking status */
  status: BookingStatus;
  /** Show the status icon */
  showIcon?: boolean;
  /** Show the status label */
  showLabel?: boolean;
  /** Additional className for the badge */
  className?: string;
  /** data-testid for testing */
  "data-testid"?: string;
}

/**
 * BookingStatusBadge - A read-only badge component for displaying booking statuses.
 *
 * @example
 * ```tsx
 * <BookingStatusBadge status="confirmed" />
 * <BookingStatusBadge status="pending_payment" size="sm" />
 * <BookingStatusBadge status="cancelled" showIcon={false} />
 * ```
 */
export const BookingStatusBadge = React.memo<BookingStatusBadgeProps>(
  ({ status, size = "default", showLabel = true, showIcon = true, className, "data-testid": testId, ...props }) => {
    const { schema } = React.useContext(AppContext);
    const bookingStatusField = schema.findField('booking', 'status');
    const config = BOOKING_STATUS_CONFIG[status];

    if (!config) {
      return null;
    }

    const Icon = config.icon;
    const label = bookingStatusField?.possibleValues[status] || status;

    return (
      <Badge
        className={cn(
          "border-transparent flex items-center font-medium gap-0",
          config.colorClass,
          bookingBadgeVariants({ size }),
          className
        )}
        data-testid={testId || `booking-status-${status}`}
        {...props}
      >
        {showIcon && <Icon className={cn("shrink-0", config.colorClass)} aria-hidden="true" />}
        {showLabel && <span className={'pr-2'}>{label}</span>}
      </Badge>
    );
  }
);

BookingStatusBadge.displayName = "BookingStatusBadge";

export default BookingStatusBadge;