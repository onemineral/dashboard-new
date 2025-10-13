import React from "react";
import { cn } from "@/lib/utils";

export interface AmountProps {
  /**
   * The numeric value to display
   */
  value: number;
  
  /**
   * ISO 4217 currency code (e.g., "USD", "EUR", "GBP")
   */
  currency: string;
  
  /**
   * Locale for formatting (defaults to user's locale)
   * @default navigator.language
   */
  locale?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to display the currency symbol
   * @default true
   */
  showCurrency?: boolean;
  
  /**
   * Minimum number of fraction digits
   * @default 2
   */
  minimumFractionDigits?: number;
  
  /**
   * Maximum number of fraction digits
   * @default 2
   */
  maximumFractionDigits?: number;
  
  /**
   * Test ID for testing
   */
  "data-testid"?: string;
}

/**
 * Amount component for displaying formatted currency values
 * 
 * @example
 * ```tsx
 * <Amount value={1234.56} currency="USD" />
 * // Output: $1,234.56
 * 
 * <Amount value={1234.56} currency="EUR" locale="de-DE" />
 * // Output: 1.234,56 €
 * 
 * <Amount value={1234.5} currency="GBP" minimumFractionDigits={0} />
 * // Output: £1,234.5
 * ```
 */
export const Amount = React.memo<AmountProps>(({
  value,
  currency,
  locale = typeof navigator !== "undefined" ? navigator.language : "en-US",
  className,
  showCurrency = true,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  "data-testid": testId,
}) => {
  const formattedAmount = React.useMemo(() => {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: showCurrency ? "currency" : "decimal",
        currency: showCurrency ? currency : undefined,
        minimumFractionDigits,
        maximumFractionDigits,
      });

      return formatter.format(value);
    } catch (error) {
      console.error(`Error formatting amount: ${error}`);
      // Fallback to basic formatting
      return `${showCurrency ? currency + " " : ""}${value.toFixed(minimumFractionDigits)}`;
    }
  }, [value, currency, locale, showCurrency, minimumFractionDigits, maximumFractionDigits]);

  return (
    <span
      className={cn("font-medium tabular-nums", className)}
      data-testid={testId}
      title={`${value} ${currency}`}
    >
      {formattedAmount}
    </span>
  );
});

Amount.displayName = "Amount";

export default Amount;