// AmenityFeaturedBadge.tsx
import * as React from "react";
import api from "@/lib/api";
import { CheckCircle, XCircle } from "lucide-react";
import Status, { StatusDefinition } from "./status-badge";
import { toast } from "sonner";
import { AppContext } from "@/contexts/app-context";
import { useIntl } from "react-intl";

type AmenityFeaturedStatus = "featured" | "not_featured";

interface Amenity {
  id: number | string;
  is_featured: boolean;
  [key: string]: any;
}

interface AmenityFeaturedBadgeProps {
  amenity: Amenity;
  disabled?: boolean;
  refetchQueryKeys?: Array<string | number>;
}

export const AmenityFeaturedBadge: React.FC<AmenityFeaturedBadgeProps> = ({
  amenity,
  disabled = false,
  refetchQueryKeys,
}) => {
  const { schema } = React.useContext(AppContext);
  const intl = useIntl();

  const AMENITY_FEATURED_STATUSES: StatusDefinition<AmenityFeaturedStatus>[] = React.useMemo(
    () => [
      {
        value: "featured",
        label: intl.formatMessage({ defaultMessage: "Featured", description: "Label for featured amenity status" }),
        icon: CheckCircle,
        colorClass: "bg-green-100 text-green-800",
        badgeVariant: "default",
      },
      {
        value: "not_featured",
        label: intl.formatMessage({ defaultMessage: "Not featured", description: "Label for not featured amenity status" }),
        icon: XCircle,
        colorClass: "bg-gray-100 text-gray-600",
        badgeVariant: "secondary",
      },
    ],
    [intl]
  );

  const currentStatus: AmenityFeaturedStatus = amenity.is_featured ? "featured" : "not_featured";

  const handleChange = async (newStatus: AmenityFeaturedStatus) => {
    try {
      const is_featured = newStatus === "featured";
      await api.amenity.update({ id: Number(amenity.id), is_featured });
      
      toast.success(
        intl.formatMessage({ defaultMessage: "Featured status updated", description: "Success message when amenity featured status is updated" }),
        {
          description: intl.formatMessage(
            {
              defaultMessage: 'Amenity is now "{status}".',
              description: "Description of the featured status update with the new status value"
            },
            {
              status: AMENITY_FEATURED_STATUSES.find((s) => s.value === newStatus)?.label ?? newStatus
            }
          ),
        }
      );
    } catch (error) {
      toast.error(
        intl.formatMessage({ defaultMessage: "Failed to update featured status", description: "Error message when amenity featured status update fails" }),
        {
          description: (error as Error)?.message || intl.formatMessage({ defaultMessage: "An error occurred.", description: "Generic error message" }),
        }
      );
      throw error;
    }
  };

  const canUpdate = !disabled && schema?.canAction?.("amenity", "update");

  return (
    <Status<AmenityFeaturedStatus>
      value={currentStatus}
      statuses={AMENITY_FEATURED_STATUSES}
      refetchQueryKeys={refetchQueryKeys}
      onChange={handleChange}
      disabled={!canUpdate}
      ariaLabel={AMENITY_FEATURED_STATUSES.find((s) => s.value === currentStatus)?.label}
      showDropdown={canUpdate}
    />
  );
};

export default AmenityFeaturedBadge;
