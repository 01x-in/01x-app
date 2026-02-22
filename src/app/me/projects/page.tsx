"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit, ArrowUp, Globe, Lock, Users, Eye } from "lucide-react";
import Navbar from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { StageBadge } from "@/components/projects/StageBadge";
import { VisibilityBadge } from "@/components/projects/VisibilityBadge";
import { EmptyState } from "@/components/projects/EmptyState";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";

type TabFilter = "all" | "zero" | "one" | "x";

const tabConfig: { id: TabFilter; label: string; emptyTitle: string; emptyDesc: string }[] = [
    { id: "all", label: "All", emptyTitle: "No projects yet", emptyDesc: "Start a project and build your builder identity on 01X." },
    { id: "zero", label: "Zero (Ideas)", emptyTitle: "Capture your next idea privately", emptyDesc: "Ideas live here before they're ready for the world. Start one now." },
    { id: "one", label: "One (MVP)", emptyTitle: "Ship an MVP to get featured", emptyDesc: "Move your idea to MVP stage and publish it for the community to see." },
    { id: "x", label: "X (Scale)", emptyTitle: "Show your traction and story", emptyDesc: "Projects at scale with real metrics and momentum live here." },
];

function ProjectListItem({ project }: { project: Project }) {
    const updatedAt = new Date(project.updatedAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });

    return (
        <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
            {/* Cover thumbnail */}
            <div className="h-14 w-20 shrink-0 rounded-md bg-muted/50 overflow-hidden flex items-center justify-center">
                {project.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={project.coverImageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-lg font-bold text-muted-foreground/30">
                        {project.title.slice(0, 2).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm leading-snug truncate max-w-[240px] sm:max-w-none">
                        {project.title}
                    </h3>
                    <StageBadge stage={project.stage} size="sm" />
                    <VisibilityBadge visibility={project.visibility} size="sm" />
                    {project.stage !== "zero" && project.published && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400">
                            <Globe className="h-2.5 w-2.5" aria-hidden /> Published
                        </span>
                    )}
                    {project.stage !== "zero" && !project.published && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Lock className="h-2.5 w-2.5" aria-hidden /> Draft
                        </span>
                    )}
                </div>

                {project.tagline && (
                    <p className="text-xs text-muted-foreground truncate mb-2">{project.tagline}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Updated {updatedAt}</span>
                    {project.upvotesCount > 0 && (
                        <span className="flex items-center gap-1">
                            <ArrowUp className="h-3 w-3" aria-hidden />
                            {project.upvotesCount}
                        </span>
                    )}
                    {project.lookingForCollaborators && (
                        <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                            <Users className="h-3 w-3" aria-hidden />
                            Open to collaborators
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                {project.published && (
                    <Button variant="ghost" size="icon-sm" asChild aria-label="View public page">
                        <Link href={`/projects/${project.id}`}>
                            <Eye className="h-4 w-4" aria-hidden />
                        </Link>
                    </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/me/projects/${project.id}/edit`} className="gap-1.5">
                        <Edit className="h-3.5 w-3.5" aria-hidden />
                        Edit
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default function MyProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabFilter>("all");

    // In a real app, get from auth context
    const memberId = typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

    useEffect(() => {
        if (!memberId) { setLoading(false); return; }

        fetch(`/api/v1/projects?creatorId=${memberId}`)
            .then((r) => r.json())
            .then((d) => { setProjects(d.projects ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [memberId]);

    const filtered = useMemo(() => {
        if (activeTab === "all") return projects;
        return projects.filter((p) => p.stage === activeTab);
    }, [projects, activeTab]);

    const counts = useMemo(() => ({
        all: projects.length,
        zero: projects.filter((p) => p.stage === "zero").length,
        one: projects.filter((p) => p.stage === "one").length,
        x: projects.filter((p) => p.stage === "x").length,
    }), [projects]);

    if (!memberId && !loading) {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                        <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
                        <p className="text-muted-foreground mb-6 text-sm">
                            You need to be a member to view your projects.
                        </p>
                        <Button asChild>
                            <Link href="/apply">Apply for access</Link>
                        </Button>
                    </div>
                </main>
            </>
        );
    }

    const currentTabConfig = tabConfig.find((t) => t.id === activeTab)!;

    return (
        <>
            <Navbar variant="pages" />
            <main className="min-h-screen flex flex-col bg-background pt-24">
                <div className="container-wide flex-1 pb-16">
                    {/* Header */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold mb-2">My Projects</h1>
                            <p className="text-muted-foreground text-sm">
                                Your builder identity — ideas, MVPs, and growing products.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/me/projects/new" className="gap-2">
                                <Plus className="h-4 w-4" aria-hidden />
                                New project
                            </Link>
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div
                        className="flex gap-0.5 border-b mb-6 overflow-x-auto"
                        role="tablist"
                        aria-label="Filter projects by stage"
                    >
                        {tabConfig.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "border-foreground text-foreground"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.label}
                                {counts[tab.id] > 0 && (
                                    <span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
                                        {counts[tab.id]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 rounded-lg bg-muted/40 animate-pulse" />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && filtered.length === 0 && (
                        <EmptyState
                            title={currentTabConfig.emptyTitle}
                            description={currentTabConfig.emptyDesc}
                            action={{ label: "Start a new project", href: "/me/projects/new" }}
                        />
                    )}

                    {/* Project list */}
                    {!loading && filtered.length > 0 && (
                        <div className="rounded-xl border bg-card px-6">
                            {filtered.map((project) => (
                                <ProjectListItem key={project.id} project={project} />
                            ))}
                        </div>
                    )}

                    {/* Info callout */}
                    {!loading && (
                        <div className="mt-12 rounded-xl border border-dashed bg-muted/20 p-6">
                            <h3 className="font-medium mb-2 text-sm">Your projects live here forever</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Even after your cohort ends, your projects remain on 01X.
                                They&apos;re part of your builder identity — a permanent record of what you built and shipped.
                            </p>
                        </div>
                    )}
                </div>

                <Footer className="mt-24" />
            </main>
        </>
    );
}
