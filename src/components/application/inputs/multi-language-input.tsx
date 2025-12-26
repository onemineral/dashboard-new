import * as React from "react";
import {cn} from "@/lib/utils";
import {useContext} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {LanguageTabs, MultiLanguageValue} from "./language-tabs";
import {CharacterCounter} from "./character-counter";

/**
 * Props for the MultiLanguageInput component
 */
export interface MultiLanguageInputProps {
    /** Current multi-language value (controlled) */
    value: MultiLanguageValue;
    /** Callback when the complete multi-language value changes */
    onChange?: (value: MultiLanguageValue) => void;
    /** Callback on blur (for form validation) */
    onBlur?: () => void;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Whether the input has an error */
    error?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Maximum character limit per language */
    maxCharacters?: number;
    /** Minimum character requirement per language */
    minCharacters?: number;
    /** Show character count */
    showCount?: boolean;
    /** Warning threshold percentage (0-1) */
    warningThreshold?: number;
    /** Test ID for testing */
    "data-testid"?: string;
}

/**
 * MultiLanguageInput Component
 *
 * A single-line input component that supports multi-language input with integrated language tabs and character counting.
 * Features horizontal tab layout optimized for single-line inputs.
 *
 * Features:
 * - 20 supported languages with flag icons
 * - Visual indicator (dot) for tabs with content
 * - Character counter with limit validation (per language)
 * - Visual feedback (warning/error states) for character limits
 * - Horizontal tab layout (tabs on top)
 * - Content preserved when switching languages
 * - Works with React Hook Form and InputWrapper
 * - Fully accessible with ARIA attributes
 * - Mobile responsive
 *
 * @example
 * ```tsx
 * // Basic usage - Controlled
 * const [value, setValue] = useState<MultiLanguageValue>({
 *   en: "Welcome",
 *   es: "Bienvenido",
 *   fr: "Bienvenue"
 * });
 *
 * <MultiLanguageInput
 *   value={value}
 *   onChange={setValue}
 *   placeholder="Enter text..."
 * />
 *
 * // With character limit
 * <MultiLanguageInput
 *   value={value}
 *   onChange={setValue}
 *   minCharacters={5}
 *   maxCharacters={100}
 *   placeholder="Enter title..."
 * />
 *
 * // With InputWrapper (recommended)
 * <InputWrapper
 *   label="Product Name"
 *   description="Provide names in multiple languages"
 *   required
 * >
 *   <MultiLanguageInput
 *     value={value}
 *     onChange={setValue}
 *     maxCharacters={200}
 *   />
 * </InputWrapper>
 * ```
 *
 * Value Format:
 * ```tsx
 * type MultiLanguageValue = {
 *   [locale: string]: string | null;
 * } | null;
 *
 * // Examples:
 * { en: "Hello", es: "Hola" }     // Multiple languages
 * { en: "Hello" }                  // Single language
 * null                             // No content
 * ```
 */
export const MultiLanguageInput = React.memo(
    React.forwardRef<HTMLInputElement, MultiLanguageInputProps>(
        (
            {
                value,
                onChange,
                onBlur,
                placeholder = "Enter text...",
                disabled = false,
                error = false,
                className,
                maxCharacters,
                minCharacters,
                showCount = true,
                warningThreshold = 0.8,
                "data-testid": dataTestId,
            },
            ref
        ) => {
            const {languages: LANGUAGES} = useContext(AppContext);

            // Validate languages array
            if (!LANGUAGES || LANGUAGES.length === 0) {
                throw new Error('MultiLanguageInput: No languages available in AppContext');
            }

            // Current selected language (managed by LanguageTabs via onChange callback)
            const [selectedLocale, setSelectedLocale] = React.useState<string>(LANGUAGES[0].locale);

            // Get current text for selected locale
            const currentText = React.useMemo(() => {
                if (!value || !value[selectedLocale]) return "";
                return value[selectedLocale] || "";
            }, [value, selectedLocale]);

            // Handle input content change - updates the specific locale in the multi-language object
            const handleTextChange = React.useCallback(
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    const newText = e.target.value;
                    
                    // Create new multi-language value with updated text for current locale
                    const newValue: MultiLanguageValue = {
                        ...(value || {}),
                        [selectedLocale]: newText || null,
                    };

                    // Emit the complete updated multi-language object
                    onChange?.(newValue);
                },
                [value, selectedLocale, onChange]
            );

            return (
                <LanguageTabs
                    value={value}
                    onChange={setSelectedLocale}
                    disabled={disabled}
                    error={error}
                    orientation="horizontal"
                    className={className}
                    minCharacters={minCharacters}
                    maxCharacters={maxCharacters}
                    data-testid={dataTestId}
                >
                    <div className="relative flex flex-col flex-1">
                        <input
                            ref={ref}
                            value={currentText}
                            onChange={handleTextChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={cn(
                                "flex h-10 w-full bg-transparent px-3 text-base outline-none",
                                "placeholder:text-muted-foreground",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                                "md:text-sm",
                                // Add padding for counter if visible
                                (showCount || maxCharacters !== undefined) ? "pr-17" : ""
                            )}
                            aria-invalid={error}
                            data-testid={`${dataTestId}-input`}
                        />

                        {/* Character Counter */}
                        <CharacterCounter
                            characterCount={currentText?.length || 0}
                            minCharacters={minCharacters}
                            maxCharacters={maxCharacters}
                            showCount={showCount}
                            warningThreshold={warningThreshold}
                            disabled={disabled}
                            className="absolute right-2 bottom-[0.58rem]"
                            data-testid={dataTestId ? `${dataTestId}-counter-${selectedLocale}` : undefined}
                        />
                    </div>
                </LanguageTabs>
            );
        }
    )
);

MultiLanguageInput.displayName = "MultiLanguageInput";