import * as React from "react";
import {cn} from "@/lib/utils";
import {useContext} from "react";
import {AppContext} from "@/contexts/app-context.tsx";
import {LanguageTabs, MultiLanguageValue} from "./language-tabs";
import {CharacterCounter} from "./character-counter";

/**
 * Props for the MultiLanguageTextarea component
 */
export interface MultiLanguageTextareaProps {
    /** Current multi-language value (controlled) */
    value: MultiLanguageValue;
    /** Callback when the complete multi-language value changes */
    onChange?: (value: MultiLanguageValue) => void;
    /** Callback on blur (for form validation) */
    onBlur?: () => void;
    /** Placeholder text for the textarea */
    placeholder?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Whether the input has an error */
    error?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Minimum height for textarea in pixels */
    minHeight?: number;
    /** Maximum height for textarea in pixels */
    maxHeight?: number;
    /** Number of rows for the textarea */
    rows?: number;
    /** Maximum character limit per language */
    maxCharacters?: number;
    /** Minimum character requirement per language */
    minCharacters?: number;
    /** Show character count */
    showCount?: boolean;
    /** Warning threshold percentage (0-1) */
    warningThreshold?: number;
    /** Additional CSS class name for counter */
    counterClassName?: string;
    /** Test ID for testing */
    "data-testid"?: string;
}

/**
 * MultiLanguageTextarea Component
 *
 * A textarea component that supports multi-language input with integrated language tabs and character counting.
 * Uses the reusable LanguageTabs component for tab management and the Radix UI Tabs component for accessibility.
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
 *   en: "Welcome to our website",
 *   es: "Bienvenido a nuestro sitio web",
 *   fr: "Bienvenue sur notre site web"
 * });
 *
 * <MultiLanguageTextarea
 *   value={value}
 *   onChange={setValue}
 *   placeholder="Enter text..."
 * />
 *
 * // With character limit
 * <MultiLanguageTextarea
 *   value={value}
 *   onChange={setValue}
 *   minCharacters={10}
 *   maxCharacters={500}
 *   placeholder="Enter description..."
 * />
 *
 * // With InputWrapper (recommended)
 * <InputWrapper
 *   label="Product Description"
 *   description="Provide descriptions in multiple languages"
 *   required
 * >
 *   <MultiLanguageTextarea
 *     value={value}
 *     onChange={setValue}
 *     minHeight={150}
 *     rows={6}
 *     maxCharacters={1000}
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
export const MultiLanguageTextarea = React.memo(
    React.forwardRef<HTMLTextAreaElement, MultiLanguageTextareaProps>(
        (
            {
                value,
                onChange,
                onBlur,
                placeholder = "Enter text...",
                disabled = false,
                error = false,
                className,
                minHeight = 120,
                maxHeight,
                rows = 4,
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
                throw new Error('MultiLanguageTextarea: No languages available in AppContext');
            }

            // Current selected language (managed by LanguageTabs via onChange callback)
            const [selectedLocale, setSelectedLocale] = React.useState<string>(LANGUAGES[0].locale);

            // Get current text for selected locale
            const currentText = React.useMemo(() => {
                if (!value || !value[selectedLocale]) return "";
                return value[selectedLocale] || "";
            }, [value, selectedLocale]);


            // Handle textarea content change - updates the specific locale in the multi-language object
            const handleTextChange = React.useCallback(
                (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                    <textarea
                        ref={ref}
                        value={currentText}
                        onChange={handleTextChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows}
                        className={cn(
                            "flex-1 w-full bg-transparent px-3 text-base outline-none resize-none",
                            "placeholder:text-muted-foreground",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "md:text-sm",
                            // Add padding to accommodate counter
                            (showCount || maxCharacters !== undefined) ? "py-2 pb-8" : "py-2"
                        )}
                        aria-invalid={error}
                        data-testid={`${dataTestId}-textarea`}
                        style={{
                            minHeight: `${minHeight}px`,
                            maxHeight: maxHeight ? `${maxHeight}px` : undefined,
                        }}
                    />

                    {/* Character Counter */}
                    <CharacterCounter
                        characterCount={currentText?.length || 0}
                        minCharacters={minCharacters}
                        maxCharacters={maxCharacters}
                        showCount={showCount}
                        warningThreshold={warningThreshold}
                        disabled={disabled}
                        data-testid={dataTestId ? `${dataTestId}-counter-${selectedLocale}` : undefined}
                    />
                </LanguageTabs>
            );
        }
    )
);

MultiLanguageTextarea.displayName = "MultiLanguageTextarea";