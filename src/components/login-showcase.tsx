"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { ProjectWithRelations } from "@/types/projects"
import { StageBadge } from "@/components/projects/StageBadge"
import { getDomainTags } from "@/lib/project-utils"
import { Quote } from "lucide-react"

const FALLBACK_QUOTES = [
    "01X gave me the structure I needed to stop ideating and start shipping. I went from a napkin sketch to a live MVP in six weeks.",
    "The cohort format kept me accountable. Having mentors and peers who genuinely cared made all the difference.",
    "I built more in six weeks with 01X than I had in the previous year solo. The environment just removes all the excuses.",
]


function PosterCard({ project }: { project: ProjectWithRelations }) {
    const initials = project.title.slice(0, 2).toUpperCase()


    return (
        <Link
            href={`/projects/${project.id}`}
            className="group relative aspect-[3/4] rounded-xl border overflow-hidden block transition-all duration-300 hover:shadow-xl hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {/* Full-bleed cover */}
            <div className="absolute inset-0 bg-muted/60">
                {project.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={project.coverImageUrl}
                        alt={`${project.title} cover`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <span className="text-5xl font-bold text-muted-foreground/20 select-none">
                            {initials}
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Info overlaid at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <StageBadge stage={project.stage} size="sm" />
                    {getDomainTags(project.techStack).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="font-semibold text-sm text-white leading-snug line-clamp-1">
                    {project.title}
                </h3>

                {project.tagline && (
                    <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                        {project.tagline}
                    </p>
                )}


            </div>
        </Link>
    )
}

export function LoginShowcase() {
    const [project, setProject] = useState<ProjectWithRelations | null>(null)
    const [loading, setLoading] = useState(true)
    const [fallbackQuote] = useState(
        () => FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
    )

    useEffect(() => {
        fetch("/api/v1/projects/featured?limit=5")
            .then((r) => { if (!r.ok) throw new Error(); return r.json() })
            .then((data: { projects?: ProjectWithRelations[] }) => {
                const projects = data.projects ?? []
                if (projects.length > 0) {
                    setProject(projects[Math.floor(Math.random() * projects.length)])
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const quote = project?.founderQuote ?? fallbackQuote

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-muted/60 via-background to-muted/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />

            <div className="relative w-full max-w-[280px] flex flex-col gap-6">
                {/* Label */}
                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-border/60" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
                        Built on 01X
                    </span>
                    <span className="h-px flex-1 bg-border/60" />
                </div>

                {/* Poster card */}
                {loading ? (
                    <div className="aspect-[3/4] rounded-xl border bg-muted/60 animate-pulse" />
                ) : project ? (
                    <PosterCard project={project} />
                ) : (
                    <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-3 text-center">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                            01X
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Featured projects will appear here once builders publish their work.
                        </p>
                    </div>
                )}

                {/* Quote + founder attribution */}
                <div className="flex flex-col gap-2 px-1">
                    <Quote className="h-3.5 w-3.5 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                        {quote}
                    </p>
                    {project?.creator && (
                        <div className="flex items-center gap-2 pt-0.5">
                            <span className="h-px w-4 bg-border" />
                            <span className="text-[11px] text-muted-foreground/50 font-medium">
                                {project.creator.fullName}
                                {project.cohort?.cohortNumber ? ` · Cohort ${project.cohort.cohortNumber}` : " · Cohort Builder"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
