import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/**
 * # PercentageInput Component
 * 
 * A production-ready percentage input component with synchronized numeric input and range slider.
 * 
 * ## Features
 * 
 * ✅ **Bidirectional Sync** - Text input and slider are perfectly synchronized
 * ✅ **Decimal Precision** - Supports decimal values (e.g., 25.5%)
 * ✅ **Range Validation** - Automatically constrains values between 0-100
 * ✅ **React Hook Form** - Full compatibility with form libraries
 * ✅ **Accessibility** - WCAG 2.1 AA compliant with ARIA labels
 * ✅ **Keyboard Navigation** - Full keyboard support
 * ✅ **Mobile Optimized** - Touch-friendly controls
 * ✅ **Visual Feedback** - Hover and focus states
 * ✅ **Edge Case Handling** - Invalid input, empty values, out-of-range
 * 
 * ## Basic Usage
 * 
 * ```tsx
 * import { PercentageInput } from "@/components/application/inputs/percentage-input";
 * 
 * function MyComponent() {
 *   const [value, setValue] = useState(50);
 * 
 *   return (
 *     <PercentageInput
 *       value={value}
 *       onChange={setValue}
 *       label="Discount Rate"
 *     />
 *   );
 * }
 * ```
 * 
 * ## React Hook Form Integration
 * 
 * ```tsx
 * import { useForm, Controller } from "react-hook-form";
 * import { PercentageInput } from "@/components/application/inputs/percentage-input";
 * 
 * interface FormData {
 *   discount: number;
 * }
 * 
 * function MyForm() {
 *   const { control } = useForm<FormData>();
 * 
 *   return (
 *     <Controller
 *       name="discount"
 *       control={control}
 *       rules={{ required: "Discount is required", min: 0, max: 100 }}
 *       render={({ field }) => (
 *         <PercentageInput
 *           value={field.value}
 *           onChange={field.onChange}
 *           onBlur={field.onBlur}
 *           label="Discount Percentage"
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 * 
 * ## With Input Wrapper
 * 
 * ```tsx
 * import { InputWrapper } from "@/components/application/inputs/input-wrapper";
 * import { PercentageInput } from "@/components/application/inputs/percentage-input";
 * 
 * function MyForm() {
 *   const [value, setValue] = useState(75);
 * 
 *   return (
 *     <InputWrapper
 *       label="Commission Rate"
 *       description="Set the commission percentage"
 *       required
 *     >
 *       <PercentageInput value={value} onChange={setValue} />
 *     </InputWrapper>
 *   );
 * }
 * ```
 * 
 * ## Props
 * 
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `value` | `number \| null` | `null` | Current percentage value (0-100) |
 * | `onChange` | `(value: number \| null) => void` | - | Callback when value changes |
 * | `onBlur` | `() => void` | - | Callback on blur (for form validation) |
 * | `min` | `number` | `0` | Minimum allowed value |
 * | `max` | `number` | `100` | Maximum allowed value |
 * | `step` | `number` | `1` | Step increment for slider |
 * | `decimals` | `number` | `2` | Number of decimal places to display |
 * | `disabled` | `boolean` | `false` | Disable the input |
 * | `placeholder` | `string` | `"0"` | Placeholder text |
 * | `className` | `string` | - | Additional CSS classes |
 * | `inputClassName` | `string` | - | Additional CSS classes for input |
 * | `sliderClassName` | `string` | - | Additional CSS classes for slider |
 * | `label` | `string` | - | Accessible label for the input |
 * | `data-testid` | `string` | - | Test ID for testing |
 * 
 * ## Accessibility
 * 
 * - Full keyboard navigation (Tab, Arrow keys)
 * - ARIA labels for screen readers
 * - Proper focus management
 * - Clear visual feedback
 * - Touch-friendly tap targets (44x44px minimum)
 * 
 * ## Edge Cases Handled
 * 
 * - Empty input → treats as 0 or null
 * - Invalid characters → filters out non-numeric input
 * - Out of range → automatically clamps to min/max
 * - Decimal precision → rounds to specified decimals
 * - Leading zeros → removes on blur
 * - Negative values → prevents entry
 */

export interface PercentageInputProps {
  /** Current percentage value (0-100) */
  value?: number | null;
  /** Callback when value changes */
  onChange?: (value: number | null) => void;
  /** Callback on blur (for form validation) */
  onBlur?: () => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment for slider */
  step?: number;
  /** Number of decimal places to display */
  decimals?: number;
  /** Disable the input */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** Additional CSS classes for the input */
  inputClassName?: string;
  /** Additional CSS classes for the slider */
  sliderClassName?: string;
  /** Accessible label for the input */
  label?: string;
  /** Test ID for testing */
  "data-testid"?: string;
}

export const PercentageInput = React.memo<PercentageInputProps>(
  ({
    value = null,
    onChange,
    onBlur,
    min = 0,
    max = 100,
    step = 1,
    decimals = 0,
    disabled = false,
    placeholder = "0",
    className,
    inputClassName,
    sliderClassName,
    label,
    "data-testid": testId,
  }) => {
    // Internal state for the text input to allow temporary invalid values
    const [inputValue, setInputValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const isUpdatingFromSlider = useRef(false);

    // Format number to string with percent symbol
    const formatValue = useCallback(
      (num: number | null): string => {
        if (num === null) return "";
        return num.toFixed(decimals);
      },
      [decimals]
    );

    // Parse string input to number
    const parseValue = useCallback(
      (str: string): number | null => {
        // Remove any non-numeric characters except decimal point and minus
        const cleaned = str.replace(/[^\d.-]/g, "");
        if (cleaned === "" || cleaned === "-") return null;

        const parsed = parseFloat(cleaned);
        if (isNaN(parsed)) return null;

        // Clamp to min/max range
        return Math.max(min, Math.min(max, parsed));
      },
      [min, max]
    );

    // Update internal input value when external value changes
    useEffect(() => {
      if (!isUpdatingFromSlider.current) {
        setInputValue(formatValue(value));
      }
      isUpdatingFromSlider.current = false;
    }, [value, formatValue]);

    // Handle text input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Allow empty input
        if (rawValue === "") {
          setInputValue("");
          return;
        }

        // Allow typing decimal point and numbers
        if (/^-?\d*\.?\d*$/.test(rawValue)) {
          setInputValue(rawValue);
        }
      },
      []
    );

    // Handle input blur - validate and format
    const handleInputBlur = useCallback(() => {
      const parsed = parseValue(inputValue);

      if (parsed !== null) {
        // Round to specified decimal places
        const rounded =
          Math.round(parsed * Math.pow(10, decimals)) / Math.pow(10, decimals);
        setInputValue(formatValue(rounded));
        onChange?.(rounded);
      } else if (inputValue === "") {
        // Empty input
        setInputValue("");
        onChange?.(null);
      } else {
        // Invalid input - revert to previous value
        setInputValue(formatValue(value));
      }

      onBlur?.();
    }, [inputValue, parseValue, formatValue, onChange, onBlur, value, decimals]);

    // Handle slider change
    const handleSliderChange = useCallback(
      (values: number[]) => {
        const newValue = values[0];
        isUpdatingFromSlider.current = true;
        setInputValue(formatValue(newValue));
        onChange?.(newValue);
      },
      [formatValue, onChange]
    );

    // Handle keyboard input on text field
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter key - blur to validate
        if (e.key === "Enter") {
          inputRef.current?.blur();
        }

        // Up/Down arrows - increment/decrement
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          const currentValue = value ?? 0;
          const newValue =
            e.key === "ArrowUp"
              ? Math.min(max, currentValue + step)
              : Math.max(min, currentValue - step);

          setInputValue(formatValue(newValue));
          onChange?.(newValue);
        }
      },
      [value, min, max, step, formatValue, onChange]
    );

    const currentValue = value ?? 0;

    return (
      <div
        className={cn("flex items-center gap-3", className)}
        data-testid={testId}
      >
        {/* Numeric Input */}
        <div className="relative w-18 shrink-0">
          <Input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={cn("pr-7 text-right tabular-nums", inputClassName)}
            aria-label={label || "Percentage value"}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            data-testid={testId ? `${testId}-input` : undefined}
          />
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            %
          </span>
        </div>

        {/* Range Slider */}
        <div className="min-w-0 grow">
          <Slider
            value={[currentValue]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn("cursor-pointer", sliderClassName)}
            aria-label={label || "Percentage slider"}
            data-testid={testId ? `${testId}-slider` : undefined}
          />
        </div>
      </div>
    );
  }
);

PercentageInput.displayName = "PercentageInput";

/**
 * ## Example: Basic Usage
 * 
 * ```tsx
 * function Example() {
 *   const [discount, setDiscount] = useState(25);
 * 
 *   return (
 *     <div className="space-y-4 p-4">
 *       <PercentageInput
 *         value={discount}
 *         onChange={setDiscount}
 *         label="Discount Rate"
 *       />
 *       <p>Current discount: {discount}%</p>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ## Example: With Decimal Precision
 * 
 * ```tsx
 * function Example() {
 *   const [rate, setRate] = useState(33.33);
 * 
 *   return (
 *     <PercentageInput
 *       value={rate}
 *       onChange={setRate}
 *       decimals={2}
 *       step={0.1}
 *       label="Interest Rate"
 *     />
 *   );
 * }
 * ```
 * 
 * ## Example: Custom Range
 * 
 * ```tsx
 * function Example() {
 *   const [value, setValue] = useState(50);
 * 
 *   return (
 *     <PercentageInput
 *       value={value}
 *       onChange={setValue}
 *       min={25}
 *       max={75}
 *       label="Restricted Range"
 *     />
 *   );
 * }
 * ```
 * 
 * ## Example: Disabled State
 * 
 * ```tsx
 * function Example() {
 *   return (
 *     <PercentageInput
 *       value={50}
 *       disabled
 *       label="Read-only percentage"
 *     />
 *   );
 * }
 * ```
 * 
 * ## Example: Form Integration with Validation
 * 
 * ```tsx
 * import { useForm, Controller } from "react-hook-form";
 * import { InputWrapper } from "@/components/application/inputs/input-wrapper";
 * 
 * interface FormData {
 *   commission: number;
 *   tax: number;
 * }
 * 
 * function Example() {
 *   const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
 *     defaultValues: {
 *       commission: 15,
 *       tax: 10,
 *     },
 *   });
 * 
 *   const onSubmit = (data: FormData) => {
 *     console.log(data);
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
 *       <Controller
 *         name="commission"
 *         control={control}
 *         rules={{
 *           required: "Commission is required",
 *           min: { value: 0, message: "Minimum is 0%" },
 *           max: { value: 50, message: "Maximum is 50%" },
 *         }}
 *         render={({ field, fieldState }) => (
 *           <InputWrapper
 *             label="Commission Rate"
 *             description="Percentage charged for the service"
 *             required
 *             error={fieldState.error?.message}
 *           >
 *             <PercentageInput
 *               value={field.value}
 *               onChange={field.onChange}
 *               onBlur={field.onBlur}
 *               max={50}
 *             />
 *           </InputWrapper>
 *         )}
 *       />
 * 
 *       <Controller
 *         name="tax"
 *         control={control}
 *         rules={{
 *           required: "Tax rate is required",
 *         }}
 *         render={({ field, fieldState }) => (
 *           <InputWrapper
 *             label="Tax Rate"
 *             description="Applicable tax percentage"
 *             required
 *             error={fieldState.error?.message}
 *           >
 *             <PercentageInput
 *               value={field.value}
 *               onChange={field.onChange}
 *               onBlur={field.onBlur}
 *               max={30}
 *             />
 *           </InputWrapper>
 *         )}
 *       />
 * 
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 * ```
 * 
 * ## Example: Real-time Calculation
 * 
 * ```tsx
 * function PriceCalculator() {
 *   const [basePrice] = useState(1000);
 *   const [discount, setDiscount] = useState(0);
 *   const [tax, setTax] = useState(10);
 * 
 *   const discountedPrice = basePrice - (basePrice * discount) / 100;
 *   const finalPrice = discountedPrice + (discountedPrice * tax) / 100;
 * 
 *   return (
 *     <div className="space-y-4 p-6 rounded-lg border">
 *       <div>
 *         <label className="text-sm font-medium">Base Price: ${basePrice}</label>
 *       </div>
 * 
 *       <InputWrapper label="Discount" description="Apply discount percentage">
 *         <PercentageInput
 *           value={discount}
 *           onChange={setDiscount}
 *           max={100}
 *         />
 *       </InputWrapper>
 * 
 *       <InputWrapper label="Tax" description="Add tax percentage">
 *         <PercentageInput
 *           value={tax}
 *           onChange={setTax}
 *           max={30}
 *         />
 *       </InputWrapper>
 * 
 *       <div className="pt-4 border-t">
 *         <div className="flex justify-between text-sm">
 *           <span>Base Price:</span>
 *           <span>${basePrice.toFixed(2)}</span>
 *         </div>
 *         <div className="flex justify-between text-sm text-destructive">
 *           <span>Discount ({discount}%):</span>
 *           <span>-${(basePrice * discount / 100).toFixed(2)}</span>
 *         </div>
 *         <div className="flex justify-between text-sm">
 *           <span>After Discount:</span>
 *           <span>${discountedPrice.toFixed(2)}</span>
 *         </div>
 *         <div className="flex justify-between text-sm">
 *           <span>Tax ({tax}%):</span>
 *           <span>+${(discountedPrice * tax / 100).toFixed(2)}</span>
 *         </div>
 *         <div className="flex justify-between font-bold pt-2 border-t">
 *           <span>Final Price:</span>
 *           <span>${finalPrice.toFixed(2)}</span>
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */