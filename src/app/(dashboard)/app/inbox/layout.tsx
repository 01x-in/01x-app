"use client"

import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"

/**
 * Inbox-specific layout: collapses the main sidebar so the inbox can use the
 * full available width, and restores it when navigating away.
 */
function SidebarCollapser() {
    const { setOpen } = useSidebar()
    useEffect(() => {
        setOpen(false)
        return () => setOpen(true)
    }, [setOpen])
    return null
}

export default function InboxLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarCollapser />
            {/* Escape the p-4 the dashboard layout adds so inbox fills the pane */}
            <div className="-mx-4 -mb-4 flex flex-1 flex-col overflow-hidden">
                {children}
            </div>
        </>
    )
}
