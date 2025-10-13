import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import {cn, translated} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import {Property} from "@onemineral/pms-js-sdk";
import { useQuery } from "@tanstack/react-query";
import {config} from "@/config.ts";

export interface PropertyInputProps {
  value?: Property | null;
  onChange?: (property: Property | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function PropertySelect({
  value,
  onChange,
  onBlur,
  placeholder = "Select a property...",
  disabled = false,
  className,
  error = false,
}: PropertyInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch properties using react-query
  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ['property.autocomplete', debouncedSearchQuery],
    queryFn: async () => {
      const response = await api.property.autocomplete({ q: debouncedSearchQuery, limit: config.limits.select });
      return response.response || [];
    },
    enabled: open, // Only fetch when popover is open
  });

  // Handle property selection
  const handleSelect = (property: Property) => {
    onChange?.(property);
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
          prev < properties.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && properties[selectedIndex]) {
          handleSelect(properties[selectedIndex]);
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

  // Reset selected index and search when properties change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [properties]);

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

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            "w-full justify-between hover:bg-background font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
        >
          {value ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="size-6 rounded-md">
                <AvatarImage src={value.main_image?.thumbnail} alt={translated(value.name)} />
                <AvatarFallback className="text-xs">
                  {translated(value.name).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{translated(value.name)}</span>
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <a
                onClick={handleClear}
                className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Clear selection"
              >
                <X className="size-4 shrink-0" />
              </a>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-80 p-0" align="start">
        <Command shouldFilter={false} onKeyDown={handleKeyDown}>
          {!searchQuery && !isLoading && properties?.length < config.limits.select ? null :
          <div className="flex items-center border-b px-3">
            <input
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={false}
            />
            {isLoading && (
              <Loader2 className="size-4 shrink-0 animate-spin opacity-50" />
            )}
          </div>}
          <CommandList>
            {isError && (
              <div className="py-6 text-center text-sm text-destructive">
                Failed to load properties. Please try again.
              </div>
            )}
            {!isError && !isLoading && properties.length === 0 && (
              <CommandEmpty>No properties found.</CommandEmpty>
            )}
            {!isError && properties.length > 0 && (
              <CommandGroup>
                {properties.map((property: Property, index: number) => (
                  <CommandItem
                    key={property.id}
                    value={property.id.toString()}
                    onSelect={() => handleSelect(property)}
                    data-selected={index === selectedIndex}
                    className={cn(
                      "cursor-pointer",
                      index === selectedIndex && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                      <Avatar className="size-8 shrink-0 rounded-md">
                        <AvatarImage src={property.main_image?.thumbnail} alt={translated(property.name)} />
                        <AvatarFallback className="text-xs">
                          {translated(property.name).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                        <span className="font-medium truncate">
                          {translated(property.name)}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {property.internal_name}
                        </span>
                      </div>
                      {value?.id == property.id && (
                        <Check className="size-4 shrink-0" />
                      )}
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