"use client";

import { cn } from "@/lib/utils";

type Stage = "zero" | "one" | "x";

const stageConfig: Record<Stage, { label: string; tooltip: string; dotClass: string; badgeClass: string }> = {
    zero: {
        label: "Idea",
        tooltip: "Idea stage — private workspace",
        dotClass: "bg-muted-foreground/40",
        badgeClass: "border-border bg-muted/50 text-muted-foreground",
    },
    one: {
        label: "MVP",
        tooltip: "MVP — working product shipped",
        dotClass: "bg-blue-500",
        badgeClass:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
    },
    x: {
        label: "Scale",
        tooltip: "Scale — live product with traction",
        dotClass: "bg-[#d7ff00]",
        badgeClass:
            "border-[#d7ff00]/40 bg-[#d7ff00]/10 text-foreground dark:border-[#d7ff00]/30 dark:bg-[#d7ff00]/5",
    },
};

interface StageBadgeProps {
    stage: Stage;
    className?: string;
    size?: "sm" | "md";
}

export function StageBadge({ stage, className, size = "md" }: StageBadgeProps) {
    const config = stageConfig[stage];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border font-medium w-fit",
                size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
                config.badgeClass,
                className
            )}
            title={config.tooltip}
            aria-label={`Stage: ${config.label} — ${config.tooltip}`}
        >
            <span className={cn("rounded-full shrink-0", size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5", config.dotClass)} />
            {config.label}
        </span>
    );
}
