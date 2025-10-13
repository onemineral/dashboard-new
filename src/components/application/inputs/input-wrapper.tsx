import * as React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Validation state types for the input wrapper
 */
export type ValidationState = "default" | "error" | "success" | "warning";

/**
 * Layout orientation for label and input
 */
export type LabelLayout = "stacked" | "inline";

/**
 * Props for the InputWrapper component
 */
export interface InputWrapperProps {
  /** Unique identifier for the input field */
  id?: string;
  /** Label text for the input */
  label?: React.ReactNode;
  /** Helper text displayed below the input */
  description?: React.ReactNode;
  /** Error message to display */
  error?: string | boolean;
  /** Custom error renderer function */
  renderError?: (error: string) => React.ReactNode;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is optional (shows badge) */
  optional?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Layout orientation */
  layout?: LabelLayout;
  /** Validation state */
  state?: ValidationState;
  /** Info tooltip content */
  infoTooltip?: React.ReactNode;
  /** Prefix content (icons, text) */
  prefix?: React.ReactNode;
  /** Suffix content (icons, buttons) */
  suffix?: React.ReactNode;
  /** Additional className for the wrapper */
  className?: string;
  /** Additional className for the label */
  labelClassName?: string;
  /** Additional className for the input container */
  inputContainerClassName?: string;
  /** Additional className for the error message */
  errorClassName?: string;
  /** Additional className for the description */
  descriptionClassName?: string;
  /** Children (input component) */
  children: React.ReactNode;
  /** Hide error animation */
  disableErrorAnimation?: boolean;
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Get validation state icon
 */
const getStateIcon = (state: ValidationState) => {
  switch (state) {
    case "error":
      return <AlertCircle className="size-4 text-destructive" aria-hidden="true" />;
    case "success":
      return <CheckCircle2 className="size-4 text-green-600" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className="size-4 text-amber-600" aria-hidden="true" />;
    default:
      return null;
  }
};

/**
 * Get validation state styles
 */
const getStateStyles = (state: ValidationState) => {
  switch (state) {
    case "error":
      return "text-destructive";
    case "success":
      return "text-green-600";
    case "warning":
      return "text-amber-600";
    default:
      return "text-muted-foreground";
  }
};

/**
 * InputWrapper component
 * 
 * A universal wrapper for form inputs that provides consistent layout,
 * validation states, error messages, helper text, and accessibility features.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <InputWrapper label="Email" error={errors.email}>
 *   <Input type="email" {...register("email")} />
 * </InputWrapper>
 * 
 * // With React Hook Form
 * <Controller
 *   name="dateRange"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <InputWrapper
 *       label="Date Range"
 *       required
 *       error={fieldState.error?.message}
 *       description="Select the start and end dates"
 *     >
 *       <DateRangePicker
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *       />
 *     </InputWrapper>
 *   )}
 * />
 * 
 * // With prefix and suffix
 * <InputWrapper
 *   label="Website"
 *   prefix={<Globe className="size-4" />}
 *   suffix={<Button size="sm">Verify</Button>}
 * >
 *   <Input type="url" />
 * </InputWrapper>
 * ```
 */
export const InputWrapper = React.memo(
  React.forwardRef<HTMLDivElement, InputWrapperProps>(
    (
      {
        id: providedId,
        label,
        description,
        error,
        renderError,
        successMessage,
        warningMessage,
        required = false,
        optional = false,
        disabled = false,
        layout = "stacked",
        state: providedState,
        infoTooltip,
        prefix,
        suffix,
        className,
        labelClassName,
        inputContainerClassName,
        errorClassName,
        descriptionClassName,
        children,
        disableErrorAnimation = false,
        "data-testid": dataTestId,
      },
      ref
    ) => {
      // Generate unique ID if not provided
      const generatedId = React.useId();
      const id = providedId || generatedId;
      const descriptionId = `${id}-description`;
      const errorId = `${id}-error`;

      // Determine validation state
      const state = React.useMemo<ValidationState>(() => {
        if (providedState) return providedState;
        if (error) return "error";
        if (successMessage) return "success";
        if (warningMessage) return "warning";
        return "default";
      }, [providedState, error, successMessage, warningMessage]);

      // Get error message
      const errorMessage = React.useMemo(() => {
        if (typeof error === "string") return error;
        return null;
      }, [error]);

      // Get state message
      const stateMessage = React.useMemo(() => {
        if (errorMessage) return errorMessage;
        if (successMessage) return successMessage;
        if (warningMessage) return warningMessage;
        return null;
      }, [errorMessage, successMessage, warningMessage]);

      return (
        <div
          ref={ref}
          className={cn(
            "flex w-full",
            layout === "stacked" ? "flex-col gap-2" : "flex-row items-start gap-4",
            disabled && "opacity-50 pointer-events-none",
            className
          )}
          data-slot="input-wrapper"
          data-state={state}
          data-disabled={disabled}
          data-testid={dataTestId}
        >
          {/* Label Section */}
          {label && (
            <div
              className={cn(
                "flex items-center gap-2",
                layout === "inline" && "min-w-[120px] pt-2"
              )}
            >
              <Label
                htmlFor={id}
                className={cn(
                  "leading-none gap-1",
                  state === "error" && "text-destructive",
                  labelClassName
                )}
              >
                {label}
                {required && (
                  <span className="text-destructive" aria-label="required">
                    *
                  </span>
                )}
              </Label>

              {/* Optional Badge */}
              {optional && !required && (
                <Badge variant="outline" className="text-xs font-normal">
                  Optional
                </Badge>
              )}

              {/* Info Tooltip */}
              {infoTooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full hover:bg-accent size-5"
                      aria-label="More information"
                    >
                      <Info className="size-3.5 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" className="max-w-xs">
                    {infoTooltip}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}

          {/* Input Section */}
          <div className={cn("flex-1 flex flex-col gap-1.5", layout === "inline" && "flex-1")}>
            {/* Input Container with Prefix/Suffix */}
            <div
              className={cn(
                "relative flex items-center gap-2",
                inputContainerClassName
              )}
            >
              {/* Prefix */}
              {prefix && (
                <div className="flex items-center justify-center shrink-0" aria-hidden="true">
                  {prefix}
                </div>
              )}

              {/* Input/Children */}
              <div className="flex-1 min-w-0">
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                      id,
                      disabled: disabled || (child.props as any).disabled,
                      "aria-invalid": state === "error",
                      "aria-describedby": cn(
                        description && descriptionId,
                        stateMessage && errorId
                      )
                        .split(" ")
                        .filter(Boolean)
                        .join(" ") || undefined,
                    });
                  }
                  return child;
                })}
              </div>

              {/* Suffix */}
              {suffix && (
                <div className="flex items-center justify-center shrink-0" aria-hidden="true">
                  {suffix}
                </div>
              )}
            </div>

            {/* Description/Helper Text */}
            {description && (
              <p
                id={descriptionId}
                className={cn(
                  "text-sm text-muted-foreground",
                  descriptionClassName
                )}
              >
                {description}
              </p>
            )}

            {/* State Message (Error/Success/Warning) */}
            {stateMessage && (
              <div
                id={errorId}
                role="alert"
                aria-live="polite"
                className={cn(
                  "flex items-center gap-2 text-sm",
                  getStateStyles(state),
                  !disableErrorAnimation && "animate-in fade-in-0 slide-in-from-top-1 duration-200",
                  errorClassName
                )}
              >
                {getStateIcon(state)}
                <span className="flex-1">
                  {renderError && errorMessage
                    ? renderError(errorMessage)
                    : stateMessage}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
  )
);

InputWrapper.displayName = "InputWrapper";

/**
 * Export types for external use
 */
export type { ValidationState as InputWrapperValidationState, LabelLayout as InputWrapperLabelLayout };