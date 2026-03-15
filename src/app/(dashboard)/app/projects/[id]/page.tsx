import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import {
    DetailSection,
    DetailField,
    DetailBadges,
    StatusBadge,
} from "../../../_components/detail-field"
import { AdminProjectToggle, AdminEnumToggle } from "../../../_components/admin-toggles"

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    const { id } = await params
    const db = getDB()

    const project = await db
        .prepare("SELECT * FROM projects WHERE id = ?1")
        .bind(id)
        .first()

    if (!project) notFound()

    // Access control: admin sees all, member sees own, mentor sees assigned
    if (user.role === "member") {
        if (!user.memberId) notFound()
        if (project.creator_id !== user.memberId) {
            // Check if collaborator
            const collab = await db
                .prepare("SELECT 1 FROM project_collaborators WHERE project_id = ?1 AND member_id = ?2")
                .bind(id, user.memberId)
                .first()
            if (!collab) notFound()
        }
    } else if (user.role === "mentor") {
        if (!user.mentorId) notFound()
        const pm = await db
            .prepare("SELECT 1 FROM project_mentors WHERE project_id = ?1 AND mentor_id = ?2")
            .bind(id, user.mentorId)
            .first()
        if (!pm) notFound()
    } else if (user.role === "admin") {
        // Admin sees all projects — no additional check needed
    } else {
        notFound()
    }

    // Get creator info
    const creator = await db
        .prepare("SELECT id, full_name, email FROM members WHERE id = ?1")
        .bind(project.creator_id as string)
        .first()

    // Get collaborators
    const { results: collaborators } = await db
        .prepare(`
            SELECT m.id, m.full_name, m.email, pc.role
            FROM project_collaborators pc
            JOIN members m ON m.id = pc.member_id
            WHERE pc.project_id = ?1
        `)
        .bind(id)
        .all()

    // Get assigned mentors
    const { results: mentors } = await db
        .prepare(`
            SELECT mt.id, mt.name, mt.title
            FROM project_mentors pm
            JOIN mentors mt ON mt.id = pm.mentor_id
            WHERE pm.project_id = ?1
        `)
        .bind(id)
        .all()

    const stageColors: Record<string, string> = {
        zero: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        one: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        x: "bg-green-500/10 text-green-600 dark:text-green-400",
    }

    const stageLabels: Record<string, string> = {
        zero: "Zero — Idea",
        one: "One — MVP",
        x: "X — Scale",
    }

    // Parse metrics JSON for stage X
    let metrics: Record<string, string | number> = {}
    try {
        metrics = project.metrics ? JSON.parse(project.metrics as string) : {}
    } catch { /* ignore */ }

    return (
        <div className="space-y-6 max-w-3xl">
            <DetailSection title="Overview">
                <DetailField label="Title" value={project.title as string} />
                <DetailField label="Tagline" value={project.tagline as string} />
                <DetailField
                    label="Stage"
                    value={
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[project.stage as string] || ""}`}>
                            {stageLabels[project.stage as string] || project.stage}
                        </span>
                    }
                />
                <DetailField
                    label="Visibility"
                    value={
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                            {project.visibility as string}
                        </span>
                    }
                />
                <DetailField
                    label="Published"
                    value={<StatusBadge active={project.published as number} trueLabel="Published" falseLabel="Draft" />}
                />
                {project.launch_date && (
                    <DetailField
                        label="Launch Date"
                        value={new Date(project.launch_date as string).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric",
                        })}
                    />
                )}
            </DetailSection>

            {user.role === "admin" && (
                <DetailSection title="Admin Controls">
                    <DetailField
                        label="Published"
                        value={
                            <AdminProjectToggle
                                entityId={id}
                                field="published"
                                currentValue={project.published as number}
                                trueLabel="Published"
                                falseLabel="Draft"
                            />
                        }
                    />
                    <DetailField
                        label="Stage"
                        value={
                            <AdminEnumToggle
                                entityId={id}
                                apiPath="projects"
                                field="stage"
                                currentValue={project.stage as string}
                                options={[
                                    { value: "zero", label: "Zero — Idea" },
                                    { value: "one", label: "One — MVP" },
                                    { value: "x", label: "X — Scale" },
                                ]}
                            />
                        }
                    />
                    <DetailField
                        label="Visibility"
                        value={
                            <AdminEnumToggle
                                entityId={id}
                                apiPath="projects"
                                field="visibility"
                                currentValue={project.visibility as string}
                                options={[
                                    { value: "private", label: "Private" },
                                    { value: "collaborators", label: "Collaborators" },
                                    { value: "public", label: "Public" },
                                ]}
                            />
                        }
                    />
                </DetailSection>
            )}

            {(project.description || project.problem_statement || project.target_audience) && (
                <DetailSection title="Details">
                    {project.description && (
                        <div className="text-sm space-y-1">
                            <span className="text-muted-foreground font-medium">Description</span>
                            <p className="whitespace-pre-wrap">{project.description as string}</p>
                        </div>
                    )}
                    {project.problem_statement && (
                        <div className="text-sm space-y-1">
                            <span className="text-muted-foreground font-medium">Problem Statement</span>
                            <p className="whitespace-pre-wrap">{project.problem_statement as string}</p>
                        </div>
                    )}
                    <DetailField label="Target Audience" value={project.target_audience as string} />
                </DetailSection>
            )}

            <DetailSection title="Links & Media">
                <DetailField label="Product URL" value={project.product_url as string} href={project.product_url as string} />
                <DetailField label="GitHub" value={project.github_url as string} href={project.github_url as string} />
                <DetailField label="Demo Video" value={project.demo_video_url as string} href={project.demo_video_url as string} />
            </DetailSection>

            <DetailSection title="Technical">
                <DetailBadges
                    label="Tech Stack"
                    json={project.tech_stack as string}
                    colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />
            </DetailSection>

            <DetailSection title="Team">
                {creator && (
                    <DetailField
                        label="Creator"
                        value={creator.full_name as string}
                        href={user.role === "admin" ? `/app/members/${creator.id}` : undefined}
                    />
                )}
                {collaborators.length > 0 && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                        <span className="text-muted-foreground font-medium">Collaborators</span>
                        <div className="space-y-1">
                            {collaborators.map((c: Record<string, unknown>) => (
                                <div key={c.id as string} className="flex items-center gap-2">
                                    {user.role === "admin" ? (
                                        <Link href={`/app/members/${c.id}`} className="text-primary underline underline-offset-4 hover:text-primary/80">
                                            {c.full_name as string}
                                        </Link>
                                    ) : (
                                        <span>{c.full_name as string}</span>
                                    )}
                                    <span className="text-xs text-muted-foreground capitalize">({c.role as string})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {mentors.length > 0 && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
                        <span className="text-muted-foreground font-medium">Mentors</span>
                        <div className="space-y-1">
                            {mentors.map((m: Record<string, unknown>) => (
                                <div key={m.id as string} className="flex items-center gap-2">
                                    {user.role === "admin" ? (
                                        <Link href={`/app/mentors/${m.id}`} className="text-primary underline underline-offset-4 hover:text-primary/80">
                                            {m.name as string}
                                        </Link>
                                    ) : (
                                        <span>{m.name as string}</span>
                                    )}
                                    <span className="text-xs text-muted-foreground">{m.title as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DetailSection>

            {project.stage === "x" && Object.keys(metrics).length > 0 && (
                <DetailSection title="Scale Metrics">
                    {metrics.users != null && <DetailField label="Users" value={String(metrics.users)} />}
                    {metrics.revenue != null && <DetailField label="Revenue" value={String(metrics.revenue)} />}
                    {metrics.growth_percentage != null && <DetailField label="Growth" value={`${metrics.growth_percentage}%`} />}
                </DetailSection>
            )}

            <DetailSection title="Community">
                <DetailField label="Upvotes" value={String(project.upvotes_count)} />
                <DetailField label="Comments" value={String(project.comments_count)} />
                <DetailField
                    label="Feedback"
                    value={
                        <StatusBadge
                            active={project.request_feedback as number}
                            trueLabel="Requesting Feedback"
                            falseLabel="Not Requested"
                        />
                    }
                />
                <DetailField
                    label="Collaborators"
                    value={
                        <StatusBadge
                            active={project.looking_for_collaborators as number}
                            trueLabel="Looking for Collaborators"
                            falseLabel="Not Looking"
                        />
                    }
                />
            </DetailSection>
        </div>
    )
}
