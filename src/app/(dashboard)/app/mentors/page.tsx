import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { PageHeader } from "../../_components/page-header"
import { SearchInput, FilterSelect, ListToolbar } from "../../_components/list-controls"
import { Pagination } from "../../_components/pagination"
import Link from "next/link"

const PAGE_SIZE = 20

export default async function MentorsAdminPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; approved?: string; featured?: string; page?: string }>
}) {
    await requireRole("admin")
    const params = await searchParams
    const db = getDB()

    const q = params.q || ""
    const approvedFilter = params.approved || ""
    const featuredFilter = params.featured || ""
    const page = Math.max(1, parseInt(params.page || "1", 10))
    const offset = (page - 1) * PAGE_SIZE

    // Build WHERE clauses
    const conditions: string[] = []
    const bindings: (string | number)[] = []
    let bindIdx = 1

    if (q) {
        conditions.push(`(name LIKE ?${bindIdx} OR title LIKE ?${bindIdx})`)
        bindings.push(`%${q}%`)
        bindIdx++
    }
    if (approvedFilter) {
        conditions.push(`is_approved = ?${bindIdx}`)
        bindings.push(approvedFilter === "approved" ? 1 : 0)
        bindIdx++
    }
    if (featuredFilter) {
        conditions.push(`is_featured = ?${bindIdx}`)
        bindings.push(featuredFilter === "yes" ? 1 : 0)
        bindIdx++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Count total
    const countResult = await db
        .prepare(`SELECT COUNT(*) as count FROM mentors ${whereClause}`)
        .bind(...bindings)
        .first()
    const totalItems = (countResult?.count as number) || 0
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    // Fetch page
    const { results } = await db
        .prepare(`SELECT * FROM mentors ${whereClause} ORDER BY sort_rank ASC, name ASC LIMIT ?${bindIdx} OFFSET ?${bindIdx + 1}`)
        .bind(...bindings, PAGE_SIZE, offset)
        .all()

    return (
        <div className="space-y-4">
            <PageHeader
                title="Mentors"
                description="Manage mentors and their approval status"
            />

            <ListToolbar>
                <SearchInput placeholder="Search mentors…" />
                <div className="flex items-center gap-2">
                    <FilterSelect
                        paramName="approved"
                        label="All Status"
                        options={[
                            { value: "approved", label: "Approved" },
                            { value: "pending", label: "Pending" },
                        ]}
                    />
                    <FilterSelect
                        paramName="featured"
                        label="All Featured"
                        options={[
                            { value: "yes", label: "Featured" },
                            { value: "no", label: "Standard" },
                        ]}
                    />
                </div>
            </ListToolbar>

            <div className="rounded-xl border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Domains</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Featured</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        {q || approvedFilter || featuredFilter ? "No matching mentors" : "No mentors yet"}
                                    </td>
                                </tr>
                            ) : (
                                results.map((mentor: Record<string, unknown>) => {
                                    let domains: string[] = []
                                    try {
                                        domains = JSON.parse(mentor.domains as string)
                                    } catch { /* empty */ }

                                    return (
                                        <tr key={mentor.id as string} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                <Link href={`/app/mentors/${mentor.id}`} className="text-primary underline-offset-4 hover:underline">
                                                    {mentor.name as string}
                                                </Link>
                                            </td>
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
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${mentor.is_approved ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    }`}>
                                                    {mentor.is_approved ? "Approved" : "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${mentor.is_featured ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
                                                    }`}>
                                                    {mentor.is_featured ? "Featured" : "Standard"}
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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
            />
        </div>
    )
}
