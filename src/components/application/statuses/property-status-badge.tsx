// PropertyStatusBadge.tsx
import * as React from "react";
import api from "@/lib/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { AppContext } from "@/contexts/app-context";
import { Property } from "@onemineral/pms-js-sdk";
import Status, { StatusDefinition } from "./status-badge";
import { toast } from "sonner";
import { useIntl } from "react-intl";

type PropertyStatus = "enabled" | "disabled" | "pending";

interface PropertyStatusBadgeProps {
  property: Property;
  disabled?: boolean;
  /**
   * Optional array of react-query keys to invalidate/refetch when the property status is updated.
   * Each key can be a string, number, or an array (as accepted by react-query).
   */
  refetchQueryKeys?: Array<string | number>;
}

export const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({
  property,
  disabled = false,
  refetchQueryKeys,
}) => {
  const { schema } = React.useContext(AppContext);
  const intl = useIntl();
  
  const propertyStatusField = schema.findField('property', 'status');
  const PROPERTY_STATUSES: StatusDefinition<PropertyStatus>[] = [
      {
          value: "enabled",
          label: propertyStatusField?.possibleValues.enabled,
          icon: CheckCircle,
          colorClass: "bg-green-100 text-green-800",
          badgeVariant: "default",
      },
      {
          value: "pending",
          label: propertyStatusField?.possibleValues.pending,
          icon: Clock,
          colorClass: "bg-yellow-100 text-yellow-800",
          badgeVariant: "secondary",
      },
      {
          value: "disabled",
          label: propertyStatusField?.possibleValues.disabled,
          icon: XCircle,
          colorClass: "bg-gray-100 text-gray-500",
          badgeVariant: "destructive",
      },
  ];

  const handleChange = async (newStatus: PropertyStatus) => {
    try {
      await api.property.setStatus({ id: property.id, status: newStatus });
      
      toast.success(intl.formatMessage({ defaultMessage: "Status updated", description: "Success message when property status is updated" }), {
        description: intl.formatMessage(
          {
            defaultMessage: 'Property status set to "{status}".',
            description: "Description of the status update with the new status value"
          },
          {
            status: PROPERTY_STATUSES.find((s) => s.value === newStatus)?.label ?? newStatus
          }
        ),
      });
    } catch (error) {
      toast.error(intl.formatMessage({ defaultMessage: "Failed to update status", description: "Error message when property status update fails" }), {
        description: (error as Error)?.message || intl.formatMessage({ defaultMessage: "An error occurred.", description: "Generic error message" }),
      });
      throw error;
    }
  };

  const canUpdate = !disabled && schema.canAction("property", "set-status");

  return (
    <Status<PropertyStatus>
      value={property.status as PropertyStatus}
      statuses={PROPERTY_STATUSES}
      refetchQueryKeys={refetchQueryKeys}
      onChange={handleChange}
      disabled={!canUpdate}
      ariaLabel={PROPERTY_STATUSES.find((s) => s.value === property.status)?.label}
      showDropdown={canUpdate}
    />
  );
};

export default PropertyStatusBadge;