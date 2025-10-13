import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/application/nav-sidebar/app-sidebar.tsx";
import React, { useEffect, useState } from "react";
import PMSMenu from "@/submenu/pms";
import {MainNavigationMenu} from "./nav-sidebar/top-menu";
import {cn} from "@/lib/utils.ts";

const MENU_OPTIONS: any = {
    'pms': PMSMenu
}

export default function Layout({children}: { children: React.ReactNode }) {
    const Menu = MENU_OPTIONS.pms;
    const [scrolled, setScrolled] = useState(false);

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

    return (
        <div className={'min-h-svh flex flex-col'}>
            <div className={'w-full mt-12'}></div>
            <div className={cn('bg-sidebar w-full p-1 fixed top-0 z-3 flex items-center transition-shadow duration-300', {'shadow-md': scrolled})}>
                <img src="/icon.svg" alt={'RentalWise'} className="mx-4 h-6"/>
                <div className="flex-grow flex">
                    <MainNavigationMenu />
                </div>

            </div>
            <SidebarProvider className={'!min-h-auto grow'}>
                <AppSidebar>
                    {Menu ? <Menu/> : null}
                </AppSidebar>
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}