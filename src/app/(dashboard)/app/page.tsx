import { Users, GraduationCap, FileText, FolderKanban, Calendar } from "lucide-react"
import { PageHeader } from "../_components/page-header"
import { StatCard } from "../_components/stat-card"
import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    const db = getDB()

    if (user.role === "admin") {
        // Admin dashboard: show platform stats
        const membersCount = await db.prepare("SELECT COUNT(*) as count FROM members WHERE is_active = 1").first<{ count: number }>()
        const mentorsCount = await db.prepare("SELECT COUNT(*) as count FROM mentors").first<{ count: number }>()
        const pendingApps = await db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'").first<{ count: number }>()
        const pendingMentorApps = await db.prepare("SELECT COUNT(*) as count FROM mentor_applications WHERE status = 'pending'").first<{ count: number }>()
        const projectsCount = await db.prepare("SELECT COUNT(*) as count FROM projects").first<{ count: number }>()

        return (
            <div className="space-y-8">
                <PageHeader
                    title="Admin Dashboard"
                    description="Platform overview and management"
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Active Members"
                        value={membersCount?.count ?? 0}
                        icon={Users}
                    />
                    <StatCard
                        title="Mentors"
                        value={mentorsCount?.count ?? 0}
                        icon={GraduationCap}
                    />
                    <StatCard
                        title="Pending Applications"
                        value={(pendingApps?.count ?? 0) + (pendingMentorApps?.count ?? 0)}
                        description={`${pendingApps?.count ?? 0} cohort · ${pendingMentorApps?.count ?? 0} mentor`}
                        icon={FileText}
                    />
                    <StatCard
                        title="Projects"
                        value={projectsCount?.count ?? 0}
                        icon={FolderKanban}
                    />
                </div>
            </div>
        )
    }

    if (user.role === "mentor") {
        // Mentor dashboard
        const assignedProjects = user.mentorId
            ? await db.prepare("SELECT COUNT(*) as count FROM project_mentors WHERE mentor_id = ?1").bind(user.mentorId).first<{ count: number }>()
            : { count: 0 }

        return (
            <div className="space-y-8">
                <PageHeader
                    title="Mentor Dashboard"
                    description={`Welcome back, ${user.fullName}`}
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Assigned Projects"
                        value={assignedProjects?.count ?? 0}
                        icon={FolderKanban}
                    />
                    <StatCard
                        title="Upcoming Events"
                        value="—"
                        description="Coming soon"
                        icon={Calendar}
                    />
                    <StatCard
                        title="Mentees"
                        value="—"
                        description="Coming soon"
                        icon={Users}
                    />
                </div>
            </div>
        )
    }

    // Member dashboard
    const myProjects = user.memberId
        ? await db.prepare("SELECT COUNT(*) as count FROM projects WHERE creator_id = ?1").bind(user.memberId).first<{ count: number }>()
        : { count: 0 }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Dashboard"
                description={`Welcome back, ${user.fullName}`}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="My Projects"
                    value={myProjects?.count ?? 0}
                    icon={FolderKanban}
                />
                <StatCard
                    title="Upcoming Events"
                    value="—"
                    description="Coming soon"
                    icon={Calendar}
                />
                <StatCard
                    title="Assigned Mentors"
                    value="—"
                    description="Coming soon"
                    icon={GraduationCap}
                />
            </div>
        </div>
    )
}
