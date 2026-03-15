import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { notFound } from "next/navigation"
import {
    DetailSection,
    DetailField,
    StatusBadge,
} from "../../../../_components/detail-field"

export default async function CohortApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireRole("admin")
    const { id } = await params
    const db = getDB()

    const app = await db
        .prepare("SELECT * FROM applications WHERE id = ?1")
        .bind(id)
        .first()

    if (!app) notFound()

    const statusColors: Record<string, string> = {
        pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        approved: "bg-green-500/10 text-green-600 dark:text-green-400",
        rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Quick status header */}
            <div className="flex items-center gap-3">
                <span className="font-semibold text-lg">{app.full_name as string}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[app.status as string] || ""}`}>
                    {app.status as string}
                </span>
            </div>

            <DetailSection title="Demographics">
                <DetailField label="Full Name" value={app.full_name as string} />
                <DetailField label="Email" value={app.email as string} href={`mailto:${app.email}`} />
                <DetailField label="Location" value={app.location as string} />
                <DetailField label="LinkedIn" value={app.linkedin_url as string} href={app.linkedin_url as string} />
                <DetailField
                    label="Submitted"
                    value={new Date(app.created_at as string).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                    })}
                />
            </DetailSection>

            <DetailSection title="Product Vision">
                <DetailField label="What Building" value={app.what_building as string} />
                <DetailField label="Why It Matters" value={app.why_matters as string} />
                <DetailField label="Current Approach" value={app.current_approach as string} />
                <DetailField label="Problem Solved" value={app.problem_solved as string} />
            </DetailSection>

            <DetailSection title="Current Stage">
                <DetailField label="Stage" value={app.current_stage as string} />
                <DetailField label="Product Link" value={app.product_link as string} href={app.product_link as string} />
            </DetailSection>

            <DetailSection title="Team">
                <DetailField label="Has Co-founder" value={app.has_cofounder as string} />
                <DetailField label="Open to Connect" value={app.open_to_connect as string} />
            </DetailSection>

            <DetailSection title="Technical Profile">
                <DetailField label="Background" value={app.background as string} />
                <DetailField label="Primary Skill" value={app.primary_skill as string} />
                <DetailField label="Superpower" value={app.superpower as string} />
            </DetailSection>

            <DetailSection title="Commitment">
                <DetailField label="Hours/Week" value={app.hours_per_week as string} />
                <DetailField label="Investment Range" value={app.investment_range as string} />
            </DetailSection>

            <DetailSection title="Expectations">
                <DetailField label="Primary Goal" value={app.primary_goal as string} />
                <DetailField label="Success Looks Like" value={app.success_looks_like as string} />
                <DetailField label="Wants Mentors" value={app.wants_mentors as string} />
            </DetailSection>

            <DetailSection title="Strategic">
                <DetailField label="Tried Before" value={app.tried_before as string} />
                <DetailField label="What Happened" value={app.what_happened as string} />
                <DetailField label="Biggest Blocker" value={app.biggest_blocker as string} />
                <DetailField label="Heard From" value={app.heard_from as string} />
                <DetailField label="Why Now" value={app.why_now as string} />
                <DetailField label="Ready to Commit" value={app.ready_to_commit as string} />
            </DetailSection>

            <DetailSection title="Community">
                <DetailField label="Comfortable Public" value={app.comfortable_public as string} />
                <DetailField label="Willing to Help" value={app.willing_to_help as string} />
            </DetailSection>

            <DetailSection title="Closing">
                <DetailField label="Biggest Fear" value={app.biggest_fear as string} />
                <DetailField label="Specific Help" value={app.specific_help as string} />
            </DetailSection>
        </div>
    )
}
