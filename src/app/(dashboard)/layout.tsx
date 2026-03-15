import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import type { UserRole } from "./_components/nav-config"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const dbUser = await getCurrentUser()

    // If no user record exists in D1, redirect to home
    // (Clerk middleware already handles unauthenticated users)
    if (!dbUser) {
        redirect("/")
    }

    // Get Clerk user for avatar/display info
    const clerkUser = await currentUser()

    const user = {
        name: dbUser.full_name || clerkUser?.fullName || "User",
        email: dbUser.email || clerkUser?.emailAddresses?.[0]?.emailAddress || "",
        avatar: clerkUser?.imageUrl || "",
    }

    return (
        <SidebarProvider>
            <AppSidebar role={dbUser.role as UserRole} user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <DashboardBreadcrumb />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
