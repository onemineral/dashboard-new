import { BookOpenCheck, CalendarRange, GitFork, HelpCircle, House, LayoutDashboard, MessagesSquare, Settings2 } from "lucide-react";
import Link from "@/components/application/link";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {TeamSwitcher} from "@/components/application/nav-sidebar/team-switcher.tsx";
import {useMatchPath} from "@/hooks/use-match-path.ts";

export default function PMSMenu() {
    const match = useMatchPath();
   return <>
       <SidebarHeader>
           <TeamSwitcher />
       </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={match('/dashboard')}>
                        <Link to={'/dashboard'}>
                            <LayoutDashboard /> Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={match('/pms/properties')}>
                        <Link to={'/pms/properties'}>
                            <MessagesSquare /> Properties
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={match('/pms/amenities')}>
                        <Link to={'/pms/amenities'}>
                            <BookOpenCheck /> Amenities
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={match('/')}>
                        <Link to={'/'}>
                            <LayoutDashboard />
                            <span>Multicalendar</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/form'}>
                            <CalendarRange /> Form
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <House />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={'/'}>
                            <GitFork />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className={'mt-auto'}>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to={''}>
                                <Settings2/> Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to={''}>
                                <HelpCircle /> Help
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    </SidebarContent>
   </>;
}