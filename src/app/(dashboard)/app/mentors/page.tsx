import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { PageHeader } from "../../_components/page-header"

export default async function MentorsAdminPage() {
    await requireRole("admin")
    const db = getDB()

    const { results } = await db
        .prepare("SELECT * FROM mentors ORDER BY sort_rank ASC, name ASC")
        .all()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mentors"
                description="Manage mentors and their approval status"
            />

            <div className="rounded-xl border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Domains</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Featured</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No mentors yet
                                    </td>
                                </tr>
                            ) : (
                                results.map((mentor) => {
                                    let domains: string[] = []
                                    try {
                                        domains = JSON.parse(mentor.domains as string)
                                    } catch { /* empty */ }

                                    return (
                                        <tr key={mentor.id as string} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">{mentor.name as string}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{mentor.title as string}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {domains.map((d) => (
                                                        <span key={d} className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{(mentor.location as string) || "—"}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${mentor.featured ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
                                                    }`}>
                                                    {mentor.featured ? "Featured" : "Standard"}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
