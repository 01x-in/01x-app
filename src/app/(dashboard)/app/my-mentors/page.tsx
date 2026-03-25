import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { redirect } from "next/navigation"
import { PageHeader } from "../../_components/page-header"

export default async function MyMentorsPage() {
    const user = await getCurrentUser()
    if (!user || !user.memberId) redirect("/app")

    const db = getDB()

    // Find mentors linked to this member's projects
    const { results } = await db
        .prepare(`
      SELECT DISTINCT m.id, m.name, m.title, m.domains, m.location, m.image_src
      FROM mentors m
      INNER JOIN project_mentors pm ON pm.mentor_id = m.id
      INNER JOIN projects p ON p.id = pm.project_id
      WHERE p.creator_id = ?1
      ORDER BY m.name ASC
    `)
        .bind(user.memberId)
        .all()

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Mentors"
                description="Mentors assigned to your projects"
            />

            {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-muted-foreground">No mentors assigned yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Mentors will appear here once they&apos;re assigned to your projects
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((mentor: Record<string, unknown>) => {
                        let domains: string[] = []
                        try { domains = JSON.parse(mentor.domains as string) } catch { /* empty */ }

                        return (
                            <div key={mentor.id as string} className="rounded-xl border bg-card p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    {Boolean(mentor.image_src) && (
                                        <div className="size-10 rounded-full bg-muted overflow-hidden">
                                            <img
                                                src={mentor.image_src as string}
                                                alt={mentor.name as string}
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-sm">{mentor.name as string}</h3>
                                        <p className="text-xs text-muted-foreground">{mentor.title as string}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {domains.map((d) => (
                                        <span key={d} className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
