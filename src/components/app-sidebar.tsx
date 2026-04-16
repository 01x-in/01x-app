"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  User,
  FolderKanban,
  Calendar,
  type LucideIcon,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import O1XLogo from "@/components/o1x-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Role-based navigation config
interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

type UserRole = "admin" | "member" | "mentor"

const navConfig: Record<UserRole, NavItem[]> = {
  admin: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "Members", url: "/app/members", icon: Users },
    { title: "Mentors", url: "/app/mentors", icon: GraduationCap },
    { title: "Projects", url: "/app/projects", icon: FolderKanban },
    { title: "Applications", url: "/app/applications", icon: FileText },
  ],
  member: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "My Profile", url: "/app/profile", icon: User },
    { title: "My Projects", url: "/app/projects", icon: FolderKanban },
    { title: "My Mentors", url: "/app/my-mentors", icon: GraduationCap },
    { title: "Calendar", url: "/app/calendar", icon: Calendar },
  ],
  mentor: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboard },
    { title: "My Mentees", url: "/app/mentees", icon: Users },
    { title: "Projects", url: "/app/projects", icon: FolderKanban },
    { title: "Calendar", url: "/app/calendar", icon: Calendar },
  ],
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  member: "Cohort Member",
  mentor: "Mentor",
}

export function AppSidebar({
  role,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  role: UserRole
  user: { name: string; email: string; avatar: string }
}) {
  const pathname = usePathname()
  const items = navConfig[role] || navConfig.member

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:!bg-transparent group-data-[collapsible=icon]:hover:!bg-transparent group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!items-center"
            >
              <Link href="/app">
                <div className="flex size-7 shrink-0 items-center justify-center">
                  <O1XLogo size={28} color="var(--brand)" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">01X</span>
                  <span className="truncate text-xs">{ROLE_LABELS[role]}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.url === "/app"
                      ? pathname === "/app"
                      : pathname.startsWith(item.url)
                  }
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
