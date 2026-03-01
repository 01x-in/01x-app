import { getDB } from "@/lib/db"
import { requireRole } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
    DetailSection,
    DetailField,
    DetailBadges,
} from "../../../_components/detail-field"
import { AdminToggle } from "../../../_components/admin-toggles"

export default async function MentorDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireRole("admin")
    const { id } = await params
    const db = getDB()

    const mentor = await db
        .prepare("SELECT * FROM mentors WHERE id = ?1")
        .bind(id)
        .first()

    if (!mentor) notFound()

    // Get projects this mentor is assigned to
    const { results: projects } = await db
        .prepare(`
            SELECT p.id, p.title, p.stage, p.tagline
            FROM project_mentors pm
            JOIN projects p ON p.id = pm.project_id
            WHERE pm.mentor_id = ?1
            ORDER BY p.updated_at DESC
        `)
        .bind(id)
        .all()

    // Parse socials JSON
    let socials: Record<string, string> = {}
    try {
        socials = mentor.socials ? JSON.parse(mentor.socials as string) : {}
    } catch { /* ignore */ }

    // Parse availability JSON
    let availability: Record<string, unknown> = {}
    try {
        availability = mentor.availability ? JSON.parse(mentor.availability as string) : {}
    } catch { /* ignore */ }

    const stageLabels: Record<string, string> = {
        zero: "Zero — Idea",
        one: "One — MVP",
        x: "X — Scale",
    }

    const frequencyLabels: Record<string, string> = {
        weekly: "Weekly 1:1s",
        biweekly: "Biweekly 1:1s",
        monthly: "Monthly 1:1s",
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <DetailSection title="Profile">
                <DetailField label="Name" value={mentor.name as string} />
                <DetailField label="Title" value={mentor.title as string} />
                <DetailField label="Location" value={mentor.location as string} />
                <DetailField label="Short Bio" value={mentor.bio_short as string} />
                {mentor.bio_long && (
                    <DetailField label="Full Bio" value={mentor.bio_long as string} />
                )}
            </DetailSection>

            <DetailSection title="Expertise">
                <DetailBadges
                    label="Domains"
                    json={mentor.domains as string}
                    colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />
                <DetailBadges
                    label="Highlights"
                    json={mentor.highlights as string}
                    colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                />
                <DetailBadges
                    label="Style"
                    json={mentor.mentoring_style as string}
                    colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
                />
            </DetailSection>

            <DetailSection title="Availability">
                <DetailField
                    label="Frequency"
                    value={
                        availability.oneOnOneFrequency
                            ? frequencyLabels[availability.oneOnOneFrequency as string] || (availability.oneOnOneFrequency as string)
                            : null
                    }
                />
                <DetailField
                    label="Max Mentees"
                    value={availability.maxMentees ? String(availability.maxMentees) : null}
                />
            </DetailSection>

            <DetailSection title="Status">
                <DetailField
                    label="Approved"
                    value={
                        <AdminToggle
                            entityType="mentors"
                            entityId={id}
                            field="is_approved"
                            currentValue={mentor.is_approved as number}
                            trueLabel="Approved"
                            falseLabel="Pending"
                        />
                    }
                />
                <DetailField
                    label="Featured"
                    value={
                        <AdminToggle
                            entityType="mentors"
                            entityId={id}
                            field="is_featured"
                            currentValue={mentor.is_featured as number}
                            trueLabel="Featured"
                            falseLabel="Standard"
                        />
                    }
                />
                <DetailField label="Sort Rank" value={String(mentor.sort_rank)} />
            </DetailSection>

            {Object.keys(socials).length > 0 && (
                <DetailSection title="Socials">
                    {socials.linkedin && <DetailField label="LinkedIn" value={socials.linkedin} href={socials.linkedin} />}
                    {socials.twitter && <DetailField label="Twitter" value={socials.twitter} href={socials.twitter} />}
                    {socials.github && <DetailField label="GitHub" value={socials.github} href={socials.github} />}
                    {socials.website && <DetailField label="Website" value={socials.website} href={socials.website} />}
                </DetailSection>
            )}

            {projects.length > 0 && (
                <DetailSection title={`Mentored Projects (${projects.length})`}>
                    <div className="space-y-2">
                        {projects.map((p: Record<string, unknown>) => (
                            <Link
                                key={p.id as string}
                                href={`/app/projects/${p.id}`}
                                className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
                            >
                                <div>
                                    <span className="font-medium text-sm">{p.title as string}</span>
                                    {p.tagline && (
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
        </div>
    )
}
