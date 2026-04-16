"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track, events } from "@/lib/analytics";

export default function NewProjectPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // In a real app, get from auth
    const memberId = typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

    const validate = () => {
        const e: Record<string, string> = {};
        if (!title.trim()) e.title = "Project title is required";
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        if (!memberId) {
            setErrors({ global: "You must be signed in to create a project." });
            return;
        }

        setSubmitting(true);
        track(events.PROJECT_CREATE_STARTED, { title });

        try {
            const id = crypto.randomUUID();
            const res = await fetch("/api/v1/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    title: title.trim(),
                    tagline: tagline.trim() || undefined,
                    description: description.trim() || undefined,
                    creatorId: memberId,
                    stage: "zero",
                    visibility: "private",
                    published: false,
                }),
            });

            if (!res.ok) throw new Error("Failed to create");
            const data = await res.json();
            track(events.PROJECT_CREATED, { projectId: id });
            router.push(`/me/projects/${data.project.id}/edit`);
        } catch {
            setErrors({ global: "Something went wrong. Please try again." });
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar variant="pages" />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container-narrow">
                    {/* Back */}
                    <Button variant="ghost" size="sm" asChild className="gap-1.5 mb-8 -ml-2 text-muted-foreground hover:text-foreground">
                        <Link href="/me/projects">
                            <ArrowLeft className="h-4 w-4" aria-hidden />
                            My projects
                        </Link>
                    </Button>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2.5 mb-3">
                            <span className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                <Lightbulb className="h-4.5 w-4.5 text-muted-foreground" aria-hidden />
                            </span>
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                New project — Stage Zero
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Start with an idea</h1>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Start simple. A title is enough for now — you can fill in everything else once it&apos;s created.
                            Projects start as private ideas (Stage Zero) and you promote them as they grow.
                        </p>
                    </div>

                    {/* Stage info callout */}
                    <div className="rounded-xl border bg-muted/20 p-4 mb-8 flex gap-3">
                        <span className="text-brand mt-0.5 shrink-0">→</span>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Your project will be created at <strong className="text-foreground">Stage Zero</strong> — private and only visible to you.</p>
                            <p>Promote to <strong className="text-foreground">Stage One (MVP)</strong> once you have something working, then publish to share it publicly.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {errors.global && (
                            <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                {errors.global}
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label htmlFor="title" className="text-sm font-medium">
                                Project title <span className="text-destructive" aria-label="required">*</span>
                            </label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setErrors((er) => ({ ...er, title: "" })); }}
                                placeholder="e.g. AI-powered meeting notes"
                                maxLength={100}
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                                className={cn(errors.title && "border-destructive")}
                                autoFocus
                            />
                            {errors.title && (
                                <p id="title-error" className="text-xs text-destructive" role="alert">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Tagline */}
                        <div className="space-y-1.5">
                            <label htmlFor="tagline" className="text-sm font-medium">
                                Tagline
                                <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional — 1 sentence)</span>
                            </label>
                            <Input
                                id="tagline"
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="e.g. Never write meeting notes manually again"
                                maxLength={160}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                                <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What are you building? What problem does it solve?"
                                rows={4}
                                className={cn(
                                    "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none",
                                    "placeholder:text-muted-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                    "dark:bg-input/30"
                                )}
                                aria-label="Project description"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={submitting || !title.trim()}>
                                {submitting ? "Creating…" : "Create project →"}
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/me/projects">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
