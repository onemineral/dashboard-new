import React, { useState, createContext, useContext } from "react";
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import {useIsMobile} from "@/hooks/use-mobile.ts";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer.tsx";

type BreadcrumbType = {
    label: string;
    href?: string | null;
}

const PageContext = createContext<{
    modal: boolean,
    sheet: boolean,
    // @ts-ignore
}>({});



export function Page({children, modal = false, size = 'sm', validateClose}: {children: React.ReactNode, modal?: boolean, size?: 'sm' | 'md' | 'lg' |'xl', validateClose?: () => boolean}) {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();

    const attemptClose = (open: boolean) => {
        if(!open) {
            if(!validateClose || validateClose()) {
                setOpen(false);
                setTimeout(() => {
                    navigate(-1);
                }, 100);
            }
        }
    }

    if (location.state?.background) {

        let content = <></>;

        if(isMobile) {
            return <Drawer open={open} onOpenChange={attemptClose}>
                <DrawerContent className={'px-4'}>
                    {children}
                </DrawerContent>
            </Drawer>
        } else {

            if (modal) {
                content = <Dialog open={open} onOpenChange={attemptClose}>
                    <DialogContent className={'@container group/page is-background is-dialog'} size={size}>
                        {children}
                    </DialogContent>
                </Dialog>;
            } else {
                const sheetSizes: any = {
                    sm: 'md:max-w-xl!',
                    md: 'md:max-w-3xl!',
                    lg: 'xl:max-w-5xl! lg:max-w-3xl!',
                    xl: 'xl:max-w-7xl! lg:max-w-5xl!'
                };

                content = <Sheet open={open} onOpenChange={attemptClose}>
                    <SheetContent
                        className={cn("@container max-w-[calc(100vw-1rem)]! group/page is-sheet is-background gap-0 min-w-80 m-2 rounded-2xl flex flex-col h-[calc(100dvh-1rem)] border shadow-xl w-full! px-4 overflow-y-auto", sheetSizes[size])}>
                        {children}
                    </SheetContent>
                </Sheet>;
            }
        }

        return <PageContext.Provider
              value={{
                sheet: !modal,
                modal,
              } as any}
            >
                {content}
            </PageContext.Provider>
    }

    return <PageContext.Provider
              value={{
                sheet: false,
                modal: false,
              } as any}
            ><div className={'@container relative w-full h-full group/page'}>{children}</div></PageContext.Provider>;
}

export function PageBreadcrumbs({breadcrumbs = []}: { breadcrumbs?: BreadcrumbType[] }) {
    const location = useLocation();

    if (location.state?.background) {
        return null;
    }

    return (
        <header className="flex mt-4 shrink-0 items-center">
            <div className="flex items-center gap-2 mx-2 sm:mx-5 grow">
                <SidebarTrigger className="-ml-1"/>
                {breadcrumbs.length > 0 ? (
                    <>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map(({label, href}, index) => (<React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            {href ? (
                                                <BreadcrumbLink asChild={true}>
                                                    <Link to={href}>{label}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>{label}</BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 ? (
                                            <BreadcrumbSeparator/>
                                        ) : null}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </>
                ) : null}
            </div>
        </header>
    );
}

export function PageHeader({children, className}: { children: React.ReactNode, className?: string }) {
    const location = useLocation();
    const {modal} = useContext(PageContext);
    const isMobile = useIsMobile();

    if (location.state?.background) {
        if(isMobile) {
            return <DrawerHeader className={cn("text-left", className)}>
                {children}
            </DrawerHeader>
        }

        if(modal) {
            return <DialogHeader className={className}>{children}</DialogHeader>;
        }

        return <SheetHeader className={cn('-mx-4 mt-4', className)}>{children}</SheetHeader>;
    }

    return (
        <div className={cn("mt-4 mx-2 sm:mx-5 space-y-1", className)}>
            {children}
        </div>
    );
}

export function PageTitle({children, className}: { children: React.ReactNode, className?: string }) {
    const location = useLocation();
    const {modal} = useContext(PageContext);
    const isMobile = useIsMobile();

    if (location.state?.background) {
        if(isMobile) {
            return <DrawerTitle className={className}>{children}</DrawerTitle>
        }

        if(modal) {
            return <DialogTitle className={className}>{children}</DialogTitle>;
        }
        return <SheetTitle className={className}>{children}</SheetTitle>;
    }

    return (
        <h1 className={cn("text-xl font-medium text-balance", className)}>{children}</h1>
    );
}

export function PageHeaderContainer({children, className}: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("@3xl:flex @3xl:items-center", className)}>{children}</div>
    );
}

export function PageActions({children, className}: { children: React.ReactNode, className?: string }) {
    const location = useLocation();
    const {modal} = useContext(PageContext);

    if (location.state?.background) {
        if (modal) {
            return <div className={cn('flex items-center mt-4 @3xl:mt-0', className)}>{children}</div>;
        }
        return <div className={cn('flex items-center mt-0 @3xl:mt-4', className)}>{children}</div>;
    }

    return (
        <div className={cn('flex items-center px-2 sm:px-4 mt-4 @3xl:mt-0', className)}>{children}</div>
    );
}

export function PageDescription({children, className}: { children: React.ReactNode, className?: string }) {
    const location = useLocation();
    const {modal} = useContext(PageContext);
    const isMobile = useIsMobile();

    if (location.state?.background) {
        if(isMobile) {
            return <DrawerDescription className={className}>{children}</DrawerDescription>;
        }

        if(modal) {
            return <DialogDescription className={className}>{children}</DialogDescription>;    
        }
        return <SheetDescription className={className}>{children}</SheetDescription>;
    }

    return (
        <p className={cn("text-muted-foreground", className)}>{children}</p>
    );
}

export function PageContent({children, className}: { children: React.ReactNode, className?: string }) {
    const location = useLocation();

    return (
        <div className={cn("grow w-full mt-4 relative", className, {
            'px-2 sm:px-5': !location.state?.background,
        })}>
            {children}
        </div>
    );
}