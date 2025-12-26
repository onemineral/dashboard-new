import * as React from "react";
import {Check, ChevronsUpDown, Loader2, X} from "lucide-react";
import {cn, getFlagEmoji} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import api from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {FormattedMessage, useIntl} from "react-intl";
import {Country} from "@sdk/generated";
import {useTranslate} from "@/hooks/use-translate.ts";

export interface CountrySelectProps {
    value?: string | number | null;
    onChange?: (countryCode: string | null) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    error?: boolean;
    allowedCountries?: string[];
    valueType?: 'id' | 'iso_code_2' | 'iso_code_3';
}

/**
 * CountrySelect Component
 *
 * A searchable country selector component that fetches countries from the database
 * and displays them in a searchable dropdown with client-side filtering.
 * Compatible with react-hook-form.
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <CountrySelect
 *   value={countryCode}
 *   onChange={setCountryCode}
 *   placeholder="Select country"
 * />
 *
 * // With react-hook-form
 * <Controller
 *   name="country"
 *   control={control}
 *   render={({ field }) => (
 *     <CountrySelect
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={!!errors.country}
 *     />
 *   )}
 * />
 *
 * // With allowed countries filter
 * <CountrySelect
 *   value={countryCode}
 *   onChange={setCountryCode}
 *   allowedCountries={['US', 'GB', 'FR']}
 * />
 *
 * // With ISO code 3 as value type
 * <CountrySelect
 *   value={isoCode3}
 *   onChange={setIsoCode3}
 *   valueType="iso_code_3"
 * />
 * ```
 */
export function CountrySelect({
    value,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    className,
    error = false,
    allowedCountries,
    valueType = 'id',
}: CountrySelectProps) {
    const intl = useIntl();
    const translated = useTranslate();
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    // Default translated placeholder
    const defaultPlaceholder = intl.formatMessage({
        defaultMessage: "Select country",
        description: "Country select placeholder"
    });

    // Fetch countries using react-query
    const {data: countries = [], isLoading, isError} = useQuery({
        queryKey: ['country.query'],
        queryFn: async () => {
            const response = await api.country.query({
                sort: [{field: 'name', direction: 'asc', locale: 'en'}],
                paginate: {perpage: 300}
            });
            return response.response?.data || [];
        },
    });

    // Filter countries based on allowedCountries prop
    const filteredCountries = React.useMemo(() => {
        let filtered = allowedCountries && allowedCountries.length > 0
            ? countries.filter((c: Country) => allowedCountries.includes(c.iso_code_2))
            : countries;

        // Client-side search filtering
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((c: Country) => {
                const name =Object.entries(c.name).join(' ').toLowerCase();
                const region = c.region ? translated(c.region)?.toLowerCase() : '';
                const iso2 = c.iso_code_2.toLowerCase();
                const iso3 = c.iso_code_3.toLowerCase();
                return name.includes(query) || region?.includes(query) || iso2.includes(query) || iso3.includes(query);
            });
        }

        return filtered;
    }, [countries, allowedCountries, searchQuery]);

    // Find the selected country object based on valueType
    const selectedCountry = React.useMemo(() => {
        return countries.find((c: Country) => {
            if (valueType === 'iso_code_2') return c.iso_code_2 === value;
            if (valueType === 'iso_code_3') return c.iso_code_3 === value;
            return c.id.toString() === value?.toString();
        });
    }, [countries, value, valueType]);

    // Handle country selection
    const handleSelect = (country: Country) => {
        let newValue: string | null = null;
        if (valueType === 'iso_code_2') {
            newValue = country.iso_code_2;
        } else if (valueType === 'iso_code_3') {
            newValue = country.iso_code_3;
        } else {
            newValue = country.id.toString();
        }
        onChange?.(newValue);
        setOpen(false);
        setSearchQuery("");
        setSelectedIndex(-1);
        // Trigger blur event for form validation
        setTimeout(() => onBlur?.(), 0);
    };

    // Handle clearing selection
    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange?.(null);
        setSearchQuery("");
        setSelectedIndex(-1);
        // Trigger blur event for form validation
        setTimeout(() => onBlur?.(), 0);
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredCountries.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && filteredCountries[selectedIndex]) {
                    handleSelect(filteredCountries[selectedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setOpen(false);
                setSearchQuery("");
                setSelectedIndex(-1);
                break;
        }
    };

    // Reset selected index when filtered countries change
    React.useEffect(() => {
        setSelectedIndex(-1);
    }, [filteredCountries]);

    // Reset search query when popover closes
    React.useEffect(() => {
        if (!open) {
            setSearchQuery("");
        }
    }, [open]);

    // Handle popover close to trigger blur
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Trigger blur when closing popover
            setTimeout(() => onBlur?.(), 0);
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
                        defaultMessage="Loading countries..."
                        description="Loading countries message"
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
                    defaultMessage="Failed to load countries"
                    description="Error loading countries message"
                />
            </div>
        );
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-label={placeholder || defaultPlaceholder}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between hover:bg-background font-normal",
                        !value && "text-muted-foreground",
                        error && "border-destructive",
                        className
                    )}
                >
                    {selectedCountry ? (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-lg shrink-0">{getFlagEmoji(selectedCountry.iso_code_2)}</span>
                            <span className="truncate">{translated(selectedCountry.name)}</span>
                            <span className="ml-2 text-muted-foreground shrink-0 text-xs">
                                {selectedCountry.iso_code_2}
                            </span>
                        </div>
                    ) : (
                        <span>{placeholder || defaultPlaceholder}</span>
                    )}
                    <div className="flex items-center gap-1">
                        {value && !disabled && (
                            <a
                                onClick={handleClear}
                                className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                aria-label="Clear selection"
                            >
                                <X className="size-4 shrink-0"/>
                            </a>
                        )}
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50"/>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] min-w-80 p-0" align="start">
                <Command shouldFilter={false} onKeyDown={handleKeyDown}>
                    <div className="flex items-center border-b px-3">
                        <input
                            className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={intl.formatMessage({
                                defaultMessage: "Search countries...",
                                description: "Search countries placeholder"
                            })}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus={false}
                        />
                        {isLoading && (
                            <Loader2 className="size-4 shrink-0 animate-spin opacity-50"/>
                        )}
                    </div>
                    <CommandList>
                        {isError && (
                            <div className="py-6 text-center text-sm text-destructive">
                                <FormattedMessage
                                    defaultMessage="Failed to load countries. Please try again."
                                    description="Error loading countries in dropdown"
                                />
                            </div>
                        )}
                        {!isError && filteredCountries.length === 0 && (
                            <CommandEmpty>
                                <FormattedMessage
                                    defaultMessage="No countries found."
                                    description="No countries found message"
                                />
                            </CommandEmpty>
                        )}
                        {!isError && filteredCountries.length > 0 && (
                            <CommandGroup>
                                {filteredCountries.map((country: Country, index: number) => (
                                    <CommandItem
                                        key={country.id}
                                        value={country.id.toString()}
                                        onSelect={() => handleSelect(country)}
                                        data-selected={index === selectedIndex}
                                        className={cn(
                                            "cursor-pointer",
                                            index === selectedIndex && "bg-accent"
                                        )}
                                    >
                                        <div className="flex items-center justify-between overflow-hidden w-full">
                                            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                                                <span className="text-lg shrink-0">{getFlagEmoji(country.iso_code_2)}</span>
                                                <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                                                    <span className="font-medium truncate">
                                                        {translated(country.name)}
                                                    </span>
                                                    {country.region && (
                                                        <span className="text-xs text-muted-foreground truncate">
                                                            {translated(country.region)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs text-muted-foreground">
                                                    {country.iso_code_2}
                                                </span>
                                                {value && (
                                                    (valueType === 'iso_code_2' && country.iso_code_2 === value) ||
                                                    (valueType === 'iso_code_3' && country.iso_code_3 === value) ||
                                                    (valueType === 'id' && country.id.toString() === value?.toString())
                                                ) && (
                                                    <Check className="size-4"/>
                                                )}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}