import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { FormattedMessage } from "react-intl";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

/**
 * Default color presets - carefully selected palette
 */
const DEFAULT_PRESETS = [
  "#000000", "#404040", "#808080", "#C0C0C0", "#FFFFFF",
  "#FF0000", "#FF8000", "#FFFF00", "#00FF00", "#00FFFF",
  "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080",
  "#8B0000", "#FF6347", "#FFD700", "#32CD32", "#1E90FF",
  "#4B0082", "#9370DB", "#FF69B4", "#FF1493", "#C71585"
];

/**
 * Props for the ColorPicker component
 */
export interface ColorPickerProps {
  /** Current color value (hex format) */
  value?: string;
  /** Default color (uncontrolled) */
  defaultValue?: string;
  /** Callback when color changes */
  onChange?: (color: string) => void;
  /** Callback on blur (for form validation) */
  onBlur?: () => void;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Placeholder for hex input */
  placeholder?: string;
  /** Custom preset colors */
  presets?: string[];
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  "data-testid"?: string;
  /** ID for the input field */
  id?: string;
  /** ARIA invalid state */
  "aria-invalid"?: boolean;
  /** ARIA describedby */
  "aria-describedby"?: string;
}

/**
 * Validate and normalize hex color
 */
const normalizeHexColor = (color: string): string => {
  // Remove any whitespace
  color = color.trim();
  
  // Add # if missing
  if (!color.startsWith("#")) {
    color = "#" + color;
  }
  
  // Convert to uppercase for consistency
  color = color.toUpperCase();
  
  // Validate hex format (3 or 6 characters)
  if (/^#[0-9A-F]{3}$/.test(color)) {
    // Convert 3-char hex to 6-char (e.g., #FFF -> #FFFFFF)
    const r = color[1];
    const g = color[2];
    const b = color[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  
  if (/^#[0-9A-F]{6}$/.test(color)) {
    return color;
  }
  
  // Invalid format, return as is (will show validation error)
  return color;
};

/**
 * Check if color is valid hex
 */
const isValidHex = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

/**
 * ColorPicker Component
 *
 * A comprehensive color picker with tabbed interface:
 * - Presets Tab: Quick selection from preset color palette
 * - Custom Tab: RGB spectrum picker with hex input for custom colors
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const [color, setColor] = useState("#3b82f6");
 * <ColorPicker value={color} onChange={setColor} />
 * 
 * // With InputWrapper
 * <InputWrapper label="Brand Color" required>
 *   <ColorPicker value={color} onChange={setColor} />
 * </InputWrapper>
 * 
 * // React Hook Form
 * <Controller
 *   name="color"
 *   control={control}
 *   render={({ field }) => (
 *     <ColorPicker
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *     />
 *   )}
 * />
 * ```
 */
export const ColorPicker = React.memo(
  React.forwardRef<HTMLDivElement, ColorPickerProps>(
    (
      {
        value: controlledValue,
        defaultValue = "#000000",
        onChange,
        onBlur,
        disabled = false,
        placeholder = "#000000",
        presets = DEFAULT_PRESETS,
        className,
        "data-testid": dataTestId,
        id,
        "aria-invalid": ariaInvalid,
        "aria-describedby": ariaDescribedby,
      },
      ref
    ) => {
      // Internal state for uncontrolled mode
      const [internalValue, setInternalValue] = React.useState(defaultValue);
      const [isOpen, setIsOpen] = React.useState(false);
      const [hexInput, setHexInput] = React.useState("");
      const [activeTab, setActiveTab] = React.useState<string>("presets");
      
      // Determine if component is controlled
      const isControlled = controlledValue !== undefined;
      const currentValue = isControlled ? controlledValue : internalValue;
      
      // Normalize current value
      const normalizedValue = React.useMemo(
        () => normalizeHexColor(currentValue),
        [currentValue]
      );
      
      // Update hex input when value changes
      React.useEffect(() => {
        setHexInput(normalizedValue);
      }, [normalizedValue]);
      
      // Handle color change from picker or presets
      const handleColorChange = React.useCallback(
        (newColor: string) => {
          const normalized = normalizeHexColor(newColor);
          
          if (!isControlled) {
            setInternalValue(normalized);
          }
          
          setHexInput(normalized);
          onChange?.(normalized);
        },
        [isControlled, onChange]
      );
      
      // Handle hex input change - only update input state, don't normalize while typing
      const handleHexInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const input = e.target.value;
          setHexInput(input);
          
          // Don't normalize while typing - wait for blur
          // Only validate if it's already a valid 6-char hex (without normalization)
          if (isValidHex(input)) {
            handleColorChange(input);
          }
        },
        [handleColorChange]
      );
      
      // Handle hex input blur - validate and normalize
      const handleHexInputBlur = React.useCallback(() => {
        const normalized = normalizeHexColor(hexInput);
        if (isValidHex(normalized)) {
          setHexInput(normalized);
          if (normalized !== normalizedValue) {
            handleColorChange(normalized);
          }
        } else {
          // Reset to current valid value
          setHexInput(normalizedValue);
        }
        onBlur?.();
      }, [hexInput, normalizedValue, handleColorChange, onBlur]);
      
      // Handle preset selection
      const handlePresetClick = React.useCallback(
        (color: string) => {
          handleColorChange(color);
        },
        [handleColorChange]
      );

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          data-testid={dataTestId}
        >
          {/* Color Display Button - Opens Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "relative w-9 shrink-0 rounded-md p-0 border-2",
                  "hover:scale-105 transition-transform",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
                )}
                aria-label="Open color picker"
                data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
              >
                <div
                  className="size-full rounded-sm"
                  style={{ backgroundColor: normalizedValue }}
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            
            <PopoverContent
              className="w-[280px] p-3"
              align="start"
              data-testid={dataTestId ? `${dataTestId}-popover` : undefined}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="presets" className="flex-1">
                    <FormattedMessage defaultMessage="Presets" description="Color picker presets tab label" />
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex-1">
                    <FormattedMessage defaultMessage="Custom" description="Color picker custom tab label" />
                  </TabsTrigger>
                </TabsList>
                
                {/* Presets Tab */}
                <TabsContent
                  value="presets"
                  className="space-y-2 mt-3"
                  data-testid={dataTestId ? `${dataTestId}-presets` : undefined}
                >
                  <div className="grid grid-cols-5 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          handlePresetClick(preset);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "relative size-10 rounded-md border-2 transition-all",
                          "hover:scale-110 hover:border-primary",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          normalizedValue.toUpperCase() === preset.toUpperCase()
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border"
                        )}
                        style={{ backgroundColor: preset }}
                        aria-label={`Select color ${preset}`}
                        data-testid={dataTestId ? `${dataTestId}-preset-${preset}` : undefined}
                      >
                        {normalizedValue.toUpperCase() === preset.toUpperCase() && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check
                              className="size-4 drop-shadow-md"
                              style={{
                                color: preset === "#000000" || preset === "#404040" || preset === "#8B0000" || preset === "#4B0082"
                                  ? "white"
                                  : "black"
                              }}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Custom Tab */}
                <TabsContent
                  value="custom"
                  className="space-y-3 mt-3"
                  data-testid={dataTestId ? `${dataTestId}-custom` : undefined}
                >
                  {/* RGB Spectrum Picker */}
                  <div
                    className="space-y-2"
                    data-testid={dataTestId ? `${dataTestId}-spectrum` : undefined}
                  >
                    <HexColorPicker
                      color={normalizedValue}
                      onChange={handleColorChange}
                      className="!w-full"
                    />
                  </div>
                  
                  {/* Hex Input */}
                  <div
                    className="space-y-2"
                    data-testid={dataTestId ? `${dataTestId}-hex-input` : undefined}
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      <FormattedMessage defaultMessage="Hex Code" description="Hex color code input label" />
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-9 shrink-0 rounded border-2 border-border"
                        style={{ backgroundColor: normalizedValue }}
                        aria-hidden="true"
                      />
                      <Input
                        type="text"
                        value={hexInput}
                        onChange={handleHexInputChange}
                        onBlur={handleHexInputBlur}
                        placeholder={placeholder}
                        className={cn(
                          "flex-1 font-mono uppercase text-sm h-9",
                          !isValidHex(hexInput) && hexInput !== normalizedValue && "border-destructive"
                        )}
                        maxLength={7}
                        aria-label="Hex color code"
                        data-testid={dataTestId ? `${dataTestId}-hex-field` : undefined}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <FormattedMessage defaultMessage="Enter hex code (e.g., #FF5733)" description="Hex color code input helper text" />
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
          
          {/* External Hex Input (always visible, read-only, click to open picker) */}
          <Input
            id={id}
            type="text"
            value={hexInput}
            readOnly
            onClick={() => !disabled && setIsOpen(true)}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "flex-1 font-mono uppercase",
              !isValidHex(hexInput) && hexInput !== normalizedValue && "border-destructive",
              !disabled && "transition-colors"
            )}
            maxLength={7}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedby}
            aria-label="Click to open color picker"
            data-testid={dataTestId ? `${dataTestId}-input` : undefined}
          />
        </div>
      );
    }
  )
);

ColorPicker.displayName = "ColorPicker";

/**
 * Export utility functions for external use
 */
export { normalizeHexColor, isValidHex, DEFAULT_PRESETS };