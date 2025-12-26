import React, { useEffect, useState } from "react";
import {MainNavigationMenu} from "./nav-sidebar/top-menu";
import {cn} from "@/lib/utils.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {AppContext} from "@/contexts/app-context.tsx";
import Link from "@/components/application/link.tsx";
import {
    Building2,
    Calendar,
    CalendarCheck,
    FileText,
    Home,
    LogOut,
    Search,
    Settings,
    User,
    Users
} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx";
import {useNavigate} from "react-router-dom";
import {useIntl, FormattedMessage} from "react-intl";

export default function Layout({children}: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const { profile } = React.useContext(AppContext);
    const navigate = useNavigate();
    const intl = useIntl();

    // Detect if user is on Mac
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Define search items with their routes and icons
    const searchItems = [
        {
            label: intl.formatMessage({defaultMessage: "Dashboard", description: "Navigation item for the dashboard page"}),
            value: "/",
            icon: Home,
            keywords: [
                intl.formatMessage({defaultMessage: "home", description: "Search keyword for dashboard"}),
                intl.formatMessage({defaultMessage: "overview", description: "Search keyword for dashboard"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "Properties", description: "Navigation item for the properties page"}),
            value: "/pms/properties",
            icon: Building2,
            keywords: [
                intl.formatMessage({defaultMessage: "property", description: "Search keyword for properties"}),
                intl.formatMessage({defaultMessage: "listing", description: "Search keyword for properties"}),
                intl.formatMessage({defaultMessage: "accommodation", description: "Search keyword for properties"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "Bookings", description: "Navigation item for the bookings page"}),
            value: "/pms/bookings",
            icon: CalendarCheck,
            keywords: [
                intl.formatMessage({defaultMessage: "booking", description: "Search keyword for bookings"}),
                intl.formatMessage({defaultMessage: "reservation", description: "Search keyword for bookings"}),
                intl.formatMessage({defaultMessage: "guest", description: "Search keyword for bookings"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "Calendar", description: "Navigation item for the calendar page"}),
            value: "/pms/calendar",
            icon: Calendar,
            keywords: [
                intl.formatMessage({defaultMessage: "availability", description: "Search keyword for calendar"}),
                intl.formatMessage({defaultMessage: "schedule", description: "Search keyword for calendar"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "Guests", description: "Navigation item for the guests page"}),
            value: "/pms/guests",
            icon: Users,
            keywords: [
                intl.formatMessage({defaultMessage: "guest", description: "Search keyword for guests"}),
                intl.formatMessage({defaultMessage: "customer", description: "Search keyword for guests"}),
                intl.formatMessage({defaultMessage: "client", description: "Search keyword for guests"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "Reports", description: "Navigation item for the reports page"}),
            value: "/reports",
            icon: FileText,
            keywords: [
                intl.formatMessage({defaultMessage: "analytics", description: "Search keyword for reports"}),
                intl.formatMessage({defaultMessage: "statistics", description: "Search keyword for reports"}),
                intl.formatMessage({defaultMessage: "data", description: "Search keyword for reports"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "Settings", description: "Navigation item for the settings page"}),
            value: "/settings",
            icon: Settings,
            keywords: [
                intl.formatMessage({defaultMessage: "configuration", description: "Search keyword for settings"}),
                intl.formatMessage({defaultMessage: "preferences", description: "Search keyword for settings"})
            ]
        },
        {
            label: intl.formatMessage({defaultMessage: "My Profile", description: "Navigation item for the user profile page"}),
            value: "/profile",
            icon: User,
            keywords: [
                intl.formatMessage({defaultMessage: "account", description: "Search keyword for profile"}),
                intl.formatMessage({defaultMessage: "user", description: "Search keyword for profile"}),
                intl.formatMessage({defaultMessage: "profile", description: "Search keyword for profile"})
            ]
        },
    ];

    const getUserInitials = () => {
        return `${profile.name[0]}${profile.name[1]}`.toUpperCase();
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        // Initialize on mount and attach listener
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSearchSelect = (value: string) => {
        setSearchOpen(false);
        setSearchValue("");
        navigate(value);
    };

    // Handle keyboard shortcuts and interactions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open search
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
                // Focus the search input
                const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to close search
            if (e.key === "Escape") {
                setSearchOpen(false);
                setSearchValue("");
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-search-container]')) {
                setSearchOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className={'min-h-svh flex flex-col'}>
            <div className={cn('w-full fixed bg-sidebar top-0 z-50 gap-2 flex flex-col items-center transition-shadow duration-300', {'shadow-md': scrolled})}>
                <div className={'flex items-center justify-around w-full bg-brand-green-dark py-2 px-4 gap-4 text-white'}>
                    <img src="/icon.svg" alt={'RentalWise'} className="h-6"/>
                    <div className={'grow flex justify-center'} data-search-container>
                        <div className="max-w-lg w-full relative">
                            <div className="flex items-center gap-2 border-none bg-brand-green rounded-md px-3 h-10">
                                <Search className="size-4 text-white shrink-0" />
                                <input
                                    type="text"
                                    placeholder={intl.formatMessage({defaultMessage: "Search...", description: "Placeholder text for the search input"})}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => setSearchOpen(true)}
                                    data-search-input
                                    className="flex-1 bg-transparent text-white placeholder:text-white/70 text-sm outline-none"
                                />
                                {searchValue ? (
                                    <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/20 bg-brand-green-dark px-1.5 font-mono text-[10px] font-medium text-white sm:flex">
                                        ESC
                                    </kbd>
                                ) : (
                                    <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/20 bg-brand-green-dark px-1.5 font-mono text-[10px] font-medium text-white sm:flex">
                                        {isMac ? <span className="text-xs">⌘</span> : 'Ctrl'}K
                                    </kbd>
                                )}
                            </div>
                            
                            {searchOpen && searchValue && (
                                <div className="absolute dark top-full left-0 right-0 mt-1 z-[100] bg-popover text-popover-foreground rounded-md border shadow-lg overflow-hidden">
                                    <Command shouldFilter={false} className="bg-transparent">
                                        <CommandList className="max-h-[400px] overflow-y-auto">
                                            <CommandEmpty className="py-6 text-center text-sm">
                                                <FormattedMessage defaultMessage="No results found." description="Message shown when search returns no results" />
                                            </CommandEmpty>
                                            <CommandGroup heading={intl.formatMessage({defaultMessage: "Pages", description: "Heading for the pages section in search results"})} className="p-2">
                                                {searchItems
                                                    .filter(item => {
                                                        const searchLower = searchValue.toLowerCase();
                                                        return item.label.toLowerCase().includes(searchLower) ||
                                                               item.keywords.some(k => k.toLowerCase().includes(searchLower));
                                                    })
                                                    .map((item) => (
                                                        <CommandItem
                                                            key={item.value}
                                                            value={`${item.label} ${item.keywords.join(" ")}`}
                                                            onSelect={() => handleSearchSelect(item.value)}
                                                            className="cursor-pointer"
                                                        >
                                                            <item.icon className="size-4" />
                                                            <span>{item.label}</span>
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full p-0"
                            >
                                <Avatar>
                                    <AvatarFallback className={'text-foreground'}>{getUserInitials()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link to="/profile" className="cursor-pointer">
                                    <User className="size-4" />
                                    <FormattedMessage defaultMessage="My Profile" description="User menu item to access profile page" />
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                    // Add logout logic here
                                    console.log('Logout clicked');
                                }}
                            >
                                <LogOut className="size-4" />
                                <FormattedMessage defaultMessage="Logout" description="User menu item to log out of the application" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <MainNavigationMenu />

            </div>

            <div className={'grow flex-1 flex flex-col pt-26'}>
                {children}
            </div>
        </div>
    );
}