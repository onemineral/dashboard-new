import {BookOpenCheck, CalendarRange, GitFork, House, LayoutDashboard, MessagesSquare} from "lucide-react"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx"
import NavSearch from "@/components/application/nav-sidebar/nav-search.tsx";
import Link from "../link";

export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarMenu className={'space-y-1'}>
                <NavSearch />
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/dashboard'}>
                            <LayoutDashboard className={'size-6!'} />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <MessagesSquare className={'size-6!'} />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <BookOpenCheck className={'size-6!'} />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <LayoutDashboard className={'size-6!'} /> Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <CalendarRange className={'size-6!'} />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <House className={'size-6!'} />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <GitFork className={'size-6!'} />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
