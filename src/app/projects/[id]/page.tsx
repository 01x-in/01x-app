"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
    ArrowUp, MessageSquare, ExternalLink, Github, Play,
    Users, ChevronRight, Edit, Globe, Lock, RefreshCw,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StageBadge } from "@/components/projects/StageBadge";
import { VisibilityBadge } from "@/components/projects/VisibilityBadge";
import { MediaGallery } from "@/components/projects/MediaGallery";
import { PeopleStack } from "@/components/projects/PeopleStack";
import { cn } from "@/lib/utils";
import { track, events } from "@/lib/analytics";
import type { ProjectWithRelations, ProjectCommentWithMember } from "@/types/projects";

type Tab = "overview" | "media" | "scale";

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
        >
            {label}
        </button>
    );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border bg-card px-5 py-4">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
        </div>
    );
}

function CommentItem({ comment }: { comment: ProjectCommentWithMember }) {
    const name = comment.member?.fullName ?? "Member";
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div className="flex gap-3">
            <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                {initials}
            </span>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l space-y-4">
                        {comment.replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<ProjectWithRelations | null>(null);
    const [comments, setComments] = useState<ProjectCommentWithMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<"not_found" | "forbidden" | "error" | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    // In a real app, get memberId from auth context
    const memberId = typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

    useEffect(() => {
        const url = memberId
            ? `/api/v1/projects/${id}?memberId=${memberId}`
            : `/api/v1/projects/${id}`;

        fetch(url)
            .then((res) => {
                if (res.status === 404) { setError("not_found"); setLoading(false); return null; }
                if (res.status === 403 || res.status === 401) { setError("forbidden"); setLoading(false); return null; }
                if (!res.ok) { setError("error"); setLoading(false); return null; }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setProject(data.project);
                setUpvoted(data.project.hasUpvoted ?? false);
                setUpvoteCount(data.project.upvotesCount ?? 0);
                setLoading(false);
            })
            .catch(() => { setError("error"); setLoading(false); });
    }, [id, memberId]);

    useEffect(() => {
        if (!project) return;
        fetch(`/api/v1/projects/${id}/comments`)
            .then((r) => r.json())
            .then((d) => setComments(d.comments ?? []))
            .catch(() => { });
    }, [id, project]);

    const handleUpvote = async () => {
        if (!memberId || !project) return;
        const prev = upvoted;
        setUpvoted(!prev);
        setUpvoteCount((c) => prev ? c - 1 : c + 1);
        track(events.PROJECT_UPVOTED, { projectId: project.id });

        try {
            const res = await fetch(`/api/v1/projects/${id}/upvote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId }),
            });
            const data = await res.json();
            setUpvoted(data.upvoted);
            setUpvoteCount(data.upvotesCount);
        } catch {
            setUpvoted(prev);
            setUpvoteCount((c) => prev ? c + 1 : c - 1);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !memberId || !project) return;
        setSubmittingComment(true);
        try {
            const res = await fetch(`/api/v1/projects/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: crypto.randomUUID(),
                    memberId,
                    content: comment.trim(),
                }),
            });
            const data = await res.json();
            setComments((prev) => [...prev, data.comment]);
            setComment("");
            track(events.PROJECT_COMMENT_ADDED, { projectId: project.id });
        } catch {
            // no-op
        } finally {
            setSubmittingComment(false);
        }
    };

    // Error states
    if (!loading && error === "not_found") {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                        <h1 className="text-4xl font-bold mb-3">404</h1>
                        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
                        <p className="text-muted-foreground mb-6">This project doesn&apos;t exist or has been removed.</p>
                        <Button asChild><Link href="/projects">Browse projects</Link></Button>
                    </div>
                </main>
            </>
        );
    }

    if (!loading && error === "forbidden") {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                        <div className="flex justify-center mb-4">
                            <span className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                                <Lock className="h-6 w-6 text-muted-foreground" />
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">This project isn&apos;t public</h2>
                        <p className="text-muted-foreground mb-6">
                            This project is private or shared only with collaborators.
                        </p>
                        <Button asChild><Link href="/projects">Browse public projects</Link></Button>
                    </div>
                </main>
            </>
        );
    }

    if (!loading && error) {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                    <div className="text-center max-w-sm px-6">
                        <p className="text-muted-foreground mb-4">Something went wrong loading this project.</p>
                        <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
                            <RefreshCw className="h-4 w-4" />Retry
                        </Button>
                    </div>
                </main>
            </>
        );
    }

    // Loading skeleton
    if (loading) {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 pb-16">
                    <div className="container-wide max-w-4xl animate-pulse">
                        <div className="h-64 rounded-xl bg-muted/60 mb-6" />
                        <div className="h-8 w-1/2 rounded bg-muted/60 mb-3" />
                        <div className="h-5 w-2/3 rounded bg-muted/40 mb-6" />
                        <div className="flex gap-3">
                            <div className="h-8 w-20 rounded-full bg-muted/60" />
                            <div className="h-8 w-16 rounded-full bg-muted/40" />
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!project) return null;

    const isOwner = memberId === project.creatorId;
    const tabs: { id: Tab; label: string; show: boolean }[] = [
        { id: "overview", label: "Overview", show: true },
        { id: "media", label: `Media (${(project.screenshots ?? []).length})`, show: (project.screenshots ?? []).length > 0 },
        { id: "scale", label: "Scale", show: project.stage === "x" && !!project.metrics },
    ].filter((t) => t.show);

    return (
        <>
            <Navbar variant="pages" />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container-wide max-w-4xl">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                        <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                        <span className="text-foreground truncate max-w-[200px]">{project.title}</span>
                    </nav>

                    {/* Cover image */}
                    {project.coverImageUrl && (
                        <div className="rounded-xl overflow-hidden mb-6 border bg-muted/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={project.coverImageUrl}
                                alt={`${project.title} cover`}
                                className="w-full object-cover max-h-72"
                            />
                        </div>
                    )}

                    {/* Hero */}
                    <div className="mb-8">
                        {/* Stage + visibility + unpublished banner */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <StageBadge stage={project.stage} />
                            {isOwner && <VisibilityBadge visibility={project.visibility} />}
                            {isOwner && project.stage !== "zero" && !project.published && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                    Draft — not visible publicly
                                </span>
                            )}
                            {project.stage === "zero" && isOwner && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <Lock className="h-3 w-3" aria-hidden /> Private idea workspace
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-semibold mb-3">{project.title}</h1>
                        {project.tagline && (
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                {project.tagline}
                            </p>
                        )}

                        {/* Primary actions */}
                        <div className="flex flex-wrap gap-3">
                            {project.productUrl && (
                                <Button asChild>
                                    <a href={project.productUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                                        <Globe className="h-4 w-4" aria-hidden />
                                        Visit live demo
                                    </a>
                                </Button>
                            )}
                            {project.demoVideoUrl && (
                                <Button variant="outline" asChild>
                                    <a href={project.demoVideoUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                                        <Play className="h-4 w-4" aria-hidden />
                                        Watch demo
                                    </a>
                                </Button>
                            )}
                            {project.githubUrl && (
                                <Button variant="outline" asChild>
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                                        <Github className="h-4 w-4" aria-hidden />
                                        Repo
                                    </a>
                                </Button>
                            )}
                            {isOwner && (
                                <Button variant="outline" asChild>
                                    <Link href={`/me/projects/${project.id}/edit`} className="gap-2">
                                        <Edit className="h-4 w-4" aria-hidden />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Social proof row */}
                    <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b">
                        <button
                            onClick={handleUpvote}
                            disabled={!memberId}
                            className={cn(
                                "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                                upvoted
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border hover:border-foreground/40",
                                !memberId && "opacity-50 cursor-not-allowed"
                            )}
                            title={!memberId ? "Sign in to upvote" : upvoted ? "Remove upvote" : "Upvote"}
                            aria-pressed={upvoted}
                        >
                            <ArrowUp className="h-4 w-4" aria-hidden />
                            {upvoteCount > 0 ? upvoteCount : "Upvote"}
                        </button>

                        <a
                            href="#comments"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <MessageSquare className="h-4 w-4" aria-hidden />
                            {comments.length > 0 ? `${comments.length} comments` : "No comments yet"}
                        </a>

                        {project.lookingForCollaborators && (
                            <span className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 font-medium">
                                <Users className="h-4 w-4" aria-hidden />
                                Looking for collaborators
                            </span>
                        )}
                    </div>

                    {/* People section */}
                    {(project.creator || (project.collaborators && project.collaborators.length > 0) || (project.mentors && project.mentors.length > 0)) && (
                        <div className="grid sm:grid-cols-3 gap-6 mb-8 pb-8 border-b">
                            {project.creator && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                        Built by
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                                            {project.creator.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium">{project.creator.fullName}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{project.creator.memberType}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {project.collaborators && project.collaborators.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                        Team
                                    </p>
                                    <PeopleStack
                                        people={project.collaborators.map((c) => ({ id: c.id, fullName: c.fullName, avatarUrl: c.avatarUrl }))}
                                        max={5}
                                        label={project.collaborators.map((c) => c.fullName).join(", ")}
                                    />
                                </div>
                            )}

                            {project.mentors && project.mentors.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                        Mentored by
                                    </p>
                                    <div className="flex flex-col gap-1.5">
                                        {project.mentors.map((m) => (
                                            <Link
                                                key={m.id}
                                                href={`/mentors`}
                                                className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
                                            >
                                                <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                                                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                </span>
                                                <span>{m.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stage Zero prompt for owner */}
                    {isOwner && project.stage === "zero" && (
                        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                            <div>
                                <h3 className="font-medium mb-1">Ready to build this for real?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Promote to MVP (One) to publish and share your work with the world.
                                </p>
                            </div>
                            <Button asChild className="shrink-0">
                                <Link href={`/me/projects/${project.id}/edit`}>
                                    Promote to One →
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Tabs */}
                    {tabs.length > 1 && (
                        <div className="flex border-b mb-8 -mx-0 overflow-x-auto" role="tablist">
                            {tabs.map((tab) => (
                                <TabButton
                                    key={tab.id}
                                    label={tab.label}
                                    active={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Tab content */}
                    <div className="mb-12">
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {project.description && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">About</h2>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {project.description}
                                        </p>
                                    </div>
                                )}

                                {project.problemStatement && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Problem</h2>
                                        <p className="text-muted-foreground leading-relaxed">{project.problemStatement}</p>
                                    </div>
                                )}

                                {project.targetAudience && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Who it&apos;s for</h2>
                                        <p className="text-muted-foreground leading-relaxed">{project.targetAudience}</p>
                                    </div>
                                )}

                                {project.techStack && project.techStack.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Built with</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech) => (
                                                <Badge key={tech} variant="secondary" className="font-normal">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.onePager && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Overview</h2>
                                        <div className="prose prose-sm max-w-none text-muted-foreground">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                                {project.onePager}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Inline screenshots if no separate media tab */}
                                {project.screenshots && project.screenshots.length > 0 && tabs.length <= 1 && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3">Screenshots</h2>
                                        <MediaGallery images={project.screenshots} title={project.title} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "media" && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Screenshots</h2>
                                <MediaGallery
                                    images={project.screenshots ?? []}
                                    title={project.title}
                                />
                            </div>
                        )}

                        {activeTab === "scale" && project.metrics && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Metrics</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {project.metrics.users !== undefined && (
                                            <MetricCard label="Users" value={project.metrics.users.toLocaleString()} />
                                        )}
                                        {project.metrics.revenue !== undefined && (
                                            <MetricCard label="Revenue" value={`$${project.metrics.revenue.toLocaleString()}`} />
                                        )}
                                        {project.metrics.growthPercentage !== undefined && (
                                            <MetricCard label="Growth" value={`${project.metrics.growthPercentage}%`} />
                                        )}
                                    </div>
                                </div>

                                {project.testimonials && project.testimonials.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-4">What people say</h2>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {project.testimonials.map((t, i) => (
                                                <blockquote key={i} className="rounded-xl border bg-card p-5">
                                                    <p className="text-sm leading-relaxed mb-3">&ldquo;{t.content}&rdquo;</p>
                                                    <footer className="text-xs text-muted-foreground">
                                                        <strong>{t.author}</strong>
                                                        {t.role && <span className="ml-1">· {t.role}</span>}
                                                    </footer>
                                                </blockquote>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.launchDate && (
                                    <div>
                                        <h2 className="text-lg font-semibold mb-2">Launch date</h2>
                                        <p className="text-muted-foreground">
                                            {new Date(project.launchDate).toLocaleDateString("en-US", {
                                                year: "numeric", month: "long", day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Comments */}
                    <section id="comments" className="border-t pt-8">
                        <h2 className="text-lg font-semibold mb-6">
                            {comments.length > 0 ? `${comments.length} Comments` : "Comments"}
                        </h2>

                        {/* Comment form */}
                        {memberId ? (
                            <form onSubmit={handleCommentSubmit} className="mb-8">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share feedback or a question…"
                                    rows={3}
                                    className={cn(
                                        "w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none",
                                        "placeholder:text-muted-foreground",
                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                        "mb-2"
                                    )}
                                    aria-label="Write a comment"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={!comment.trim() || submittingComment}
                                    >
                                        {submittingComment ? "Posting…" : "Post comment"}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="mb-8 rounded-lg border border-dashed p-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Sign in as a member to leave a comment.
                                </p>
                            </div>
                        )}

                        {/* Comment list */}
                        <div className="space-y-6">
                            {comments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No comments yet. Be the first.</p>
                            ) : (
                                comments
                                    .filter((c) => !c.parentCommentId)
                                    .map((c) => <CommentItem key={c.id} comment={c} />)
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t mt-24">
                    <div className="container-wide py-8">
                        <div className="hidden md:flex items-center justify-between gap-8">
                            <p className="text-sm text-muted-foreground shrink-0">Built by people who build. For people who want to.</p>
                            <div className="flex items-center gap-4 text-sm">
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
                                <Link href="/mentors" className="text-muted-foreground hover:text-foreground transition-colors">Mentors</Link>
                                <span className="text-border">|</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
