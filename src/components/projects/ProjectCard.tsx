"use client";

import Link from "next/link";
import { ArrowUp, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StageBadge } from "./StageBadge";
import type { ProjectWithRelations } from "@/types/projects";

interface ProjectCardProps {
    project: ProjectWithRelations;
    /** compact = homepage card; standard = listing page card */
    variant?: "compact" | "standard";
    className?: string;
}

function CoverImage({ url, title, className }: { url?: string; title: string; className?: string }) {
    return (
        <div className={cn("bg-muted/40 flex items-center justify-center overflow-hidden", className)}>
            {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={url}
                    alt={`${title} cover`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <span className="text-2xl font-bold text-muted-foreground/30 select-none">
                        {title.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            )}
        </div>
    );
}

function CreatorMini({
    creator,
    size = "sm",
}: {
    creator: ProjectWithRelations["creator"];
    size?: "sm" | "md";
}) {
    if (!creator) return null;
    const name = creator.fullName;
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const avatarSize = size === "sm" ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-xs";

    return (
        <span className="inline-flex items-center gap-1.5 min-w-0">
            <span
                className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium overflow-hidden",
                    avatarSize
                )}
                aria-hidden
            >
                {creator.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={creator.avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                    initials
                )}
            </span>
            <span className={cn("text-muted-foreground truncate", size === "sm" ? "text-xs" : "text-sm")}>
                {name}
            </span>
        </span>
    );
}

export function ProjectCard({ project, variant = "standard", className }: ProjectCardProps) {
    const href = `/projects/${project.id}`;

    if (variant === "compact") {
        return (
            <Link
                href={href}
                className={cn(
                    "group flex flex-col rounded-xl border bg-card overflow-hidden",
                    "transition-all duration-200 hover:shadow-md hover:border-foreground/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    className
                )}
                aria-label={`${project.title} — ${project.tagline ?? ""}`}
            >
                {/* Cover */}
                <CoverImage url={project.coverImageUrl} title={project.title} className="h-36" />

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                    <StageBadge stage={project.stage} size="sm" />

                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
                        {project.title}
                    </h3>

                    {project.tagline && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {project.tagline}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                        <CreatorMini creator={project.creator} />
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

    // Standard variant
    const visibleTech = project.techStack?.slice(0, 3) ?? [];
    const extraTech = (project.techStack?.length ?? 0) - 3;

    return (
        <Link
            href={href}
            className={cn(
                "group flex flex-col rounded-xl border bg-card overflow-hidden",
                "transition-all duration-200 hover:shadow-md hover:border-foreground/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
            aria-label={`${project.title} — ${project.tagline ?? ""}`}
        >
            {/* Cover */}
            <CoverImage url={project.coverImageUrl} title={project.title} className="h-44" />

            {/* Content */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                    <StageBadge stage={project.stage} />
                    {project.lookingForCollaborators && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-400">
                            <Users className="h-3 w-3" aria-hidden />
                            Looking for collaborators
                        </span>
                    )}
                </div>

                {/* Title + tagline */}
                <div>
                    <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
                        {project.title}
                    </h3>
                    {project.tagline && (
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {project.tagline}
                        </p>
                    )}
                </div>

                {/* Tech stack */}
                {visibleTech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {visibleTech.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs font-normal px-2 py-0.5">
                                {tech}
                            </Badge>
                        ))}
                        {extraTech > 0 && (
                            <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
                                +{extraTech}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <CreatorMini creator={project.creator} size="md" />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        {project.upvotesCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ArrowUp className="h-3 w-3" aria-hidden />
                                {project.upvotesCount}
                            </span>
                        )}
                        {project.commentsCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" aria-hidden />
                                {project.commentsCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
