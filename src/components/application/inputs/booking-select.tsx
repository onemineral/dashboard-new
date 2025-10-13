import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import { Booking } from "@onemineral/pms-js-sdk";
import { useQuery } from "@tanstack/react-query";
import { config } from "@/config.ts";
import { format } from "date-fns";
import {DateRange} from "@/components/application/display/daterange.tsx";

export interface BookingSelectProps {
  value?: Booking | null;
  onChange?: (booking: Booking | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function BookingSelect({
  value,
  onChange,
  onBlur,
  placeholder = "Select a booking...",
  disabled = false,
  className,
  error = false,
}: BookingSelectProps) {
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

  // Fetch bookings using react-query
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['booking.autocomplete', debouncedSearchQuery],
    queryFn: async () => {
      const response = await api.booking.autocomplete({ q: debouncedSearchQuery, limit: config.limits.select });
      return response.response || [];
    },
    enabled: open, // Only fetch when popover is open
  });

  // Handle booking selection
  const handleSelect = (booking: Booking) => {
    onChange?.(booking);
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
          prev < bookings.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && bookings[selectedIndex]) {
          handleSelect(bookings[selectedIndex]);
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

  // Reset selected index and search when bookings change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [bookings]);

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

  // Format date range for display
  const formatDateRange = (booking: Booking) => {
    if (!booking.daterange) return "";
    try {
      const start = format(new Date(booking.daterange.start), "MMM d");
      const end = format(new Date(booking.daterange.end), "MMM d, yyyy");
      return `${start} - ${end}`;
    } catch {
      return "";
    }
  };

  // Get booking display text
  const getBookingDisplayText = (booking: Booking) => {
    const guestName = booking.main_guest?.full_name || "Unknown Guest";
    const dates = formatDateRange(booking);
    return dates ? `${guestName} • ${dates}` : guestName;
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
                <AvatarImage src={value.property?.main_image?.thumbnail} alt={value.main_guest?.full_name as string} />
                <AvatarFallback className="text-xs">
                  {value.main_guest?.full_name?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{getBookingDisplayText(value)}</span>
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
          {!searchQuery && !isLoading && bookings?.length < config.limits.select ? null :
          <div className="flex items-center border-b px-3">
            <input
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search bookings..."
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
                Failed to load bookings. Please try again.
              </div>
            )}
            {!isError && !isLoading && bookings.length === 0 && (
              <CommandEmpty>No bookings found.</CommandEmpty>
            )}
            {!isError && bookings.length > 0 && (
              <CommandGroup>
                {bookings.map((booking: Booking, index: number) => (
                  <CommandItem
                    key={booking.id}
                    value={booking.id.toString()}
                    onSelect={() => handleSelect(booking)}
                    data-selected={index === selectedIndex}
                    className={cn(
                      "cursor-pointer",
                      index === selectedIndex && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                      <Avatar className="size-8 shrink-0 rounded-md">
                        <AvatarImage src={booking.property?.main_image?.thumbnail} alt={booking.main_guest?.full_name as string} />
                        <AvatarFallback className="text-xs">
                          {booking.main_guest?.full_name?.slice(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                        <div className={'flex justify-start items-center space-x-2'}>
                          <span className="font-medium truncate">
                            {booking.main_guest?.full_name || "Unknown Guest"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <DateRange value={{start: booking.checkin, end: booking.checkout}} />
                        </div>
                      </div>
                      {value?.id === booking.id && (
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