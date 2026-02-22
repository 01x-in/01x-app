"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, ChevronUp, CheckCircle, Circle, AlertTriangle,
    Globe, Lock, Users,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StageBadge } from "@/components/projects/StageBadge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { track, events } from "@/lib/analytics";
import type { ProjectWithRelations } from "@/types/projects";

type Section = "basics" | "media" | "links" | "tags" | "people" | "community";

const SECTIONS: { id: Section; label: string }[] = [
    { id: "basics", label: "Basics" },
    { id: "media", label: "Media" },
    { id: "links", label: "Links" },
    { id: "tags", label: "Tags" },
    { id: "people", label: "People" },
    { id: "community", label: "Community" },
];

function SectionNav({ active, onChange }: { active: Section; onChange: (s: Section) => void }) {
    return (
        <nav className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b" aria-label="Edit sections">
            {SECTIONS.map((s) => (
                <button
                    key={s.id}
                    onClick={() => onChange(s.id)}
                    className={cn(
                        "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
                        active === s.id
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                    aria-current={active === s.id ? "page" : undefined}
                >
                    {s.label}
                </button>
            ))}
        </nav>
    );
}

function PromoteChecklist({ project }: { project: ProjectWithRelations }) {
    const checks = [
        { label: "Title", met: !!project.title },
        { label: "Tagline", met: !!project.tagline },
        { label: "Description", met: !!project.description },
        { label: "At least one of: live URL, demo video, or screenshots", met: !!(project.productUrl || project.demoVideoUrl || (project.screenshots?.length ?? 0) > 0) },
    ];
    return (
        <ul className="space-y-2">
            {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-sm">
                    {c.met
                        ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" aria-hidden />
                        : <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden />
                    }
                    <span className={c.met ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </li>
            ))}
        </ul>
    );
}

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
    const [input, setInput] = useState("");

    const add = () => {
        const val = input.trim();
        if (val && !tags.includes(val)) {
            onChange([...tags, val]);
        }
        setInput("");
    };

    const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder={placeholder ?? "Add a tag and press Enter"}
                    aria-label="Add tag"
                />
                <Button type="button" variant="outline" onClick={add} disabled={!input.trim()}>Add</Button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1 cursor-default"
                        >
                            {tag}
                            <button
                                onClick={() => remove(tag)}
                                className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5"
                                aria-label={`Remove ${tag}`}
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [project, setProject] = useState<ProjectWithRelations | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<Section>("basics");
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showUnpublishModal, setShowUnpublishModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Form state (mirrors ProjectUpdate)
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [demoVideoUrl, setDemoVideoUrl] = useState("");
    const [productUrl, setProductUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [screenshots, setScreenshots] = useState<string[]>([]);
    const [techStack, setTechStack] = useState<string[]>([]);
    const [problemStatement, setProblemStatement] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [onePager, setOnePager] = useState("");
    const [collaboratorInput, setCollaboratorInput] = useState("");
    const [requestFeedback, setRequestFeedback] = useState(false);
    const [lookingForCollaborators, setLookingForCollaborators] = useState(false);

    const memberId = typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

    useEffect(() => {
        if (!memberId) { setLoading(false); return; }
        fetch(`/api/v1/projects/${id}?memberId=${memberId}`)
            .then((r) => r.json())
            .then((d) => {
                const p: ProjectWithRelations = d.project;
                setProject(p);
                setTitle(p.title);
                setTagline(p.tagline ?? "");
                setDescription(p.description ?? "");
                setCoverImageUrl(p.coverImageUrl ?? "");
                setDemoVideoUrl(p.demoVideoUrl ?? "");
                setProductUrl(p.productUrl ?? "");
                setGithubUrl(p.githubUrl ?? "");
                setScreenshots(p.screenshots ?? []);
                setTechStack(p.techStack ?? []);
                setProblemStatement(p.problemStatement ?? "");
                setTargetAudience(p.targetAudience ?? "");
                setOnePager(p.onePager ?? "");
                setRequestFeedback(p.requestFeedback);
                setLookingForCollaborators(p.lookingForCollaborators);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id, memberId]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const save = async (extra?: object) => {
        setSaving(true);
        const body = {
            title: title.trim(),
            tagline: tagline.trim() || undefined,
            description: description.trim() || undefined,
            coverImageUrl: coverImageUrl.trim() || undefined,
            demoVideoUrl: demoVideoUrl.trim() || undefined,
            productUrl: productUrl.trim() || undefined,
            githubUrl: githubUrl.trim() || undefined,
            screenshots,
            techStack,
            problemStatement: problemStatement.trim() || undefined,
            targetAudience: targetAudience.trim() || undefined,
            onePager: onePager.trim() || undefined,
            requestFeedback,
            lookingForCollaborators,
            ...extra,
        };

        try {
            const res = await fetch(`/api/v1/projects/${id}?memberId=${memberId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            setProject(data.project);
            showSuccess("Saved");
        } finally {
            setSaving(false);
        }
    };

    const promoteToOne = async () => {
        await save({ stage: "one" });
        setShowPromoteModal(false);
        track(events.PROJECT_PROMOTED_TO_ONE, { projectId: id });
        showSuccess("Promoted to Stage One (MVP)! Ready to publish.");
    };

    const promoteToX = async () => {
        await save({ stage: "x" });
        track(events.PROJECT_PROMOTED_TO_X, { projectId: id });
        showSuccess("Promoted to Stage X (Scale)!");
    };

    const publish = async () => {
        await save({ published: true, visibility: "public" });
        setShowPublishModal(false);
        track(events.PROJECT_PUBLISHED, { projectId: id });
        showSuccess("Published! Your project is now public.");
    };

    const unpublish = async () => {
        await save({ published: false });
        setShowUnpublishModal(false);
        track(events.PROJECT_UNPUBLISHED, { projectId: id });
        showSuccess("Unpublished. Project removed from public listings.");
    };

    const canPromoteToOne = project?.stage === "zero";
    const canPromoteToX = project?.stage === "one";
    const canPublish = project?.stage === "one" || project?.stage === "x";

    const promoteChecksMet = !!(
        title.trim() &&
        tagline.trim() &&
        description.trim() &&
        (productUrl.trim() || demoVideoUrl.trim() || screenshots.length > 0)
    );

    if (loading) {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 pb-16">
                    <div className="container-wide max-w-3xl animate-pulse space-y-4">
                        <div className="h-6 w-32 rounded bg-muted/60" />
                        <div className="h-8 w-64 rounded bg-muted/60" />
                        <div className="h-48 rounded-lg bg-muted/40" />
                    </div>
                </main>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar variant="pages" />
                <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Project not found or access denied.</p>
                        <Button asChild variant="outline"><Link href="/me/projects">← My projects</Link></Button>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar variant="pages" />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container-wide max-w-3xl">
                    {/* Back */}
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 mb-8 -ml-2 text-muted-foreground hover:text-foreground">
                        <Link href="/me/projects">
                            <ArrowLeft className="h-4 w-4" aria-hidden />
                            My projects
                        </Link>
                    </Button>

                    {/* Header + stage actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <StageBadge stage={project.stage} />
                                {project.published && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Published</span>
                                )}
                            </div>
                            <h1 className="text-xl md:text-2xl font-semibold line-clamp-2">{project.title}</h1>
                        </div>

                        {/* Stage progression actions */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                            {canPromoteToOne && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPromoteModal(true)}
                                    className="gap-1.5"
                                >
                                    <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                                    Promote to One
                                </Button>
                            )}
                            {canPromoteToX && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={promoteToX}
                                    className="gap-1.5"
                                >
                                    <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                                    Promote to X
                                </Button>
                            )}
                            {canPublish && !project.published && (
                                <Button
                                    size="sm"
                                    onClick={() => setShowPublishModal(true)}
                                    className="gap-1.5"
                                >
                                    <Globe className="h-3.5 w-3.5" aria-hidden />
                                    Publish
                                </Button>
                            )}
                            {project.published && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowUnpublishModal(true)}
                                    className="gap-1.5 text-muted-foreground"
                                >
                                    <Lock className="h-3.5 w-3.5" aria-hidden />
                                    Unpublish
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Success toast */}
                    {successMsg && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 px-4 py-2.5 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden />
                            {successMsg}
                        </div>
                    )}

                    {/* Section nav */}
                    <SectionNav active={activeSection} onChange={setActiveSection} />

                    {/* Sections */}
                    <div className="space-y-6">
                        {activeSection === "basics" && (
                            <>
                                <div className="space-y-1.5">
                                    <label htmlFor="edit-title" className="text-sm font-medium">
                                        Title <span className="text-destructive" aria-label="required">*</span>
                                    </label>
                                    <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-tagline" className="text-sm font-medium">
                                        Tagline
                                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">(1 sentence)</span>
                                    </label>
                                    <Input
                                        id="edit-tagline"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        placeholder="What does it do in one line?"
                                        maxLength={160}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                                    <textarea
                                        id="edit-description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        placeholder="What problem does it solve? Who is it for?"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 dark:bg-input/30"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-problem" className="text-sm font-medium">Problem statement</label>
                                    <textarea
                                        id="edit-problem"
                                        value={problemStatement}
                                        onChange={(e) => setProblemStatement(e.target.value)}
                                        rows={3}
                                        placeholder="What problem are you solving?"
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 dark:bg-input/30"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-audience" className="text-sm font-medium">Target audience</label>
                                    <Input
                                        id="edit-audience"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        placeholder="e.g. early-stage founders, remote teams, developers"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-onepager" className="text-sm font-medium">
                                        One-pager
                                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">(structured overview — markdown supported)</span>
                                    </label>
                                    <textarea
                                        id="edit-onepager"
                                        value={onePager}
                                        onChange={(e) => setOnePager(e.target.value)}
                                        rows={8}
                                        placeholder="A structured overview of your project. What it does, how it works, what's next."
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 dark:bg-input/30 font-mono text-xs leading-relaxed"
                                    />
                                </div>
                            </>
                        )}

                        {activeSection === "media" && (
                            <>
                                <div className="space-y-1.5">
                                    <label htmlFor="edit-cover" className="text-sm font-medium">Cover image URL</label>
                                    <Input
                                        id="edit-cover"
                                        type="url"
                                        value={coverImageUrl}
                                        onChange={(e) => setCoverImageUrl(e.target.value)}
                                        placeholder="https://…"
                                    />
                                    {coverImageUrl && (
                                        <div className="mt-2 rounded-lg overflow-hidden border h-32 bg-muted/20">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Screenshots</label>
                                    <p className="text-xs text-muted-foreground">Add image URLs one at a time.</p>
                                    <TagInput
                                        tags={screenshots}
                                        onChange={setScreenshots}
                                        placeholder="Paste screenshot URL and press Enter"
                                    />
                                </div>
                            </>
                        )}

                        {activeSection === "links" && (
                            <>
                                <div className="space-y-1.5">
                                    <label htmlFor="edit-product-url" className="text-sm font-medium flex items-center gap-1.5">
                                        <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                                        Live product URL
                                    </label>
                                    <Input
                                        id="edit-product-url"
                                        type="url"
                                        value={productUrl}
                                        onChange={(e) => setProductUrl(e.target.value)}
                                        placeholder="https://yourapp.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-demo-url" className="text-sm font-medium">Demo video URL</label>
                                    <Input
                                        id="edit-demo-url"
                                        type="url"
                                        value={demoVideoUrl}
                                        onChange={(e) => setDemoVideoUrl(e.target.value)}
                                        placeholder="https://youtube.com/watch?v=… or Loom link"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="edit-github-url" className="text-sm font-medium">GitHub / repo URL</label>
                                    <Input
                                        id="edit-github-url"
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/…"
                                    />
                                </div>
                            </>
                        )}

                        {activeSection === "tags" && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Tech stack</label>
                                <p className="text-xs text-muted-foreground">
                                    Add technologies you&apos;re using. Helps others discover your project.
                                </p>
                                <TagInput
                                    tags={techStack}
                                    onChange={setTechStack}
                                    placeholder="e.g. Next.js, Supabase, Stripe — press Enter to add"
                                />
                            </div>
                        )}

                        {activeSection === "people" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Collaborators</h3>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Add team members by their member ID. They&apos;ll appear on your project page.
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={collaboratorInput}
                                            onChange={(e) => setCollaboratorInput(e.target.value)}
                                            placeholder="Member ID"
                                            aria-label="Collaborator member ID"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={async () => {
                                                if (!collaboratorInput.trim()) return;
                                                await fetch(`/api/v1/projects/${id}/collaborators`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ memberId: collaboratorInput.trim(), requesterId: memberId }),
                                                });
                                                setCollaboratorInput("");
                                                track(events.PROJECT_COLLABORATOR_ADDED, { projectId: id });
                                                showSuccess("Collaborator added");
                                            }}
                                            disabled={!collaboratorInput.trim()}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    {project.collaborators && project.collaborators.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {project.collaborators.map((c) => (
                                                <div key={c.id} className="flex items-center justify-between rounded-lg border bg-card/50 px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                                                            {c.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                        </span>
                                                        <span className="text-sm">{c.fullName}</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 px-2 text-xs text-muted-foreground"
                                                        onClick={async () => {
                                                            await fetch(`/api/v1/projects/${id}/collaborators?memberId=${c.id}&requesterId=${memberId}`, { method: "DELETE" });
                                                            setProject((p) => p ? { ...p, collaborators: p.collaborators?.filter((col) => col.id !== c.id) } : p);
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-1">Mentors</h3>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Link mentors who are guiding this project. They&apos;ll appear as &quot;Mentored by&quot; on the public page.
                                    </p>
                                    {project.mentors && project.mentors.length > 0 ? (
                                        <div className="space-y-2">
                                            {project.mentors.map((m) => (
                                                <div key={m.id} className="flex items-center justify-between rounded-lg border bg-card/50 px-3 py-2">
                                                    <span className="text-sm">{m.name}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 px-2 text-xs text-muted-foreground"
                                                        onClick={async () => {
                                                            await fetch(`/api/v1/projects/${id}/mentors?mentorId=${m.id}`, { method: "DELETE" });
                                                            setProject((p) => p ? { ...p, mentors: p.mentors?.filter((men) => men.id !== m.id) } : p);
                                                        }}
                                                    >
                                                        Unlink
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No mentors linked yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeSection === "community" && (
                            <div className="space-y-6">
                                <p className="text-sm text-muted-foreground">
                                    Community settings are available for Stage One and X projects only.
                                    {project.stage === "zero" && " Promote your project first."}
                                </p>

                                <label className={cn(
                                    "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                                    lookingForCollaborators ? "border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/20" : "hover:bg-muted/30",
                                    project.stage === "zero" && "opacity-50 pointer-events-none"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={lookingForCollaborators}
                                        onChange={(e) => setLookingForCollaborators(e.target.checked)}
                                        className="mt-0.5"
                                        disabled={project.stage === "zero"}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden />
                                            <span className="text-sm font-medium">Looking for collaborators</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Displays a visible badge on your project card and detail page.
                                        </p>
                                    </div>
                                </label>

                                <label className={cn(
                                    "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                                    requestFeedback ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20" : "hover:bg-muted/30",
                                    project.stage === "zero" && "opacity-50 pointer-events-none"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={requestFeedback}
                                        onChange={(e) => setRequestFeedback(e.target.checked)}
                                        className="mt-0.5"
                                        disabled={project.stage === "zero"}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-medium">Request mentor feedback</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Notifies your associated mentors and cohort mentors that you&apos;re looking for feedback.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Save bar */}
                    <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t">
                        <div />
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                asChild
                            >
                                {project.published
                                    ? <Link href={`/projects/${project.id}`}>Preview →</Link>
                                    : <Link href="/me/projects">Cancel</Link>
                                }
                            </Button>
                            <Button onClick={() => save()} disabled={saving || !title.trim()}>
                                {saving ? "Saving…" : "Save changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Promote to One modal */}
            <Dialog open={showPromoteModal} onOpenChange={setShowPromoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Promote to Stage One (MVP)</DialogTitle>
                        <DialogDescription>
                            A working version exists. Promoting to One makes your project eligible to publish publicly.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground font-medium">Checklist for publishing-readiness:</p>
                        <PromoteChecklist project={{ ...project, title, tagline, description, productUrl, demoVideoUrl, screenshots } as ProjectWithRelations} />

                        {!promoteChecksMet && (
                            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-3 text-sm text-amber-700 dark:text-amber-400">
                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
                                <span>You can still promote, but completing the checklist will make your project stronger when you publish.</span>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPromoteModal(false)}>Cancel</Button>
                        <Button onClick={promoteToOne}>
                            Promote to One →
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Publish modal */}
            <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Publish project</DialogTitle>
                        <DialogDescription>
                            Publishing makes your project visible to everyone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                            <span className="text-foreground mt-0.5">→</span>
                            <span>Your project will appear on the public <strong className="text-foreground">/projects</strong> page.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-foreground mt-0.5">→</span>
                            <span>It becomes eligible for the <strong className="text-foreground">homepage &quot;Built in 01X&quot;</strong> section.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-foreground mt-0.5">→</span>
                            <span>Community members can upvote and comment.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-foreground mt-0.5">→</span>
                            <span>Your profile will link to this project permanently.</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPublishModal(false)}>Not yet</Button>
                        <Button onClick={publish} className="gap-2">
                            <Globe className="h-4 w-4" aria-hidden />
                            Publish now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Unpublish modal */}
            <Dialog open={showUnpublishModal} onOpenChange={setShowUnpublishModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Unpublish project</DialogTitle>
                        <DialogDescription>
                            This will remove your project from public listings and the homepage.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Your project data is preserved. You can republish at any time.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUnpublishModal(false)}>Keep published</Button>
                        <Button variant="destructive" onClick={unpublish} className="gap-2">
                            <Lock className="h-4 w-4" aria-hidden />
                            Unpublish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
