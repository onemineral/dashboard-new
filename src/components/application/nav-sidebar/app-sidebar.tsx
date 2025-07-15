import {
    Calendar, DollarSign,
    HelpCircle, Home, Menu, MessageCircle,
    Settings2,
} from "lucide-react"

import {NavMain} from "@/components/application/nav-sidebar/nav-main.tsx"
import {NavUser} from "@/components/application/nav-sidebar/nav-user.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar.tsx"
import { Link } from "react-router-dom"
import {Badge} from "@/components/ui/badge.tsx";

export function AppSidebar() {
    return (<>
            <Sidebar variant="inset">
                <SidebarHeader className={'mt-2'}>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <img src={'/icon.svg'} alt="Logo" className="w-9"/>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain/>
                    <SidebarGroup className={'mt-auto'}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={''}>
                                            <Settings2 className={'size-5!'}/>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={''}>
                                            <HelpCircle className={'size-5!'}/>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarSeparator/>
                    <NavUser/>
                </SidebarFooter>
            </Sidebar>

            {/*Mobil menu*/}
            <div className={'md:hidden fixed bottom-2 inset-x-0 flex justify-center z-10'}>
                <div className={'rounded-full shadow-2xl flex bg-foreground text-background items-center space-x-3 p-2'}>
                    <div className={'p-2 rounded-full bg-background text-foreground'}>
                        <Home className={'size-5'}/>
                    </div>

                    <div className={'p-2 rounded-full text-background'}>
                        <Calendar className={'size-5'}/>
                    </div>

                    <div className={'p-2 rounded-full text-background'}>
                        <DollarSign className={'size-5'}/>
                    </div>

                    <div className={'p-2 rounded-full relative text-background'}>
                        <MessageCircle className={'size-5'}/>
                        <Badge variant={'destructive'} className={'absolute -top-0 -right-2'}>12</Badge>
                    </div>
                    <div className={'p-2 rounded-full text-background'}>
                        <Menu className={'size-5'}/>
                    </div>
                </div>
            </div>
        </>
    )
}
