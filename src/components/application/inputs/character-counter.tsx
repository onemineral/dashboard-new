import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the CharacterCounter component
 */
export interface CharacterCounterProps {
  /** Current character count */
  characterCount: number;
  /** Maximum character limit (optional) */
  maxCharacters?: number;
  /** Show character count */
  showCount?: boolean;
  /** Warning threshold percentage (0-1) */
  warningThreshold?: number;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS class name for counter */
  className?: string;
  /** Test ID for testing */
  "data-testid"?: string;
  /** ID for aria-describedby */
  id?: string;
}

/**
 * CharacterCounter Component
 * 
 * A reusable character counter that displays character count with visual feedback.
 * Shows current count, limit status, and color-coded warnings for approaching/exceeded limits.
 * 
 * @example
 * ```tsx
 * // Basic usage with limit
 * <CharacterCounter
 *   characterCount={250}
 *   maxCharacters={500}
 * />
 * 
 * // With warning threshold
 * <CharacterCounter
 *   characterCount={450}
 *   maxCharacters={500}
 *   warningThreshold={0.8}
 * />
 * 
 * // Just show count without limit
 * <CharacterCounter
 *   characterCount={100}
 *   showCount={true}
 * />
 * 
 * // Disabled state
 * <CharacterCounter
 *   characterCount={50}
 *   maxCharacters={100}
 *   disabled={true}
 * />
 * ```
 */
export const CharacterCounter = React.memo(
  React.forwardRef<HTMLDivElement, CharacterCounterProps>(
    (
      {
        characterCount,
        maxCharacters,
        showCount = true,
        warningThreshold = 0.8,
        disabled = false,
        className,
        "data-testid": dataTestId,
        id,
      },
      ref
    ) => {
      // Validate and clamp warning threshold to valid range (0-1)
      const validatedWarningThreshold = React.useMemo(
        () => Math.max(0, Math.min(1, warningThreshold)),
        [warningThreshold]
      );

      // Determine if over limit
      const isOverLimit = React.useMemo(
        () => maxCharacters !== undefined && characterCount > maxCharacters,
        [maxCharacters, characterCount]
      );

      // Determine if approaching limit (warning state)
      const isApproachingLimit = React.useMemo(
        () =>
          maxCharacters !== undefined &&
          characterCount >= maxCharacters * validatedWarningThreshold &&
          characterCount <= maxCharacters,
        [maxCharacters, characterCount, validatedWarningThreshold]
      );

      // Show counter if showCount is true or maxCharacters is defined
      const shouldShowCounter = showCount || maxCharacters !== undefined;

      // Get counter text
      const counterText = React.useMemo(() => {
        if (maxCharacters !== undefined) {
          return `${characterCount} / ${maxCharacters}`;
        }
        return `${characterCount} characters`;
      }, [characterCount, maxCharacters]);

      // Get counter color classes
      const counterColorClass = React.useMemo(() => {
        if (isOverLimit) {
          return "text-destructive";
        }
        if (isApproachingLimit) {
          return "text-amber-600";
        }
        return "text-muted-foreground";
      }, [isOverLimit, isApproachingLimit]);

      if (!shouldShowCounter) {
        return null;
      }

      return (
        <div
          ref={ref}
          id={id}
          data-testid={dataTestId}
          className={cn(
            "absolute bottom-2 right-3 text-xs font-medium pointer-events-none transition-colors duration-200",
            counterColorClass,
            disabled && "opacity-50",
            className
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {counterText}
        </div>
      );
    }
  )
);

CharacterCounter.displayName = "CharacterCounter";