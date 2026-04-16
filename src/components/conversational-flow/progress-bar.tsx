"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ReactNode } from "react";

interface ProgressBarProps {
    progress: number;
    accentColor?: string;
    /** Optional slot — typically a restart button */
    actions?: ReactNode;
    className?: string;
}

export function ProgressBar({
    progress,
    accentColor = "var(--primary)",
    actions,
    className,
}: ProgressBarProps) {
    return (
        <div
            className={`fixed top-[calc(1rem+3.5rem+0.5rem)] left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-6 ${className ?? ""}`}
        >
            <div className="flex items-center gap-3">
                {/* Progress track */}
                <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden relative">
                    <div
                        className="absolute inset-0 h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}bb)`,
                            boxShadow:
                                progress > 0
                                    ? `0 0 12px ${accentColor}99, 0 0 4px ${accentColor}cc`
                                    : "none",
                        }}
                    />
                </div>

                {/* Badge + actions */}
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full transition-all duration-300 ${progress > 0 ? "text-muted-foreground" : "text-muted-foreground"
                            }`}
                        style={
                            progress > 0
                                ? {
                                    backgroundColor: `${accentColor}26`,
                                    color: accentColor,
                                }
                                : undefined
                        }
                    >
                        {progress}%
                    </span>
                    {actions}
                </div>
            </div>
        </div>
    );
}

// Convenience restart button to pass as the actions slot
interface RestartButtonProps {
    onClick: () => void;
}
export function RestartButton({ onClick }: RestartButtonProps) {
    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClick}
            className="text-muted-foreground hover:text-foreground h-6 w-6"
            title="Start over"
        >
            <RotateCcw className="h-3.5 w-3.5" />
        </Button>
    );
}
