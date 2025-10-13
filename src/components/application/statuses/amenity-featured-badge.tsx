// AmenityFeaturedBadge.tsx
import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { CheckCircle, XCircle } from "lucide-react";
import Status, { StatusDefinition } from "./status-badge";
import { toast } from "sonner";
import { AppContext } from "@/contexts/app-context";

type AmenityFeaturedStatus = "featured" | "not_featured";

const AMENITY_FEATURED_STATUSES: StatusDefinition<AmenityFeaturedStatus>[] = [
  {
    value: "featured",
    label: "Featured",
    icon: CheckCircle,
    colorClass: "bg-green-100 text-green-800",
    badgeVariant: "default",
  },
  {
    value: "not_featured",
    label: "Not featured",
    icon: XCircle,
    colorClass: "bg-gray-100 text-gray-600",
    badgeVariant: "secondary",
  },
];

interface Amenity {
  id: number | string;
  is_featured: boolean;
  [key: string]: any;
}

interface AmenityFeaturedBadgeProps {
  amenity: Amenity;
  onStatusChange?: (is_featured: boolean) => void;
  disabled?: boolean;
  refetchQueryKeys?: Array<string | number>;
}

export const AmenityFeaturedBadge: React.FC<AmenityFeaturedBadgeProps> = ({
  amenity,
  onStatusChange,
  disabled = false,
  refetchQueryKeys,
}) => {
  const [currentStatus, setCurrentStatus] = React.useState<AmenityFeaturedStatus>(
    amenity.is_featured ? "featured" : "not_featured"
  );
  // Keep currentStatus in sync with amenity.is_featured prop after refetch
  React.useEffect(() => {
    setCurrentStatus(amenity.is_featured ? "featured" : "not_featured");
  }, [amenity.is_featured]);
  const { schema } = React.useContext(AppContext);

  const mutation = useMutation({
    mutationFn: async (newStatus: AmenityFeaturedStatus) => {
      const is_featured = newStatus === "featured";
      return await api.amenity.update({ id: Number(amenity.id), is_featured });
    },
    onMutate: async (newStatus) => {
      setCurrentStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus === "featured");
    },
    onError: (error, newStatus, context) => {
      setCurrentStatus(amenity.is_featured ? "featured" : "not_featured"); // revert
      toast.error("Failed to update featured status", {
        description: (error as Error)?.message || "An error occurred.",
      });
      if (onStatusChange) onStatusChange(amenity.is_featured);
    },
    onSuccess: async (data, newStatus) => {
      toast.success("Featured status updated", {
        description: `Amenity is now "${
          AMENITY_FEATURED_STATUSES.find((s) => s.value === newStatus)?.label ?? newStatus
        }".`,
      });
    },
  });

  const canUpdate = !disabled && schema?.canAction?.("amenity", "update");

  return (
    <Status<AmenityFeaturedStatus>
      value={currentStatus}
      statuses={AMENITY_FEATURED_STATUSES}
      refetchQueryKeys={refetchQueryKeys}
      onChange={async (status) => {
        try {
          await mutation.mutateAsync(status);
        } catch (e) {
          console.error(e);
        }
      }}
      disabled={!canUpdate}
      ariaLabel={AMENITY_FEATURED_STATUSES.find((s) => s.value === currentStatus)?.label}
      showDropdown={canUpdate}
    />
  );
};

export default AmenityFeaturedBadge;
