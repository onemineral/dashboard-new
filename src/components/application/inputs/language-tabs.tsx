import * as React from "react";
import {cn, getFlagEmoji} from "@/lib/utils";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useContext} from "react";
import {AppContext} from "@/contexts/app-context.tsx";

/**
 * Multi-language value type: object with locale keys and string values
 */
export type MultiLanguageValue = Record<string, string | null> | null;

/**
 * Props for the LanguageTabs component
 */
export interface LanguageTabsProps {
    /** Current multi-language value (controlled) */
    value: MultiLanguageValue;
    /** Callback when selected locale changes - receives only the locale string */
    onChange?: (locale: string) => void;
    /** Whether the tabs are disabled */
    disabled?: boolean;
    /** Whether the input has an error */
    error?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Tab orientation - vertical (left side) or horizontal (top) */
    orientation?: "vertical" | "horizontal";
    /** Minimum character count for content validation (optional) */
    minCharacters?: number;
    /** Maximum character count for content validation (optional) */
    maxCharacters?: number;
    /** Children elements (input components) */
    children: React.ReactNode;
    /** Test ID for testing */
    "data-testid"?: string;
}


/**
 * LanguageTabs Component
 *
 * A headless component that provides multi-language tab functionality for any input element.
 * Manages language switching, content indicators, and accessibility while being completely
 * decoupled from specific input implementations.
 *
 * Features:
 * - Vertical or horizontal tab layout with flag emojis for supported languages
 * - Visual indicator (dot) for tabs with content validation:
 *   - Gray: No content
 *   - Orange: Content below minCharacters (if specified)
 *   - Green: Content between minCharacters and maxCharacters (or any content if no limits)
 *   - Red: Content exceeds maxCharacters (if specified)
 * - Fully accessible with ARIA attributes from Radix UI Tabs
 * - Works with any React element as children
 * - Preserves content when switching languages
 * - Mobile responsive with language labels
 * - Notifies parent of locale changes via onChange callback
 *
 * @example
 * ```tsx
 * // Vertical layout (default) - for textarea with validation
 * <LanguageTabs
 *   value={multiLangValue}
 *   onChange={(locale) => setSelectedLocale(locale)}
 *   orientation="vertical"
 *   minCharacters={10}
 *   maxCharacters={500}
 * >
 *   <textarea />
 * </LanguageTabs>
 *
 * // Horizontal layout - for single-line input
 * <LanguageTabs
 *   value={value}
 *   onChange={(locale) => handleLocaleChange(locale)}
 *   orientation="horizontal"
 * >
 *   <input />
 * </LanguageTabs>
 * ```
 */
export const LanguageTabs = React.memo(
    React.forwardRef<HTMLDivElement, LanguageTabsProps>(
        (
            {
                value,
                onChange,
                disabled = false,
                error = false,
                className,
                orientation = "vertical",
                minCharacters,
                maxCharacters,
                children,
                "data-testid": dataTestId,
            },
            ref
        ) => {
            const {languages: LANGUAGES} = useContext(AppContext);

            // Validate languages array
            if (!LANGUAGES || LANGUAGES.length === 0) {
                throw new Error('LanguageTabs: No languages available in AppContext');
            }

            // Current selected language (controlled by Tabs)
            const [selectedLocale, setSelectedLocale] = React.useState<string>(LANGUAGES[0].locale);

            // Handle tab change - notify parent of locale change
            const handleTabChange = React.useCallback(
                (newLocale: string) => {
                    setSelectedLocale(newLocale);
                    onChange?.(newLocale);
                },
                [onChange]
            );

            const isVertical = orientation === "vertical";
            const isHorizontal = orientation === "horizontal";

            /**
             * Determine the indicator dot color based on content length
             * - Gray: No content
             * - Orange: Content below minCharacters
             * - Green: Content within range or valid
             * - Red: Content exceeds maxCharacters
             */
            const getIndicatorColor = React.useCallback((content: string | null | undefined): string => {
                if (!content || content.trim().length === 0) {
                    return "bg-gray-400"; // Gray for missing content
                }

                const length = content.length;

                // If maxCharacters is defined and exceeded, show red
                if (maxCharacters !== undefined && length > maxCharacters) {
                    return "bg-red-500"; // Red for exceeding max
                }

                // If minCharacters is defined and not met, show orange
                if (minCharacters !== undefined && length < minCharacters) {
                    return "bg-orange-400"; // Orange for below min
                }

                // Content is valid (either within range or no limits defined)
                return "bg-green-500"; // Green for valid content
            }, [minCharacters, maxCharacters]);

            return (
                <Tabs
                    value={selectedLocale}
                    onValueChange={handleTabChange}
                    orientation={orientation}
                    className={cn(isVertical && "flex-row gap-0", className)}
                >
                    <div
                        ref={ref}
                        className={cn(
                            "w-full relative flex rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
                            "border-input",
                            error && "border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]",
                            !error && "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                            disabled && "opacity-50 cursor-not-allowed",
                            isVertical && "flex-row",
                            isHorizontal && "p-1 flex-col"
                        )}
                        data-slot="language-tabs"
                        data-testid={dataTestId}
                    >
                        {/* Language Tabs */}
                        <TabsList
                            className={cn(
                                "h-auto",
                                {
                                    'hidden': LANGUAGES.length === 1,
                                },
                                // Vertical layout (left side)
                                isVertical && [
                                    "flex flex-col m-1 rounded-sm",
                                    "w-12 shrink-0",
                                    "bg-accent"
                                ],
                                // Horizontal layout (top)
                                isHorizontal && [
                                    "flex flex-row justify-start rounded-md",
                                    "bg-accent p-1 gap-1"
                                ]
                            )}
                        >
                            {LANGUAGES.map((language) => {
                                const content = value?.[language.locale];
                                const indicatorColor = getIndicatorColor(content);

                                return (
                                    <TabsTrigger
                                        key={language.locale}
                                        value={language.locale}
                                        disabled={disabled}
                                        className={cn(
                                            "flex items-center justify-center relative",
                                            // Vertical layout styling
                                            isVertical && [
                                                "w-full text-xl",
                                                "px-2 py-3"
                                            ],
                                            // Horizontal layout styling
                                            isHorizontal && [
                                                "text-base",
                                                "px-3 py-1.5 min-w-[2.5rem] rounded-sm",
                                                "data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                            ]
                                        )}
                                        aria-label={`${language.international_name} (${language.locale})`}
                                        data-testid={`${dataTestId}-tab-${language.locale}`}
                                    >
                                        <span className="select-none" aria-hidden="true">
                                            {getFlagEmoji(language.iso_locale)}
                                            {isVertical && <br />}
                                        </span>
                                        {/* Content indicator dot - always shown */}
                                        <span
                                            className={cn(
                                                "absolute size-1.5 rounded-full",
                                                indicatorColor,
                                                isVertical && "top-1 right-1",
                                                isHorizontal && "top-0.5 right-0.5"
                                            )}
                                            aria-label={
                                                !content || content.trim().length === 0
                                                    ? "No content"
                                                    : maxCharacters !== undefined && content.length > maxCharacters
                                                    ? "Content exceeds maximum"
                                                    : minCharacters !== undefined && content.length < minCharacters
                                                    ? "Content below minimum"
                                                    : "Content valid"
                                            }
                                        />
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col min-w-0">
                            {children}
                        </div>
                    </div>
                </Tabs>
            );
        }
    )
);

LanguageTabs.displayName = "LanguageTabs";