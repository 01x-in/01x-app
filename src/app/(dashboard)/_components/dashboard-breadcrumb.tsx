"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Map route segments to readable titles
const SEGMENT_TITLES: Record<string, string> = {
    members: "Members",
    mentors: "Mentors",
    projects: "Projects",
    applications: "Applications",
    cohort: "Cohort",
    mentor: "Mentor",
    profile: "My Profile",
    "my-mentors": "My Mentors",
    mentees: "My Mentees",
    calendar: "Calendar",
}

export function DashboardBreadcrumb() {
    const pathname = usePathname()

    // Skip "app" prefix: /app/members/123 → ["members", "123"]
    const segments = pathname.split("/").filter(Boolean)
    const pageSegments = segments.slice(1)

    // Dashboard root
    if (pageSegments.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    // Build crumbs from page segments only (no "Dashboard" prefix)
    const crumbs = pageSegments.map((segment, index) => {
        const href = "/app/" + pageSegments.slice(0, index + 1).join("/")
        const title = SEGMENT_TITLES[segment] || decodeURIComponent(segment)
        const isLast = index === pageSegments.length - 1
        return { href, title, isLast }
    })

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((crumb, index) => (
                    <span key={crumb.href} className="contents">
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {crumb.isLast ? (
                                <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.href}>{crumb.title}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </span>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
