import {
    LayoutDashboard,
    Users,
    GraduationCap,
    FileText,
    User,
    FolderKanban,
    Calendar,
    Inbox,
    type LucideIcon,
} from "lucide-react"

export type UserRole = "admin" | "member" | "mentor"

export interface NavItem {
    title: string
    url: string
    icon: LucideIcon
}

export const navConfig: Record<UserRole, NavItem[]> = {
    admin: [
        { title: "Dashboard", url: "/app", icon: LayoutDashboard },
        { title: "Members", url: "/app/members", icon: Users },
        { title: "Mentors", url: "/app/mentors", icon: GraduationCap },
        { title: "Applications", url: "/app/applications", icon: FileText },
    ],
    member: [
        { title: "Dashboard", url: "/app", icon: LayoutDashboard },
        { title: "Inbox", url: "/app/inbox", icon: Inbox },
        { title: "My Profile", url: "/app/profile", icon: User },
        { title: "My Projects", url: "/app/projects", icon: FolderKanban },
        { title: "My Mentors", url: "/app/my-mentors", icon: GraduationCap },
        { title: "Calendar", url: "/app/calendar", icon: Calendar },
    ],
    mentor: [
        { title: "Dashboard", url: "/app", icon: LayoutDashboard },
        { title: "Inbox", url: "/app/inbox", icon: Inbox },
        { title: "My Mentees", url: "/app/mentees", icon: Users },
        { title: "Projects", url: "/app/projects", icon: FolderKanban },
        { title: "Calendar", url: "/app/calendar", icon: Calendar },
    ],
}
