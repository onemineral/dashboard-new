import {
    Calendar, DollarSign,
    Home, Menu, MessageCircle
} from "lucide-react"
import {
    Sidebar,
} from "@/components/ui/sidebar.tsx"
import {Badge} from "@/components/ui/badge.tsx";
import { ReactNode } from "react";

export function AppSidebar({children}: {children: ReactNode|null}) {
    return (<>
            <Sidebar variant={'inset'} className={'z-1'}>
                <div className={'mt-12 w-full'}></div>
                {children}
            </Sidebar>

            {/*Mobile menu*/}
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
