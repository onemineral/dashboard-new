// PropertyStatusBadge.tsx
import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { AppContext } from "@/contexts/app-context";
import { Property } from "@onemineral/pms-js-sdk";
import Status, { StatusDefinition } from "./status-badge";
import { toast } from "sonner";

type PropertyStatus = "enabled" | "disabled" | "pending";

const PROPERTY_STATUSES: StatusDefinition<PropertyStatus>[] = [
  {
    value: "enabled",
    label: "Enabled",
    icon: CheckCircle,
    colorClass: "bg-green-100 text-green-800",
    badgeVariant: "default",
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    colorClass: "bg-yellow-100 text-yellow-800",
    badgeVariant: "secondary",
  },
  {
    value: "disabled",
    label: "Disabled",
    icon: XCircle,
    colorClass: "bg-gray-100 text-gray-500",
    badgeVariant: "destructive",
  },
];

interface PropertyStatusBadgeProps {
  property: Property;
  onStatusChange?: (status: PropertyStatus) => void;
  disabled?: boolean;
  /**
   * Optional array of react-query keys to invalidate/refetch when the property status is updated.
   * Each key can be a string, number, or an array (as accepted by react-query).
   */
  refetchQueryKeys?: Array<string | number>;
}

export const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({
  property,
  onStatusChange,
  disabled = false,
  refetchQueryKeys,
}) => {
  const [currentStatus, setCurrentStatus] = React.useState<PropertyStatus>(property.status as PropertyStatus);
  const { schema } = React.useContext(AppContext);

  const mutation = useMutation({
    mutationFn: async (newStatus: PropertyStatus) => {
      return await api.property.setStatus({ id: property.id, status: newStatus });
    },
    onMutate: async (newStatus) => {
      setCurrentStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    },
    onError: (error, newStatus, context) => {
      setCurrentStatus(property.status as PropertyStatus); // revert
      toast.error("Failed to update status", {
        description: (error as Error)?.message || "An error occurred.",
      });
      if (onStatusChange) onStatusChange(property.status as PropertyStatus);
    },
    onSuccess: async (data, newStatus) => {
      toast.success("Status updated", {
        description: `Property status set to "${
          PROPERTY_STATUSES.find((s) => s.value === newStatus)?.label ?? newStatus
        }".`,
      });
    },
  });

  const canUpdate = !disabled && schema.canAction("property", "set-status");

  return (
    <Status<PropertyStatus>
      value={currentStatus}
      statuses={PROPERTY_STATUSES}
      refetchQueryKeys={refetchQueryKeys}
      onChange={async (status) => {
        try {
          await mutation.mutateAsync(status);
        } catch (e) {
          console.error(e);
        }
      }}
      disabled={!canUpdate}
      ariaLabel={PROPERTY_STATUSES.find((s) => s.value === currentStatus)?.label}
      showDropdown={canUpdate}
    />
  );
};

export default PropertyStatusBadge;