"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StageBadge } from "./StageBadge";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import type { ProjectWithRelations } from "@/types/projects";

function ProjectMini({ project }: { project: ProjectWithRelations }) {
    const creatorName = project.creator?.fullName ?? "Builder";
    const initials = creatorName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <Link
            href={`/projects/${project.id}`}
            className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${project.title} — ${project.tagline ?? ""}`}
        >
            {/* Cover */}
            <div className="h-36 bg-muted/40 flex items-center justify-center overflow-hidden">
                {project.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={project.coverImageUrl}
                        alt={`${project.title} cover`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <span className="text-2xl font-bold text-muted-foreground/20 select-none">
                        {project.title.slice(0, 2).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <StageBadge stage={project.stage} size="sm" />

                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                    {project.title}
                </h3>

                {project.tagline && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {project.tagline}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground overflow-hidden shrink-0">
                            {project.creator?.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={project.creator.avatarUrl} alt={creatorName} className="h-full w-full object-cover" />
                            ) : initials}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">{creatorName}</span>
                    </span>
                    {project.upvotesCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ArrowUp className="h-3 w-3" aria-hidden />
                            {project.upvotesCount}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export function BuiltIn01X() {
    const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/v1/projects/featured?limit=6")
            .then((r) => {
                if (!r.ok) throw new Error("fetch failed");
                return r.json();
            })
            .then((d) => { setProjects(d.projects ?? []); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    return (
        <section id="built-in-01x" className="section-full-scrollable">
            <div className="container-wide w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-2">Built in 01X</h2>
                        <p className="text-muted-foreground max-w-md leading-relaxed">
                            Real products shipped by real builders. From MVPs to growing products,
                            these live here permanently.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="shrink-0 gap-2">
                        <Link href="/projects">
                            View all projects
                            <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                    </Button>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ProjectCardSkeleton key={i} variant="compact" />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <p className="text-sm text-muted-foreground">Could not load projects.</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setError(false); setLoading(true); fetch("/api/v1/projects/featured?limit=6").then((r) => r.json()).then((d) => { setProjects(d.projects ?? []); setLoading(false); }).catch(() => { setError(true); setLoading(false); }); }}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                        <p className="text-muted-foreground">No published projects yet.</p>
                        <Button asChild>
                            <Link href="/apply">Be the first to ship an MVP →</Link>
                        </Button>
                    </div>
                )}

                {/* Projects grid */}
                {!loading && !error && projects.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.map((project) => (
                            <ProjectMini key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
