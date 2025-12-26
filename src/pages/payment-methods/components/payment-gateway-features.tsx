import { useIntl } from "react-intl";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

/**
 * PaymentGatewayFeatures Component
 *
 * Displays payment gateway features as badges with check/x icons.
 * Can show only available features or all possible features with availability status.
 *
 * @example
 * ```tsx
 * // Show only available features
 * <PaymentGatewayFeatures
 *   availableFeatures={["payment_links", "can_authorize_cards"]}
 *   mode="available-only"
 * />
 *
 * // Show all features with availability status
 * <PaymentGatewayFeatures
 *   availableFeatures={["payment_links", "can_authorize_cards"]}
 *   mode="all"
 * />
 * ```
 */

interface PaymentGatewayFeaturesProps {
  /** List of available feature codes */
  availableFeatures: string[];
  /** Display mode: show only available features or all features with status */
  mode?: "available-only" | "all";
  /** Optional CSS class */
  className?: string;
}

/**
 * All possible payment gateway features
 */
const ALL_POSSIBLE_FEATURES = [
  "payment_links",
  "can_authorize_cards",
  "can_run_plain_text_credit_card",
  "can_store_credit_card",
  "can_process_refund",
] as const;

export function PaymentGatewayFeatures({
  availableFeatures,
  mode = "available-only",
  className = "",
}: PaymentGatewayFeaturesProps) {
  const intl = useIntl();

  /**
   * Get human-readable label for a feature code
   */
  const getFeatureLabel = (feature: string): string => {
    const featureLabels: Record<string, string> = {
      payment_links: intl.formatMessage({
        defaultMessage: "Payment Links",
        description: "Payment gateway feature: payment links",
      }),
      can_authorize_cards: intl.formatMessage({
        defaultMessage: "Security Deposit Pre-Authorization",
        description: "Payment gateway feature: card authorization",
      }),
      can_run_plain_text_credit_card: intl.formatMessage({
        defaultMessage: "OTA Credit Card Processing",
        description: "Payment gateway feature: OTA credit card processing",
      }),
      can_store_credit_card: intl.formatMessage({
        defaultMessage: "Save Payment Methods",
        description: "Payment gateway feature: store credit cards",
      }),
      can_process_refund: intl.formatMessage({
        defaultMessage: "Direct Refund Processing",
        description: "Payment gateway feature: process refunds",
      }),
    };
    return featureLabels[feature] || feature;
  };

  // Determine which features to display
  const featuresToDisplay =
    mode === "all"
      ? ALL_POSSIBLE_FEATURES
      : // In available-only mode, always include payment_links even if not in availableFeatures
        Array.from(
          new Set(["payment_links", ...availableFeatures])
        );

  // Sort features: available ones first, then unavailable
  const sortedFeatures = [...featuresToDisplay].sort((a, b) => {
    const isAAvailable = a === "payment_links" || availableFeatures.includes(a);
    const isBAvailable = b === "payment_links" || availableFeatures.includes(b);
    
    // Available features come first
    if (isAAvailable && !isBAvailable) return -1;
    if (!isAAvailable && isBAvailable) return 1;
    return 0;
  });

  return (
    <div className={`flex flex-wrap md:grid-cols-2 gap-2 ${className}`}>
      {sortedFeatures.map((feature) => {
        // Payment links is always available for all gateways
        const isAvailable =
          feature === "payment_links" ||
          availableFeatures.includes(feature);

        return (
          <Badge
            key={feature}
            variant={"outline"}
            className={`gap-1.5 ${
              isAvailable ? "" : "opacity-70"
            }`}
          >
            {isAvailable ? (
              <Check className="size-3 text-green-600 dark:text-green-400" />
            ) : (
              <X className="size-3 text-red-600" />
            )}
            {getFeatureLabel(feature)}
          </Badge>
        );
      })}
    </div>
  );
}