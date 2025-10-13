import * as React from "react";
import { cn } from "@/lib/utils";
import { CharacterCounter } from "./character-counter";

/**
 * Props for the Textarea component
 */
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  /** Current textarea value (controlled mode) */
  value?: string;
  /** Callback fired when textarea value changes */
  onChange?: (value: string) => void;
  /** Callback fired on blur for form validation */
  onBlur?: () => void;
  /** Maximum character limit */
  maxCharacters?: number;
  /** Show character count */
  showCount?: boolean;
  /** Warning threshold percentage (0-1) */
  warningThreshold?: number;
  /** Whether the input has an error state */
  error?: boolean;
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Textarea component
 * 
 * A textarea with integrated character count display positioned inside the textarea borders (bottom right).
 * Supports controlled/uncontrolled modes, character limits, visual feedback, and full React Hook Form compatibility.
 * 
 * @example
 * ```tsx
 * // Basic usage with character count
 * const [bio, setBio] = useState("");
 * <Textarea
 *   value={bio}
 *   onChange={setBio}
 *   maxCharacters={500}
 *   placeholder="Write your bio..."
 * />
 * 
 * // With React Hook Form
 * <Controller
 *   name="description"
 *   control={control}
 *   render={({ field }) => (
 *     <Textarea
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       maxCharacters={1000}
 *       placeholder="Enter description..."
 *     />
 *   )}
 * />
 * 
 * // Uncontrolled mode
 * <Textarea
 *   defaultValue="Initial text"
 *   maxCharacters={200}
 * />
 * 
 * // Without character limit (just shows count)
 * <Textarea
 *   value={text}
 *   onChange={setText}
 *   showCount
 * />
 * ```
 */
export const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
      {
        value,
        onChange,
        onBlur,
        maxCharacters,
        showCount = true,
        warningThreshold = 0.8,
        error = false,
        className,
        disabled = false,
        rows = 4,
        "data-testid": dataTestId,
        ...props
      },
      ref
    ) => {

      // Show counter if showCount is true or maxCharacters is defined
      const shouldShowCounter = showCount || maxCharacters !== undefined;

      /**
       * Handle textarea change
       */
      const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = e.target.value;

          // Call onChange callback
          onChange?.(newValue);
        },
        [onChange]
      );

      /**
       * Handle blur event
       */
      const handleBlur = React.useCallback(() => {
        onBlur?.();
      }, [onBlur]);

      return (
        <div
          className={cn("relative w-full")}
          data-testid={dataTestId}
        >
          <textarea
            ref={ref}
            data-slot="textarea"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={rows}
            aria-invalid={error}
            aria-describedby={
              shouldShowCounter ? `${dataTestId}-counter` : undefined
            }
            className={cn(
              "border-input  placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              // Add padding to bottom-right for counter
              shouldShowCounter && "pb-8",
              error && "border-destructive",
              className
            )}
            {...props}
          />
          
          {/* Character Counter */}
          <CharacterCounter
            characterCount={value?.length || 0}
            maxCharacters={maxCharacters}
            showCount={showCount}
            warningThreshold={warningThreshold}
            disabled={disabled}
            data-testid={dataTestId ? `${dataTestId}-counter` : undefined}
            id={dataTestId ? `${dataTestId}-counter` : undefined}
          />
        </div>
      );
    }
  )
);

Textarea.displayName = "Textarea";