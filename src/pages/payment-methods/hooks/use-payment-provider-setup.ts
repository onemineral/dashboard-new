import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { LegalEntity, PaymentGateway } from "@sdk/generated";

/**
 * usePaymentProviderSetup Hook
 *
 * Fetches legal entity and payment gateway data for payment provider setup pages.
 * Reduces code duplication across different payment provider connection pages.
 *
 * @param provider - Payment provider identifier (e.g., "PayPal", "AuthorizeNet", "Redsys")
 * @param legalEntityId - Optional legal entity ID from route params
 * @returns Legal entity, payment gateway, and loading/error states
 *
 * @example
 * ```tsx
 * const { legalEntity, paymentGateway, isLoading, hasError } =
 *   usePaymentProviderSetup("PayPal", legalEntityId);
 * ```
 */
export function usePaymentProviderSetup(
  provider: string,
  legalEntityId?: string
) {
  // Fetch legal entity
  const legalEntityQuery = useQuery({
    queryKey: ["legal-entity", legalEntityId],
    queryFn: async () => {
      const queryBody = legalEntityId
        ? { where: { conditions: [{ field: "id", eq: legalEntityId }] } }
        : {};

      const response = await api.legalEntity.query(queryBody);

      // Return the first legal entity (either the specified one or the first available)
      return response.response.data?.[0] || null;
    },
  });

  // Fetch payment gateway
  const paymentGatewayQuery = useQuery({
    queryKey: ["payment-gateway", provider],
    queryFn: async () => {
      const response = await api.paymentGateway.query({
        where: { conditions: [{ field: "provider", eq: provider }] },
      });

      return response.response.data?.[0] || null;
    },
  });

  // Computed states for convenience
  const isLoading = legalEntityQuery.isLoading || paymentGatewayQuery.isLoading;
  const hasError = legalEntityQuery.isError || paymentGatewayQuery.isError;

  return {
    legalEntity: legalEntityQuery.data as LegalEntity | null,
    paymentGateway: paymentGatewayQuery.data as PaymentGateway | null,
    isLoading,
    hasError,
  };
}