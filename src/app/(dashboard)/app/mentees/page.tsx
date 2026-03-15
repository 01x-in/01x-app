import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { redirect } from "next/navigation"
import { PageHeader } from "../../_components/page-header"

export default async function MenteesPage() {
    const user = await getCurrentUser()
    if (!user || user.role !== "mentor" || !user.mentorId) redirect("/app")

    const db = getDB()

    // Find cohort members linked to this mentor via project_mentors
    const { results } = await db
        .prepare(`
      SELECT DISTINCT mem.id, mem.full_name, mem.email, mem.avatar_url,
             mem.location, mem.tech_stack, mem.bio,
             COUNT(DISTINCT p.id) as project_count
      FROM members mem
      INNER JOIN projects p ON p.creator_id = mem.id
      INNER JOIN project_mentors pm ON pm.project_id = p.id
      WHERE pm.mentor_id = ?1 AND mem.is_active = 1
      GROUP BY mem.id
      ORDER BY mem.full_name ASC
    `)
        .bind(user.mentorId)
        .all()

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Mentees"
                description="Cohort members assigned to you through their projects"
            />

            {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-muted-foreground">No mentees assigned yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Mentees will appear here once you&apos;re assigned to their projects
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((mentee: Record<string, unknown>) => {
                        let techStack: string[] = []
                        try { techStack = JSON.parse(mentee.tech_stack as string) } catch { /* empty */ }

                        return (
                            <div key={mentee.id as string} className="rounded-xl border bg-card p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    {mentee.avatar_url ? (
                                        <div className="size-10 rounded-full bg-muted overflow-hidden">
                                            <img
                                                src={mentee.avatar_url as string}
                                                alt={mentee.full_name as string}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">
                                                {(mentee.full_name as string).charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-sm">{mentee.full_name as string}</h3>
                                        <p className="text-xs text-muted-foreground">{mentee.email as string}</p>
                                    </div>
                                </div>

                                {(mentee.bio as string | null) && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {mentee.bio as string}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{mentee.project_count as number} project{(mentee.project_count as number) !== 1 ? "s" : ""}</span>
                                    {(mentee.location as string) && <span>{mentee.location as string}</span>}
                                </div>

                                {techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {techStack.slice(0, 4).map((tech) => (
                                            <span key={tech} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {tech}
                                            </span>
                                        ))}
                                        {techStack.length > 4 && (
                                            <span className="text-xs text-muted-foreground">+{techStack.length - 4}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
