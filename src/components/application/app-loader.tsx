import { Skeleton } from "@/components/ui/skeleton"
import {Page, PageContent} from "@/components/application/page.tsx";

export default function AppLoader() {
    return (
        <div className="min-h-svh flex flex-col w-full">
            {/* Top bar with shadow */}
            <div className="w-full bg-sidebar top-0 z-50 gap-2 flex flex-col items-center">
                {/* Top bar: Logo, Search, User Profile */}
                <div className="flex items-center justify-around w-full bg-brand-green-dark py-2 px-4 gap-4">
                    {/* Logo */}
                    <img src="/icon.svg" alt="RentalWise" className="h-6" />
                    
                    {/* Search input skeleton */}
                    <div className="grow flex justify-center">
                        <Skeleton className="max-w-lg w-full h-10 rounded-md bg-brand-green" />
                    </div>

                    {/* User profile button */}
                    <Skeleton className="size-10 rounded-full shrink-0" />
                </div>

                {/* Navigation menu */}
                <div className="w-full overflow-x-scroll pb-2 flex justify-center">
                    <div className="flex items-center gap-4 px-2 min-w-fit">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={`menu-item-${i}`} className="h-9 w-20 rounded-sm" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main content area with top padding to account for fixed header */}
            <Page>
                <PageContent>
                    <div className="grid gap-4 md:gap-6">
                        <Skeleton className="h-[35px] rounded-lg w-48" />

                        <div className="col-span-full grid gap-4 sm:grid-cols-2">
                            <Skeleton className="h-[100px] rounded-lg" />
                            <Skeleton className="h-[100px] rounded-lg" />
                        </div>

                        <div className="col-span-full grid gap-4 sm:grid-cols-3">
                            <Skeleton className="h-[200px] rounded-lg" />
                            <Skeleton className="h-[200px] rounded-lg" />
                            <Skeleton className="h-[200px] rounded-lg" />
                        </div>

                        <div className="col-span-full">
                            <Skeleton className="h-[300px] w-full rounded-lg" />
                        </div>
                    </div>
                </PageContent>
            </Page>
        </div>
    )
}