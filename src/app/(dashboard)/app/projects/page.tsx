import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { redirect } from "next/navigation"
import { PageHeader } from "../../_components/page-header"

export default async function ProjectsPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    const db = getDB()
    let projects: Record<string, unknown>[] = []

    if (user.role === "member" && user.memberId) {
        const { results } = await db
            .prepare("SELECT * FROM projects WHERE creator_id = ?1 ORDER BY updated_at DESC")
            .bind(user.memberId)
            .all()
        projects = results
    } else if (user.role === "mentor" && user.mentorId) {
        // Mentor sees projects assigned to them
        const { results } = await db
            .prepare(`
        SELECT p.* FROM projects p
        INNER JOIN project_mentors pm ON pm.project_id = p.id
        WHERE pm.mentor_id = ?1
        ORDER BY p.updated_at DESC
      `)
            .bind(user.mentorId)
            .all()
        projects = results
    } else if (user.role === "admin") {
        const { results } = await db
            .prepare("SELECT * FROM projects ORDER BY updated_at DESC LIMIT 50")
            .all()
        projects = results
    }

    const stageColors: Record<string, string> = {
        zero: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        one: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        x: "bg-green-500/10 text-green-600 dark:text-green-400",
    }

    const stageLabels: Record<string, string> = {
        zero: "Zero — Idea",
        one: "One — MVP",
        x: "X — Scale",
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={user.role === "member" ? "My Projects" : "Projects"}
                description={
                    user.role === "member"
                        ? "Manage your projects and track progress"
                        : user.role === "mentor"
                            ? "Projects assigned to you"
                            : "All projects on the platform"
                }
            />

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-muted-foreground">No projects yet</p>
                    {user.role === "member" && (
                        <p className="text-sm text-muted-foreground mt-1">
                            Start by creating your first project
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project.id as string}
                            className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-sm leading-tight">{project.title as string}</h3>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[project.stage as string] || ""}`}>
                                    {stageLabels[project.stage as string] || project.stage}
                                </span>
                            </div>
                            {project.tagline && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{project.tagline as string}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                                <span>↑ {project.upvotes_count as number}</span>
                                <span>💬 {project.comments_count as number}</span>
                                {project.visibility !== "private" && (
                                    <span className="ml-auto capitalize">{project.visibility as string}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
