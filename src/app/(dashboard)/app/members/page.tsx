import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { PageHeader } from "../../_components/page-header"
import { SearchInput, FilterSelect, ListToolbar } from "../../_components/list-controls"
import { Pagination } from "../../_components/pagination"
import Link from "next/link"

const PAGE_SIZE = 20

export default async function MembersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
    await requireAdmin()
    const params = await searchParams
    const db = getDB()

    const q = params.q || ""
    const statusFilter = params.status || ""
    const page = Math.max(1, parseInt(params.page || "1", 10))
    const offset = (page - 1) * PAGE_SIZE

    // Build WHERE clauses
    const conditions: string[] = []
    const bindings: (string | number)[] = []
    let bindIdx = 1

    if (q) {
        conditions.push(`(full_name LIKE ?${bindIdx} OR email LIKE ?${bindIdx})`)
        bindings.push(`%${q}%`)
        bindIdx++
    }
    if (statusFilter) {
        conditions.push(`is_active = ?${bindIdx}`)
        bindings.push(statusFilter === "active" ? 1 : 0)
        bindIdx++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Count total
    const countResult = await db
        .prepare(`SELECT COUNT(*) as count FROM members ${whereClause}`)
        .bind(...bindings)
        .first()
    const totalItems = (countResult?.count as number) || 0
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    // Fetch page
    const { results } = await db
        .prepare(`SELECT * FROM members ${whereClause} ORDER BY created_at DESC LIMIT ?${bindIdx} OFFSET ?${bindIdx + 1}`)
        .bind(...bindings, PAGE_SIZE, offset)
        .all()

    return (
        <div className="space-y-4">
            <PageHeader
                title="Members"
                description="Manage all cohort members on the platform"
            />

            <ListToolbar>
                <SearchInput placeholder="Search members…" />
                <div className="flex items-center gap-2">
                    <FilterSelect
                        paramName="status"
                        label="All Status"
                        options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
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
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        {q || statusFilter ? "No matching members" : "No members yet"}
                                    </td>
                                </tr>
                            ) : (
                                results.map((member: Record<string, unknown>) => (
                                    <tr key={member.id as string} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">
                                            <Link href={`/app/members/${member.id}`} className="text-primary underline-offset-4 hover:underline">
                                                {member.full_name as string}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.email as string}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{(member.location as string) || "—"}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.is_active ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                                                }`}>
                                                {member.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {new Date(member.created_at as string).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
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
