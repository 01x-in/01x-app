import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { notFound } from "next/navigation"
import {
    DetailSection,
    DetailField,
} from "../../../../_components/detail-field"

export default async function MentorApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireRole("admin")
    const { id } = await params
    const db = getDB()

    const app = await db
        .prepare("SELECT * FROM mentor_applications WHERE id = ?1")
        .bind(id)
        .first()

    if (!app) notFound()

    const statusColors: Record<string, string> = {
        pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        approved: "bg-green-500/10 text-green-600 dark:text-green-400",
        rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    }

    const frequencyLabels: Record<string, string> = {
        weekly: "Weekly 1:1s",
        biweekly: "Biweekly 1:1s",
        monthly: "Monthly 1:1s",
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

            <DetailSection title="Profile">
                <DetailField label="Full Name" value={app.full_name as string} />
                <DetailField label="Email" value={app.email as string} href={`mailto:${app.email}`} />
                <DetailField label="Title" value={app.title as string} />
                <DetailField label="Location" value={app.location as string} />
                <DetailField label="LinkedIn" value={app.linkedin_url as string} href={app.linkedin_url as string} />
                <DetailField label="Twitter" value={app.twitter_url as string} href={app.twitter_url as string} />
                <DetailField
                    label="Submitted"
                    value={new Date(app.created_at as string).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                    })}
                />
            </DetailSection>

            <DetailSection title="Expertise">
                <DetailField label="Domains" value={app.domains as string} />
                <DetailField label="Years Experience" value={app.years_experience as string} />
                <DetailField label="Short Bio" value={app.bio_short as string} />
                <DetailField label="Biggest Win" value={app.biggest_win as string} />
                <DetailField label="Best At" value={app.best_at as string} />
            </DetailSection>

            <DetailSection title="Mentoring Style">
                <DetailField label="Approach" value={app.mentoring_approach as string} />
                <DetailField label="Why Mentor" value={app.why_mentor as string} />
                <DetailField label="Ideal Mentee" value={app.ideal_mentee as string} />
            </DetailSection>

            <DetailSection title="Availability">
                <DetailField
                    label="1:1 Frequency"
                    value={
                        app.one_on_one_frequency
                            ? frequencyLabels[app.one_on_one_frequency as string] || (app.one_on_one_frequency as string)
                            : null
                    }
                />
                <DetailField label="Async Feedback" value={app.async_feedback as string} />
                <DetailField label="Weekend Sessions" value={app.weekend_sessions as string} />
            </DetailSection>

            <DetailSection title="Closing">
                <DetailField label="Heard About Us" value={app.heard_about_us as string} />
                <DetailField label="Anything Else" value={app.anything_else as string} />
            </DetailSection>
        </div>
    )
}
