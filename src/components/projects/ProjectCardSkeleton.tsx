"use client";

import { cn } from "@/lib/utils";

interface ProjectCardSkeletonProps {
    variant?: "compact" | "standard";
    className?: string;
}

export function ProjectCardSkeleton({ variant = "standard", className }: ProjectCardSkeletonProps) {
    if (variant === "compact") {
        return (
            <div
                className={cn(
                    "rounded-xl border bg-card overflow-hidden flex flex-col animate-pulse",
                    className
                )}
                aria-hidden
            >
                {/* Cover image */}
                <div className="h-36 bg-muted/60" />
                <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Title */}
                    <div className="h-4 w-4/5 rounded bg-muted/60" />
                    {/* Tagline */}
                    <div className="h-3 w-3/5 rounded bg-muted/40" />
                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-muted/60" />
                            <div className="h-3 w-16 rounded bg-muted/40" />
                        </div>
                        <div className="h-3 w-8 rounded bg-muted/40" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "rounded-xl border bg-card overflow-hidden flex flex-col animate-pulse",
                className
            )}
            aria-hidden
        >
            {/* Cover image */}
            <div className="h-44 bg-muted/60" />
            <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Title */}
                <div className="h-5 w-4/5 rounded bg-muted/60" />
                {/* Tagline */}
                <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-muted/40" />
                    <div className="h-3.5 w-2/3 rounded bg-muted/40" />
                </div>
                {/* Tech tags */}
                <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-muted/40" />
                    <div className="h-5 w-12 rounded-full bg-muted/40" />
                    <div className="h-5 w-20 rounded-full bg-muted/40" />
                </div>
                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-full bg-muted/60" />
                        <div className="h-3.5 w-20 rounded bg-muted/40" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-3.5 w-8 rounded bg-muted/40" />
                        <div className="h-3.5 w-8 rounded bg-muted/40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
