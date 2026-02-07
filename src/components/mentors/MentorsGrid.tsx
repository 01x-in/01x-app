"use client";

import { useState } from "react";
import { MentorCard } from "./MentorCard";
import { MentorModal } from "./MentorModal";
import type { Mentor } from "@/data/mentors";

interface MentorsGridProps {
    mentors: Mentor[];
}

export function MentorsGrid({ mentors }: MentorsGridProps) {
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    if (mentors.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No mentors match your filters.</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or clearing filters.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor) => (
                    <MentorCard
                        key={mentor.id}
                        mentor={mentor}
                        onClick={() => setSelectedMentor(mentor)}
                    />
                ))}
            </div>

            <MentorModal
                mentor={selectedMentor}
                open={!!selectedMentor}
                onOpenChange={(open) => {
                    if (!open) setSelectedMentor(null);
                }}
            />
        </>
    );
}
