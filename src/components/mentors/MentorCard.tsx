"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Mentor } from "@/data/mentors";

interface MentorCardProps {
    mentor: Mentor;
    onClick?: () => void;
    compact?: boolean;
    className?: string;
}

export function MentorCard({ mentor, onClick, compact = false, className }: MentorCardProps) {
    const displayedDomains = mentor.domains.slice(0, 3);

    return (
        <Card
            className={cn(
                "group relative cursor-pointer transition-all duration-200",
                "hover:shadow-md hover:border-foreground/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                compact ? "p-4" : "p-6",
                className
            )}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${mentor.name}'s profile`}
        >
            <div className={cn("flex gap-4", compact ? "items-center" : "flex-col sm:flex-row sm:items-start")}>
                {/* Avatar */}
                <div
                    className={cn(
                        "shrink-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium overflow-hidden",
                        compact ? "h-12 w-12 text-sm" : "h-16 w-16 text-lg"
                    )}
                    aria-hidden="true"
                >
                    {/* Placeholder initials - can be replaced with actual image */}
                    {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={cn("font-semibold truncate", compact ? "text-sm" : "text-base")}>
                        {mentor.name}
                    </h3>
                    <p className={cn("text-muted-foreground truncate", compact ? "text-xs" : "text-sm")}>
                        {mentor.title}
                    </p>

                    {!compact && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{mentor.bioShort}</p>
                    )}

                    {/* Domain badges */}
                    <div className={cn("flex flex-wrap gap-1", compact ? "mt-2" : "mt-3")}>
                        {displayedDomains.map((domain) => (
                            <Badge
                                key={domain}
                                variant="secondary"
                                className={cn("font-normal", compact ? "text-[10px] px-1.5 py-0" : "text-xs")}
                            >
                                {domain}
                            </Badge>
                        ))}
                        {mentor.domains.length > 3 && (
                            <Badge variant="outline" className={cn("font-normal", compact ? "text-[10px] px-1.5 py-0" : "text-xs")}>
                                +{mentor.domains.length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

        </Card>
    );
}
