"use client";

import { cn } from "@/lib/utils";

interface Person {
    id: string;
    name?: string;
    fullName?: string;
    avatarUrl?: string;
}

interface PeopleStackProps {
    people: Person[];
    /** Show at most this many avatars before +N overflow */
    max?: number;
    size?: "sm" | "md";
    label?: string;
    className?: string;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function Avatar({ person, size }: { person: Person; size: "sm" | "md" }) {
    const name = person.fullName ?? person.name ?? "?";
    const initials = getInitials(name);
    const sizeClass = size === "sm" ? "h-6 w-6 text-[9px]" : "h-8 w-8 text-xs";

    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground font-medium ring-1 ring-border/50 overflow-hidden",
                sizeClass
            )}
            title={name}
            aria-label={name}
        >
            {person.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
                initials
            )}
        </span>
    );
}

export function PeopleStack({ people, max = 4, size = "md", label, className }: PeopleStackProps) {
    if (!people.length) return null;

    const visible = people.slice(0, max);
    const overflow = people.length - max;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex -space-x-1.5">
                {visible.map((person) => (
                    <Avatar key={person.id} person={person} size={size} />
                ))}
                {overflow > 0 && (
                    <span
                        className={cn(
                            "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground font-medium ring-1 ring-border/50",
                            size === "sm" ? "h-6 w-6 text-[9px]" : "h-8 w-8 text-xs"
                        )}
                        aria-label={`${overflow} more`}
                    >
                        +{overflow}
                    </span>
                )}
            </div>
            {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
    );
}
