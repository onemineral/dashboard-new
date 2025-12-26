import * as React from "react";
import { Phone as PhoneIcon, ChevronDown, X } from "lucide-react";
import { parsePhoneNumberFromString, isValidPhoneNumber, CountryCode, getCountryCallingCode, AsYouType } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enCountries from "i18n-iso-countries/langs/en.json";
import { useIntl } from "react-intl";
import {cn, getFlagEmoji} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useIsMobile } from "@/hooks/use-mobile.ts";

// Register country translations
countries.registerLocale(enCountries);

/**
 * Props for the PhoneInput component
 */
export interface PhoneInputProps {
  /** Current phone number string (e.g., "+14155552671" or "+1 415 555 2671") */
  value?: string | null;
  /** Default phone number string for uncontrolled component */
  defaultValue?: string | null;
  /** Callback fired when phone changes - receives E.164 formatted string (e.g., "+14155552671") */
  onChange?: (value: string | null) => void;
  /** Callback fired on blur for form validation */
  onBlur?: () => void;
  /** Placeholder text when no phone is entered */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input has an error state */
  error?: boolean;
  /** Default country code to use (e.g., "US", "GB", "RO") */
  defaultCountry?: CountryCode;
  /** List of countries to allow (whitelist) */
  countries?: CountryCode[];
  /** List of countries to exclude (blacklist) */
  excludeCountries?: CountryCode[];
  /** Additional CSS class name */
  className?: string;
  /** Enable auto-formatting as user types */
  autoFormat?: boolean;
  /** Test ID for testing */
  "data-testid"?: string;
}

/**
 * Country item for the dropdown
 */
interface CountryItem {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
}

/**
 * Get all available countries with their info
 */
const getAllCountries = (
  allowedCountries?: CountryCode[],
  excludedCountries?: CountryCode[]
): CountryItem[] => {
  const countryCodes = Object.keys(countries.getNames("en")) as CountryCode[];
  
  return countryCodes
    .filter((code) => {
      // Filter by whitelist if provided
      if (allowedCountries && allowedCountries.length > 0) {
        return allowedCountries.includes(code);
      }
      // Filter by blacklist if provided
      if (excludedCountries && excludedCountries.length > 0) {
        return !excludedCountries.includes(code);
      }
      return true;
    })
    .map((code) => {
      try {
        const dialCode = getCountryCallingCode(code);
        return {
          code,
          name: countries.getName(code, "en") || code,
          dialCode: `+${dialCode}`,
          flag: getFlagEmoji(code),
        };
      } catch {
        return null;
      }
    })
    .filter((item): item is CountryItem => item !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * PhoneInput component for entering and validating international phone numbers
 * 
 * @example
 * ```tsx
 * // Controlled component
 * const [phone, setPhone] = useState<string | null>(null);
 * <PhoneInput value={phone} onChange={setPhone} defaultCountry="US" />
 *
 * // With validation and country restrictions
 * <PhoneInput
 *   value={phone}
 *   onChange={setPhone}
 *   defaultCountry="GB"
 *   countries={["GB", "US", "CA"]}
 *   error={!!errors.phone}
 *   autoFormat
 * />
 *
 * // With React Hook Form
 * <Controller
 *   name="phone"
 *   control={control}
 *   rules={{
 *     required: "Phone number is required",
 *     validate: (value) => {
 *       if (!value) return "Phone number is required";
 *       if (!isValidPhoneNumber(value)) {
 *         return "Invalid phone number";
 *       }
 *       return true;
 *     },
 *   }}
 *   render={({ field, fieldState }) => (
 *     <PhoneInput
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!fieldState.error}
 *       defaultCountry="RO"
 *     />
 *   )}
 * />
 *
 * // With InputWrapper
 * <InputWrapper
 *   label="Phone Number"
 *   required
 *   error={errors.phone?.message}
 *   description="Enter your phone number with country code"
 * >
 *   <PhoneInput
 *     value={phone}
 *     onChange={setPhone}
 *     defaultCountry="US"
 *   />
 * </InputWrapper>
 * ```
 */
export const PhoneInput = React.memo(
  React.forwardRef<HTMLInputElement, PhoneInputProps>(
    (
      {
        value,
        defaultValue,
        onChange,
        onBlur,
        placeholder,
        disabled = false,
        error = false,
        defaultCountry,
        countries: allowedCountries,
        excludeCountries,
        className,
        autoFormat = true,
        "data-testid": dataTestId,
      },
      ref
    ) => {
      const intl = useIntl();
      
      // State management
      const [open, setOpen] = React.useState(false);
      const [searchQuery, setSearchQuery] = React.useState("");
      const [internalValue, setInternalValue] = React.useState<string | null>(
        defaultValue || null
      );
      const [selectedCountry, setSelectedCountry] = React.useState<CountryItem | null>(null);
      const [inputValue, setInputValue] = React.useState("");
      const [hasInvalidCountryCode, setHasInvalidCountryCode] = React.useState(false);
      const [hasInvalidPhoneNumber, setHasInvalidPhoneNumber] = React.useState(false);
      const [isTyping, setIsTyping] = React.useState(false);
      const isMobile = useIsMobile();
      
      // Translated strings
      const placeholderText = placeholder || intl.formatMessage({
        defaultMessage: "Enter phone number",
        description: "Placeholder text for phone number input"
      });
      const selectCountryLabel = intl.formatMessage({
        defaultMessage: "Select country",
        description: "Aria label for country selector button"
      });
      const searchCountryPlaceholder = intl.formatMessage({
        defaultMessage: "Search country...",
        description: "Placeholder for country search input"
      });
      const noCountryFound = intl.formatMessage({
        defaultMessage: "No country found.",
        description: "Message when no countries match the search"
      });
      const clearPhoneLabel = intl.formatMessage({
        defaultMessage: "Clear phone number",
        description: "Aria label for clear phone number button"
      });
      
      // Ref for cursor position management
      const inputRef = React.useRef<HTMLInputElement | null>(null);
      const cursorPositionRef = React.useRef<number | null>(null);

      // Determine if component is controlled
      const isControlled = value !== undefined;
      const currentValue = isControlled ? value : internalValue;

      // Get available countries
      const availableCountries = React.useMemo(
        () => getAllCountries(allowedCountries, excludeCountries),
        [allowedCountries, excludeCountries]
      );

      // Filter countries based on search
      const filteredCountries = React.useMemo(() => {
        if (!searchQuery) return availableCountries;
        
        const query = searchQuery.toLowerCase();
        return availableCountries.filter(
          (country) =>
            country.name.toLowerCase().includes(query) ||
            country.code.toLowerCase().includes(query) ||
            country.dialCode.includes(query)
        );
      }, [availableCountries, searchQuery]);

      /**
       * Initialize selected country
       */
      React.useEffect(() => {
        if (currentValue) {
          // Try to parse the phone number to get the country
          try {
            const phoneNumber = parsePhoneNumberFromString(currentValue);
            if (phoneNumber && phoneNumber.country) {
              const country = availableCountries.find(
                (c) => c.code === phoneNumber.country
              );
              if (country) {
                setSelectedCountry(country);
                return;
              }
            }
          } catch {
            // If parsing fails, fall through to default
          }
        }
        
        // Set default country if no valid country detected
        if (!selectedCountry) {
          const country = availableCountries.find((c) => c.code === defaultCountry);
          if (country) {
            setSelectedCountry(country);
          }
        }
      }, [currentValue, defaultCountry, availableCountries, selectedCountry]);

      /**
       * Sync input value with current value - only on external value changes
       */
      React.useEffect(() => {
        // Don't sync if user is actively typing
        if (isTyping) return;
        
        // Only sync if the value actually changed (external update, not from user input)
        if (currentValue) {
          try {
            // Parse and format the phone number
            const phoneNumber = parsePhoneNumberFromString(currentValue);
            if (phoneNumber) {
              const displayValue = phoneNumber.formatInternational();
              // Only update if it's different from current input (avoid unnecessary updates)
              if (inputValue !== displayValue) {
                setInputValue(displayValue);
              }
              // Clear invalid flag when syncing to a valid value
              if (hasInvalidPhoneNumber) {
                setHasInvalidPhoneNumber(false);
              }
            } else {
              // If can't parse, just show the raw value
              if (inputValue !== currentValue) {
                setInputValue(currentValue);
              }
            }
          } catch {
            // If parsing fails, just show the raw value
            if (inputValue !== currentValue) {
              setInputValue(currentValue);
            }
          }
        } else if (!currentValue && selectedCountry && !inputValue) {
          // Only set default country code if input is completely empty
          setInputValue(`${selectedCountry.dialCode} `);
        }
      }, [currentValue, selectedCountry, isTyping, hasInvalidPhoneNumber, inputValue]);

      /**
       * Validate and parse phone number - handles input with country code
       * Returns null for incomplete numbers without setting error
       */
      const validatePhoneNumber = React.useCallback(
        (number: string, countryCode: CountryCode): string | null => {
          if (!number || !number.trim()) return null;

          try {
            // Remove any formatting characters except + and digits
            const cleanNumber = number.replace(/[^\d+]/g, "");
            
            // If number already has country code, use it directly
            let fullNumber = cleanNumber;
            if (!cleanNumber.startsWith("+")) {
              // Add country code if not present
              const dialCode = getCountryCallingCode(countryCode);
              fullNumber = `+${dialCode}${cleanNumber}`;
            }

            // Check if number is complete enough to validate
            // Don't validate very short numbers (still typing)
            const digitCount = fullNumber.replace(/\D/g, '').length;
            if (digitCount < 4) {
              // Too short, don't validate yet
              return null;
            }

            // Validate the phone number
            if (!isValidPhoneNumber(fullNumber)) {
              // Don't set error for incomplete numbers
              return null;
            }

            // Parse the phone number using the non-deprecated function
            const phoneNumber = parsePhoneNumberFromString(fullNumber);
            if (!phoneNumber) {
              return null;
            }

            // Return E.164 formatted phone number
            return phoneNumber.number;
          } catch (err) {
            // Don't set error while typing
            return null;
          }
        },
        []
      );

      /**
       * Handle input change - detect country code changes and apply formatting mask
       */
      const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          const cursorPosition = e.target.selectionStart || 0;
          
          // Only allow phone-related characters: digits, +, spaces, parentheses, and dashes
          // This automatically cleans pasted content with non-numeric characters
          const sanitizedValue = newValue.replace(/[^\d+\s\-()]/g, '');
          
          // Mark as typing
          setIsTyping(true);
          
          // Reset invalid flags when user starts typing
          if (hasInvalidCountryCode) {
            setHasInvalidCountryCode(false);
          }
          if (hasInvalidPhoneNumber) {
            setHasInvalidPhoneNumber(false);
          }

          // Detect country code from input
          const dialCodeMatch = sanitizedValue.match(/^\+(\d+)/);
          let detectedCountry: CountryItem | null = null;
          
          if (dialCodeMatch) {
            const inputDialCode = `+${dialCodeMatch[1]}`;
            // Find matching country by dial code - find longest match
            const matchingCountry = availableCountries
              .filter((c) => inputDialCode.startsWith(c.dialCode))
              .sort((a, b) => b.dialCode.length - a.dialCode.length)[0];
            
            if (matchingCountry) {
              detectedCountry = matchingCountry;
              // Update selected country if it changed
              if (matchingCountry.code !== selectedCountry?.code) {
                setSelectedCountry(matchingCountry);
                setHasInvalidCountryCode(false);
              }
            } else {
              // Country code doesn't match any available country
              setHasInvalidCountryCode(true);
            }
          } else if (sanitizedValue && !sanitizedValue.startsWith('+')) {
            // Input doesn't start with + but has content
            setHasInvalidCountryCode(true);
          }

          // Use detected or selected country
          const countryToUse = detectedCountry || selectedCountry || availableCountries.find((c) => c.code === defaultCountry);
          if (!countryToUse) {
            setInputValue(sanitizedValue);
            if (isControlled) {
              onChange?.(null);
            } else {
              setInternalValue(null);
            }
            return;
          }

          // Apply auto-formatting with AsYouType if enabled
          let formattedValue = sanitizedValue;
          let formatter: AsYouType | null = null;
          
          if (autoFormat && countryToUse) {
            try {
              formatter = new AsYouType(countryToUse.code);
              formattedValue = formatter.input(sanitizedValue);
              
              // Check if formatter has stopped accepting more input (number is complete)
              const formattedDigits = formattedValue.replace(/[^\d]/g, '').length;
              const inputDigits = sanitizedValue.replace(/[^\d]/g, '').length;
              const currentDigits = inputValue.replace(/[^\d]/g, '').length;
              
              // If we're trying to add more digits but formatter isn't accepting them, reject the input
              if (inputDigits > formattedDigits && currentDigits >= formattedDigits) {
                return;
              }
              
              // Additional check: if formatter indicates the number is complete, prevent further input
              if (formatter.getNumber() && inputDigits > currentDigits) {
                const phoneNumber = formatter.getNumber();
                if (phoneNumber && isValidPhoneNumber(phoneNumber.number as string)) {
                  // Number is complete and valid, don't allow more digits
                  if (inputDigits > formattedDigits) {
                    return;
                  }
                }
              }
            } catch {
              // If formatting fails, use the raw value
              formattedValue = sanitizedValue;
            }
          }

          // Hard limit: E.164 format allows max 15 digits
          const digitsInFormatted = formattedValue.replace(/[^\d]/g, '').length;
          if (digitsInFormatted > 15) {
            return;
          }

          // Calculate new cursor position based on digit count before cursor
          // This ensures cursor stays in the right place even when formatting changes
          
          // Count significant digits before the cursor in the original input
          const textBeforeCursor = newValue.substring(0, cursorPosition);
          const digitsBeforeCursor = (textBeforeCursor.match(/\d/g) || []).length;
          
          // Find the position in the formatted value where we have the same number of digits
          let newCursorPosition = 0;
          let digitCount = 0;
          
          for (let i = 0; i < formattedValue.length; i++) {
            if (/\d/.test(formattedValue[i])) {
              digitCount++;
              if (digitCount > digitsBeforeCursor) {
                break;
              }
            }
            newCursorPosition = i + 1;
          }
          
          // If we're at the end or past all digits, place cursor at end
          if (digitCount < digitsBeforeCursor || digitsBeforeCursor === 0 && cursorPosition === 0) {
            newCursorPosition = cursorPosition === 0 ? 0 : formattedValue.length;
          }
          
          // Store the cursor position to restore after render
          cursorPositionRef.current = newCursorPosition;

          // Update the input value with formatted text
          setInputValue(formattedValue);

          // Extract just the digits after country code to check if empty
          const digitsOnly = formattedValue.replace(/[^\d]/g, '');
          const countryDigits = countryToUse.dialCode.replace(/[^\d]/g, '');
          const nationalDigits = digitsOnly.slice(countryDigits.length);
          
          // If no national number, clear the value
          if (!nationalDigits) {
            if (isControlled) {
              onChange?.(null);
            } else {
              setInternalValue(null);
            }
            return;
          }

          // Try to validate, but don't clear on failure (allow incomplete input)
          try {
            const phoneNumber = validatePhoneNumber(formattedValue, countryToUse.code);
            
            if (phoneNumber) {
              if (isControlled) {
                onChange?.(phoneNumber);
              } else {
                setInternalValue(phoneNumber);
              }
              // Clear invalid flag when number becomes valid
              if (hasInvalidPhoneNumber) {
                setHasInvalidPhoneNumber(false);
              }
            } else {
              // Check if number looks complete but is invalid
              // A number is "complete" if it has enough digits for that country
              const digitsCount = formattedValue.replace(/[^\d]/g, '').length;
              if (digitsCount >= 10) {
                // Number has enough digits but is invalid
                // Try to validate it to see if it's truly invalid
                const fullNumber = formattedValue.replace(/[^\d+]/g, "");
                if (fullNumber.startsWith('+') && !isValidPhoneNumber(fullNumber)) {
                  setHasInvalidPhoneNumber(true);
                }
              }
            }
          } catch {
            // Allow typing to continue even if validation fails
          }
        },
        [selectedCountry, isControlled, onChange, validatePhoneNumber, availableCountries, defaultCountry, hasInvalidCountryCode, hasInvalidPhoneNumber, autoFormat, inputValue]
      );

      /**
       * Handle country selection from dropdown
       */
      const handleCountrySelect = React.useCallback(
        (country: CountryItem) => {
          setSelectedCountry(country);
          setOpen(false);
          setSearchQuery("");
          setIsTyping(false);

          // Extract the national number from current input (remove country code)
          let nationalNumber = inputValue;
          if (inputValue) {
            // Remove any existing country code
            nationalNumber = inputValue.replace(/^\+\d+\s*/, "").trim();
          }

          // Always show the new country code
          if (nationalNumber) {
            const newInputValue = `${country.dialCode} ${nationalNumber}`;
            setInputValue(newInputValue);
            
            try {
              const phoneNumber = validatePhoneNumber(newInputValue, country.code);
              if (phoneNumber) {
                if (isControlled) {
                  onChange?.(phoneNumber);
                } else {
                  setInternalValue(phoneNumber);
                }
              }
            } catch {
              // Allow incomplete numbers
            }
          } else {
            // Show country code even when empty
            setInputValue(`${country.dialCode} `);
            // Clear the phone value
            if (isControlled) {
              onChange?.(null);
            } else {
              setInternalValue(null);
            }
          }
        },
        [inputValue, isControlled, onChange, validatePhoneNumber]
      );

      /**
       * Handle clear button - maintain country code
       */
      const handleClear = React.useCallback(
        (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          // Clear the input
          setInputValue("");
          setHasInvalidCountryCode(false);
          setHasInvalidPhoneNumber(false);
          setIsTyping(false);

          if (isControlled) {
            onChange?.(null);
          } else {
            setInternalValue(null);
          }

          setTimeout(() => onBlur?.(), 0);
        },
        [isControlled, onChange, onBlur, selectedCountry]
      );

      /**
       * Handle input blur - validate complete number
       */
      const handleBlur = React.useCallback(() => {
        // Mark as no longer typing after a slight delay to prevent sync effect from running
        setTimeout(() => {
          setIsTyping(false);
        }, 0);
        onBlur?.();
      }, [onBlur]);

      /**
       * Handle keyboard navigation
       */
      const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Escape" && inputValue) {
            e.preventDefault();
            handleClear(e as any);
          }
        },
        [inputValue, handleClear]
      );

      /**
       * Restore cursor position after input value changes
       */
      React.useEffect(() => {
        if (cursorPositionRef.current !== null && inputRef.current && isTyping) {
          const position = cursorPositionRef.current;
          inputRef.current.setSelectionRange(position, position);
          cursorPositionRef.current = null;
        }
      }, [inputValue, isTyping]);

      /**
       * Combined ref handler
       */
      const handleRef = React.useCallback(
        (node: HTMLInputElement | null) => {
          inputRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        },
        [ref]
      );

      return (
        <div className={cn("flex flex-col gap-1", className)}>
          <div className="flex items-center gap-2" data-testid={dataTestId}>
            {/* Country Selector - Independent Button */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-label={selectCountryLabel}
                  disabled={disabled}
                  className={cn(
                    "px-3 gap-2 shrink-0 justify-start",
                  )}
                >
                  <span className="text-xl" aria-hidden="true">
                    {selectedCountry?.flag || "🌐"}
                  </span>
                  <ChevronDown className="size-4 opacity-50 shrink-0 ml-auto" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[300px]"
                align="start"
                side={isMobile ? "top" : "bottom"}
              >
                <Command>
                  <CommandInput
                    placeholder={searchCountryPlaceholder}
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>{noCountryFound}</CommandEmpty>
                    <CommandGroup>
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={`${country.name} ${country.code} ${country.dialCode}`}
                          onSelect={() => handleCountrySelect(country)}
                          className="min-h-[44px] md:min-h-[36px]"
                        >
                          <span className="text-xl mr-2" aria-hidden="true">
                            {country.flag}
                          </span>
                          <span className="flex-1">{country.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {country.dialCode}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Phone Number Input with Country Code */}
            <div className="relative flex-1">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 opacity-50 pointer-events-none" aria-hidden="true" />
              <Input
                ref={handleRef}
                type="tel"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                disabled={disabled}
                aria-invalid={error || hasInvalidCountryCode || hasInvalidPhoneNumber}
                className={cn(
                  "pl-9 pr-9",
                  (error || hasInvalidCountryCode || hasInvalidPhoneNumber) && "border-destructive focus-visible:ring-destructive"
                )}
                data-testid={`${dataTestId}-input`}
              />
              {inputValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm opacity-50 hover:opacity-100",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "min-w-[44px] min-h-[44px] md:min-w-[20px] md:min-h-[20px]",
                    "flex items-center justify-center"
                  )}
                  aria-label={clearPhoneLabel}
                  tabIndex={-1}
                >
                  <X className="size-4 shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  )
);

PhoneInput.displayName = "PhoneInput";

/**
 * Export types and utilities for external use
 */
export { isValidPhoneNumber, parsePhoneNumberFromString, type CountryCode };
