import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { PageHeader } from "../../_components/page-header"

export default async function MembersPage() {
    await requireRole("admin")
    const db = getDB()

    const { results } = await db
        .prepare("SELECT * FROM members ORDER BY created_at DESC")
        .all()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Members"
                description="Manage all cohort members on the platform"
            />

            <div className="rounded-xl border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No members yet
                                    </td>
                                </tr>
                            ) : (
                                results.map((member) => (
                                    <tr key={member.id as string} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">{member.full_name as string}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.email as string}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                {member.member_type as string}
                                            </span>
                                        </td>
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
        </div>
    )
}
