"use client";

import { Lock, Users, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Visibility = "private" | "collaborators" | "public";

const visibilityConfig: Record<Visibility, { label: string; icon: React.ElementType; className: string }> = {
    private: {
        label: "Private",
        icon: Lock,
        className: "border-border bg-muted/50 text-muted-foreground",
    },
    collaborators: {
        label: "Shared",
        icon: Users,
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
    },
    public: {
        label: "Public",
        icon: Globe,
        className:
            "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400",
    },
};

interface VisibilityBadgeProps {
    visibility: Visibility;
    className?: string;
    size?: "sm" | "md";
}

export function VisibilityBadge({ visibility, className, size = "md" }: VisibilityBadgeProps) {
    const config = visibilityConfig[visibility];
    const Icon = config.icon;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border font-medium",
                size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
                config.className,
                className
            )}
            aria-label={`Visibility: ${config.label}`}
        >
            <Icon className={cn("shrink-0", size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} aria-hidden />
            {config.label}
        </span>
    );
}
