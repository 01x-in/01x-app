import { getDB } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
    DetailSection,
    DetailField,
    DetailBadges,
} from "../../../_components/detail-field"
import { AdminToggle } from "../../../_components/admin-toggles"

export default async function MemberDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireAdmin()
    const { id } = await params
    const db = getDB()

    const member = await db
        .prepare("SELECT * FROM members WHERE id = ?1")
        .bind(id)
        .first()

    if (!member) notFound()

    // Get projects created by this member
    const { results: projects } = await db
        .prepare("SELECT id, title, stage, tagline FROM projects WHERE creator_id = ?1 ORDER BY updated_at DESC")
        .bind(id)
        .all()

    // Get cohort memberships
    const { results: cohorts } = await db
        .prepare(`
            SELECT c.id, c.name, c.status, cm.role
            FROM cohort_memberships cm
            JOIN cohorts c ON c.id = cm.cohort_id
            WHERE cm.member_id = ?1
        `)
        .bind(id)
        .all()

    const stageLabels: Record<string, string> = {
        zero: "Zero — Idea",
        one: "One — MVP",
        x: "X — Scale",
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <DetailSection title="Profile">
                <DetailField label="Full Name" value={member.full_name as string} />
                <DetailField label="Email" value={member.email as string} href={`mailto:${member.email}`} />
                <DetailField label="Location" value={member.location as string} />
                <DetailField label="Bio" value={member.bio as string} />
                <DetailField
                    label="Status"
                    value={
                        <AdminToggle
                            entityType="members"
                            entityId={id}
                            field="is_active"
                            currentValue={member.is_active as number}
                            trueLabel="Active"
                            falseLabel="Inactive"
                        />
                    }
                />
                <DetailField
                    label="Joined"
                    value={new Date(member.created_at as string).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                />
            </DetailSection>

            <DetailSection title="Links">
                <DetailField label="LinkedIn" value={member.linkedin_url as string} href={member.linkedin_url as string} />
                <DetailField label="GitHub" value={member.github_url as string} href={member.github_url as string} />
                <DetailField label="Website" value={member.website_url as string} href={member.website_url as string} />
            </DetailSection>

            <DetailSection title="Technical">
                <DetailBadges label="Tech Stack" json={member.tech_stack as string} colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
                <DetailBadges label="Interests" json={member.areas_of_interest as string} colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400" />
            </DetailSection>

            {projects.length > 0 && (
                <DetailSection title={`Projects (${projects.length})`}>
                    <div className="space-y-2">
                        {projects.map((p: Record<string, unknown>) => (
                            <Link
                                key={p.id as string}
                                href={`/app/projects/${p.id}`}
                                className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
                            >
                                <div>
                                    <span className="font-medium text-sm">{p.title as string}</span>
                                    {(p.tagline as string | null) && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{String(p.tagline)}</p>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {stageLabels[p.stage as string] || String(p.stage)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </DetailSection>
            )}

            {cohorts.length > 0 && (
                <DetailSection title={`Cohorts (${cohorts.length})`}>
                    <div className="space-y-2">
                        {cohorts.map((c: Record<string, unknown>) => (
                            <div
                                key={c.id as string}
                                className="flex items-center justify-between rounded-lg border px-4 py-3"
                            >
                                <span className="font-medium text-sm">{c.name as string}</span>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                                        {c.role as string}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                                        {c.status as string}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </DetailSection>
            )}
        </div>
    )
}
