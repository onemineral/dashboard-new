import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {FormattedMessage, useIntl} from "react-intl";
import {Currency} from "@sdk/generated";
import {useTranslate} from "@/hooks/use-translate.ts";

export interface CurrencySelectProps {
    value?: string | number | null;
    onChange?: (currencyCode: string | null) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: boolean;
    allowedCurrencies?: string[];
    valueType?: 'id' | 'iso_code';
}

/**
 * CurrencySelect Component
 *
 * A simple currency selector component that fetches currencies from the database
 * and displays them in a dropdown. Compatible with react-hook-form.
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <CurrencySelect
 *   value={currencyCode}
 *   onChange={setCurrencyCode}
 *   placeholder="Select currency"
 * />
 *
 * // With react-hook-form
 * <Controller
 *   name="currency"
 *   control={control}
 *   render={({ field }) => (
 *     <CurrencySelect
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!errors.currency}
 *     />
 *   )}
 * />
 *
 * // With allowed currencies filter
 * <CurrencySelect
 *   value={currencyCode}
 *   onChange={setCurrencyCode}
 *   allowedCurrencies={['USD', 'EUR', 'GBP']}
 * />
 *
 * // With ISO code as value type
 * <CurrencySelect
 *   value={isoCode}
 *   onChange={setIsoCode}
 *   valueType="iso_code"
 * />
 * ```
 */
export function CurrencySelect({
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    className,
    error = false,
    allowedCurrencies,
    valueType = 'id',
}: CurrencySelectProps) {
    const intl = useIntl();
    const translated = useTranslate();
    
    // Default translated placeholder
    const defaultPlaceholder = intl.formatMessage({
        defaultMessage: "Select currency",
        description: "Currency select placeholder"
    });
    
    // Fetch currencies using react-query
    const {data: currencies = [], isLoading, isError} = useQuery({
        queryKey: ['currency.query'],
        queryFn: async () => {
            const response = await api.currency.query({
                sort: [{field: 'name', direction: 'asc', locale: 'en'}],
                paginate: {perpage: 100}
            });
            return response.response?.data || [];
        },
    });

    // Filter currencies based on allowedCurrencies prop
    const filteredCurrencies = allowedCurrencies && allowedCurrencies.length > 0
        ? currencies.filter((c: Currency) => allowedCurrencies.includes(c.iso_code))
        : currencies;

    // Find the selected currency object based on valueType
    const selectedCurrency = filteredCurrencies.find((c: Currency) =>
        valueType === 'iso_code' ? c.iso_code === value : c.id.toString() === value?.toString()
    );
    
    // Get the internal value for the Select component (always uses ID)

    // Handle currency selection
    const handleValueChange = (newValue: string) => {
        // newValue is always the ID (from SelectItem)
        if (valueType === 'iso_code') {
            // Find currency by ID and return its ISO code
            const currency = filteredCurrencies.find((c: Currency) => c.id.toString() === newValue);
            onChange?.(currency?.iso_code || null);
        } else {
            // Return the ID
            onChange?.(newValue);
        }
    };

    if (isLoading) {
        return (
            <div className={cn(
                "flex items-center justify-center h-9 border border-input rounded-md px-3",
                className
            )}>
                <Loader2 className="size-4 animate-spin opacity-50"/>
                <span className="ml-2 text-sm text-muted-foreground">
                    <FormattedMessage
                        defaultMessage="Loading..."
                        description="Loading currencies message"
                    />
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={cn(
                "flex items-center justify-center h-9 border border-destructive rounded-md px-3 text-sm text-destructive",
                className
            )}>
                <FormattedMessage
                    defaultMessage="Failed to load currencies"
                    description="Error loading currencies message"
                />
            </div>
        );
    }

    return (
        <Select
            value={selectedCurrency?.id.toString()}
            onValueChange={handleValueChange}
            disabled={disabled}
        >
            <SelectTrigger
                className={cn(
                    "w-full",
                    error && "border-destructive aria-invalid:border-destructive",
                    className
                )}
                aria-invalid={error}
                onBlur={onBlur}
            >
                <SelectValue placeholder={placeholder || defaultPlaceholder} className="flex items-center justify-between w-full overflow-hidden">
                    {selectedCurrency && (<>
                            <span className="truncate">{translated(selectedCurrency.name)}</span>
                            <span className="ml-2 text-muted-foreground shrink-0">
                                {selectedCurrency.symbol}
                            </span>
                        </>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {filteredCurrencies.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        <FormattedMessage
                            defaultMessage="No currencies available"
                            description="No currencies available message"
                        />
                    </div>
                ) : (
                    filteredCurrencies.map((currency: Currency) => (
                        <SelectItem key={currency.id} value={currency.id.toString()} className={'flex items-center justify-between w-full overflow-hidden grow'}>
                                <span className="font-medium">{translated(currency.name)}</span>
                                <span className="ml-2 text-muted-foreground shrink-0">
                                    {currency.symbol}
                                </span>
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
}