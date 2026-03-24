import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { redirect } from "next/navigation"
import { PageHeader } from "../../_components/page-header"
import { SearchInput, FilterSelect, ListToolbar } from "../../_components/list-controls"
import { Pagination } from "../../_components/pagination"
import Link from "next/link"

const PAGE_SIZE = 12

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; stage?: string; visibility?: string; page?: string }>
}) {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    const params = await searchParams
    const db = getDB()

    const q = params.q || ""
    const stageFilter = params.stage || ""
    const visibilityFilter = params.visibility || ""
    const page = Math.max(1, parseInt(params.page || "1", 10))
    const offset = (page - 1) * PAGE_SIZE

    // Build query based on role
    let baseTable = "projects"
    const conditions: string[] = []
    const bindings: (string | number)[] = []
    let bindIdx = 1

    if (user.role === "member" && user.memberId) {
        conditions.push(`p.creator_id = ?${bindIdx}`)
        bindings.push(user.memberId)
        bindIdx++
        baseTable = "projects p"
    } else if (user.role === "mentor" && user.mentorId) {
        baseTable = "projects p INNER JOIN project_mentors pm ON pm.project_id = p.id"
        conditions.push(`pm.mentor_id = ?${bindIdx}`)
        bindings.push(user.mentorId)
        bindIdx++
    } else if (user.role === "admin") {
        baseTable = "projects p"
    }

    if (q) {
        conditions.push(`(p.title LIKE ?${bindIdx} OR p.tagline LIKE ?${bindIdx})`)
        bindings.push(`%${q}%`)
        bindIdx++
    }
    if (stageFilter) {
        conditions.push(`p.stage = ?${bindIdx}`)
        bindings.push(stageFilter)
        bindIdx++
    }
    if (visibilityFilter) {
        conditions.push(`p.visibility = ?${bindIdx}`)
        bindings.push(visibilityFilter)
        bindIdx++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Count total
    const countResult = await db
        .prepare(`SELECT COUNT(*) as count FROM ${baseTable} ${whereClause}`)
        .bind(...bindings)
        .first()
    const totalItems = (countResult?.count as number) || 0
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    // Fetch page
    const { results: projects } = await db
        .prepare(`SELECT p.* FROM ${baseTable} ${whereClause} ORDER BY p.updated_at DESC LIMIT ?${bindIdx} OFFSET ?${bindIdx + 1}`)
        .bind(...bindings, PAGE_SIZE, offset)
        .all()

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
        <div className="space-y-4">
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

            <ListToolbar>
                <SearchInput placeholder="Search projects…" />
                <div className="flex items-center gap-2">
                    <FilterSelect
                        paramName="stage"
                        label="All Stages"
                        options={[
                            { value: "zero", label: "Zero — Idea" },
                            { value: "one", label: "One — MVP" },
                            { value: "x", label: "X — Scale" },
                        ]}
                    />
                    {user.role === "admin" && (
                        <FilterSelect
                            paramName="visibility"
                            label="All Visibility"
                            options={[
                                { value: "private", label: "Private" },
                                { value: "collaborators", label: "Collaborators" },
                                { value: "public", label: "Public" },
                            ]}
                        />
                    )}
                </div>
            </ListToolbar>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-muted-foreground">
                        {q || stageFilter || visibilityFilter ? "No matching projects" : "No projects yet"}
                    </p>
                    {user.role === "member" && !q && !stageFilter && (
                        <p className="text-sm text-muted-foreground mt-1">
                            Start by creating your first project
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: Record<string, unknown>) => (
                        <Link
                            key={project.id as string}
                            href={`/app/projects/${project.id}`}
                            className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-sm leading-tight">{project.title as string}</h3>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ml-2 ${stageColors[project.stage as string] || ""}`}>
                                    {stageLabels[project.stage as string] || (project.stage as string)}
                                </span>
                            </div>
                            {Boolean(project.tagline) && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{project.tagline as string}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                                <span>↑ {project.upvotes_count as number}</span>
                                <span>💬 {project.comments_count as number}</span>
                                {project.visibility !== "private" && (
                                    <span className="ml-auto capitalize">{project.visibility as string}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
            />
        </div>
    )
}
