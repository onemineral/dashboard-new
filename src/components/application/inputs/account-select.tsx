import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useIntl, FormattedMessage } from "react-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {config} from "@/config.ts";
import {Account} from "@sdk/generated";

export interface AccountInputProps {
  value?: Account | null;
  onChange?: (account: Account | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  resource_type?: 'partner' | 'guest';
}

export function AccountSelect({
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  className,
  error = false,
  resource_type,
}: AccountInputProps) {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  
  const defaultPlaceholder = intl.formatMessage({
    defaultMessage: "Select an account...",
    description: "Account select placeholder"
  });

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch accounts using react-query
  const { data: accounts = [], isLoading, isError } = useQuery({
    queryKey: ['account.autocomplete', debouncedSearchQuery, resource_type],
    queryFn: async () => {
      const response = await api.account.autocomplete({ q: debouncedSearchQuery, limit: config.limits.select, type: resource_type });
      return response.response || [];
    },
    enabled: open, // Only fetch when popover is open
  });

  // Handle account selection
  const handleSelect = (account: Account) => {
    onChange?.(account);
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
          prev < accounts.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && accounts[selectedIndex]) {
          handleSelect(accounts[selectedIndex]);
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

  // Reset selected index when accounts change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [accounts]);

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

  // Get initials from full name for avatar
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
          {value ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">
                  {getInitials(value.full_name as string)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{value.full_name}</span>
            </div>
          ) : (
            <span>{placeholder || defaultPlaceholder}</span>
          )}
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <a
                onClick={handleClear}
                className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={intl.formatMessage({
                  defaultMessage: "Clear selection",
                  description: "Clear account selection button label"
                })}
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
          {!searchQuery && !isLoading && accounts?.length < config.limits.select ? null :
          <div className="flex items-center border-b px-3">
            <input
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={intl.formatMessage({
                defaultMessage: "Search accounts...",
                description: "Account search input placeholder"
              })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={false}
            />
            {isLoading && (
              <Loader2 className="size-4 shrink-0 animate-spin opacity-50" />
            )}
          </div>}
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm">
                <Loader2 className="size-4 mx-auto animate-spin opacity-50" />
              </div>
            )}
            {isError && (
              <div className="py-6 text-center text-sm text-destructive">
                <FormattedMessage
                  defaultMessage="Failed to load accounts. Please try again."
                  description="Account loading error message"
                />
              </div>
            )}
            {!isError && !isLoading && accounts.length === 0 && (
              <CommandEmpty>
                <FormattedMessage
                  defaultMessage="No accounts found."
                  description="No accounts found message"
                />
              </CommandEmpty>
            )}
            {!isError && accounts.length > 0 && (
              <CommandGroup>
                {accounts.map((account: Account, index: number) => (
                  <CommandItem
                    key={account.id}
                    value={account.id.toString()}
                    onSelect={() => handleSelect(account)}
                    data-selected={index === selectedIndex}
                    className={cn(
                      "cursor-pointer",
                      index === selectedIndex && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-xs">
                          {getInitials(account.full_name as string)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                        <span className="font-medium truncate">
                          {account.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {account.email}
                        </span>
                        {account.phone && (
                          <span className="text-xs text-muted-foreground truncate">
                            {account.phone}
                          </span>
                        )}
                      </div>
                      {value?.id == account.id && (
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