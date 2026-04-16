"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { StageBadge } from "./StageBadge";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import type { ProjectWithRelations } from "@/types/projects";

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return reduced;
}

// Maps tech keywords → a concise domain label shown as a chip
const DOMAIN_MAP: [RegExp, string][] = [
    [/openai|gpt|llm|ai|ml|hugging/i, "AI/ML"],
    [/solidity|web3|ethers|blockchain/i, "Web3"],
    [/stripe|razorpay|lemonsqueezy/i, "Payments"],
    [/react native|expo|flutter/i, "Mobile"],
    [/electron/i, "Desktop"],
    [/prisma|supabase|postgres|mysql|d1/i, "Database"],
    [/twilio|whatsapp|sms/i, "Messaging"],
    [/next\.js|remix|nuxt/i, "SaaS"],
    [/cloudflare|workers|edge/i, "Edge"],
    [/figma|design/i, "Design"],
];

function getDomainTags(techStack?: string[]): string[] {
    if (!techStack?.length) return [];
    const joined = techStack.join(" ");
    const seen = new Set<string>();
    const tags: string[] = [];
    for (const [re, label] of DOMAIN_MAP) {
        if (re.test(joined) && !seen.has(label)) {
            seen.add(label);
            tags.push(label);
            if (tags.length === 2) break;
        }
    }
    return tags;
}

function ProjectMini({ project }: { project: ProjectWithRelations }) {
    const allBuilders = [
        ...(project.creator ? [project.creator] : []),
        ...(project.collaborators ?? []),
    ];

    return (
        <Link
            href={`/projects/${project.id}`}
            className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 w-[280px]"
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
                <div className="flex items-center gap-1.5 flex-wrap">
                    <StageBadge stage={project.stage} size="sm" />
                    {getDomainTags(project.techStack).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground w-fit"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

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
                    <div className="flex items-center">
                        {allBuilders.slice(0, 3).map((builder, i) => {
                            const name = builder.fullName ?? "Builder";
                            const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                            return (
                                <span
                                    key={builder.id}
                                    title={name}
                                    style={{ zIndex: 3 - i, marginLeft: i === 0 ? 0 : "-6px" }}
                                    className="h-5 w-5 rounded-full bg-muted ring-2 ring-card flex items-center justify-center text-[9px] font-medium text-muted-foreground overflow-hidden shrink-0"
                                >
                                    {builder.avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={builder.avatarUrl} alt={name} className="h-full w-full object-cover" />
                                    ) : initials}
                                </span>
                            );
                        })}
                        {allBuilders.length > 3 && (
                            <span
                                style={{ zIndex: 0, marginLeft: "-6px" }}
                                className="h-5 w-5 rounded-full bg-muted ring-2 ring-card flex items-center justify-center text-[8px] font-medium text-muted-foreground shrink-0"
                            >
                                +{allBuilders.length - 3}
                            </span>
                        )}
                        {allBuilders.length === 1 && (
                            <span className="ml-1.5 text-xs text-muted-foreground truncate max-w-[100px]">
                                {allBuilders[0].fullName}
                            </span>
                        )}
                    </div>

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
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        fetch("/api/v1/projects/featured?limit=8")
            .then((r) => {
                if (!r.ok) throw new Error("fetch failed");
                return r.json();
            })
            .then((d) => { setProjects(d.projects ?? []); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    return (
        <section id="built-in-01x" className="section-full">
            <div className="w-full max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4">Built in 01X</h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
                        Real products shipped by real builders. From MVPs to growing products,
                        these live here permanently.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/projects">View all projects</Link>
                    </Button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex gap-4 justify-center">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ProjectCardSkeleton key={i} variant="compact" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <p className="text-sm text-muted-foreground">Could not load projects.</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setError(false);
                                setLoading(true);
                                fetch("/api/v1/projects/featured?limit=8")
                                    .then((r) => r.json())
                                    .then((d) => { setProjects(d.projects ?? []); setLoading(false); })
                                    .catch(() => { setError(true); setLoading(false); });
                            }}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                        <p className="text-muted-foreground">No published projects yet.</p>
                        <Button asChild>
                            <Link href="/cohort/apply">Be the first to ship an MVP →</Link>
                        </Button>
                    </div>
                )}

                {!loading && !error && projects.length > 0 && (
                    reducedMotion ? (
                        /* ── shadcn Carousel — Reduce Motion ON ── */
                        /* px-12 wrapper gives the absolutely-positioned buttons their 48px lane */
                        <div className="px-12">
                            <Carousel
                                opts={{ align: "start", dragFree: true, loop: true }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4">
                                    {projects.map((project) => (
                                        <CarouselItem key={project.id} className="pl-4 basis-auto">
                                            <ProjectMini project={project} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    ) : (
                        /* ── Animated marquee — Reduce Motion OFF ── */
                        <div className="relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                            <div className="group flex">
                                <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused]">
                                    {[...projects, ...projects].map((project, idx) => (
                                        <ProjectMini key={`${project.id}-${idx}`} project={project} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}
