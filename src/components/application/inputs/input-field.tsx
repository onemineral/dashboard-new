import * as React from "react";
import {Info, AlertCircle} from "lucide-react";
import {FormattedMessage} from "react-intl";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldContent,
} from "@/components/ui/field";

/**
 * Props for the InputField component
 */
export interface InputFieldProps {
    /** Unique identifier for the input field */
    id?: string;
    /** Label text for the input */
    label?: React.ReactNode;
    /** Helper text displayed below the input */
    description?: React.ReactNode;
    /** Error message to display */
    error?: string | boolean;
    /** Display error as tooltip with icon instead of inline message */
    errorsAsTooltip?: boolean;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is optional (shows badge) */
    optional?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Layout orientation */
    orientation?: 'responsive' | 'vertical';
    /** Info tooltip content */
    infoTooltip?: React.ReactNode;
    /** Additional className for the wrapper */
    className?: string;
    /** Additional className for the label */
    labelClassName?: string;
    /** Additional className for the error message */
    errorClassName?: string;
    /** Additional className for the description */
    descriptionClassName?: string;
    /** Children (input component) */
    children: React.ReactNode;
    /** Test ID for testing */
    "data-testid"?: string;
}

/**
 * InputField component
 *
 * A universal wrapper for form inputs that provides consistent layout,
 * validation states, error messages, helper text, and accessibility features.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InputField label="Email" error={errors.email}>
 *   <Input type="email" {...register("email")} />
 * </InputField>
 *
 * // With React Hook Form
 * <Controller
 *   name="dateRange"
 *   control={control}
 *   render={({ field, fieldState }) => (
 *     <InputField
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
 *     </InputField>
 *   )}
 * />
 *
 * ```
 */
export const InputField = React.memo(
    React.forwardRef<HTMLDivElement, InputFieldProps>(
        (
            {
                id: providedId,
                label,
                description,
                error,
                errorsAsTooltip = false,
                required = false,
                optional = false,
                disabled = false,
                orientation = "vertical",
                infoTooltip,
                className,
                labelClassName,
                errorClassName,
                descriptionClassName,
                children,
                "data-testid": dataTestId,
            },
            ref
        ) => {
            // Generate unique ID if not provided
            const generatedId = React.useId();
            const id = providedId || generatedId;
            const descriptionId = `${id}-description`;
            const errorId = `${id}-error`;

            // Get error message
            const errorMessage = React.useMemo(() => {
                if (typeof error === "string") return error;
                return null;
            }, [error]);

            // Determine if field has error
            const hasError = !!error;

            return (
                <Field
                    ref={ref}
                    orientation={orientation}
                    data-invalid={hasError}
                    data-disabled={disabled}
                    data-testid={dataTestId}
                    className={cn('gap-1', className)}
                >
                    {/* Label Section */}
                    {(label || description) && (<FieldContent className={'gap-1'}>
                        {label && (
                            <FieldLabel
                                htmlFor={id}
                                className={labelClassName}
                            >
                            <span>
                                {label}
                                {required && (
                                    <span className="text-destructive ml-1">
                                        <FormattedMessage defaultMessage="*" description="Required field indicator"/>
                                    </span>
                                )}
                            </span>

                                {/* Optional Badge */}
                                {optional && !required && (
                                    <Badge variant="secondary" className="text-xs font-normal">
                                        <FormattedMessage defaultMessage="Optional"
                                                          description="Badge text for optional form fields"/>
                                    </Badge>
                                )}

                                {/* Info Tooltip */}
                                {infoTooltip && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center justify-center rounded-full hover:bg-accent size-5"
                                                    >
                                                        <Info className="size-3.5 text-muted-foreground"/>
                                                    </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="center" className="max-w-80">
                                            {infoTooltip}
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </FieldLabel>
                        )}
                        {/* Description/Helper Text */}
                        {description && (
                            <FieldDescription
                                id={descriptionId}
                                className={descriptionClassName}
                            >
                                {description}
                            </FieldDescription>
                        )}
                    </FieldContent>)}

                    <div className={'relative'}>
                        {/* Input/Children */}
                        {React.Children.map(children, (child) => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child as React.ReactElement<any>, {
                                    id,
                                    disabled: disabled || (child.props as any).disabled,
                                    "aria-invalid": hasError,
                                    "aria-describedby": cn(
                                        description && descriptionId,
                                        errorMessage && errorId
                                    )
                                        .split(" ")
                                        .filter(Boolean)
                                        .join(" ") || undefined,
                                });
                            }
                            return child;
                        })}

                        {/* Error as Tooltip Icon - Positioned absolutely to the right of the input */}
                        {errorsAsTooltip && errorMessage && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full hover:bg-destructive/10 size-5! z-10"
                                    >
                                        <AlertCircle className="size-4 text-destructive"/>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center">
                                    {errorMessage}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* Error Message (only show if not using tooltip mode) */}
                    {errorMessage && !errorsAsTooltip && (
                        <FieldError id={errorId} className={errorClassName}>
                            {errorMessage}
                        </FieldError>
                    )}
                </Field>
            );
        }
    )
);

InputField.displayName = "InputField";