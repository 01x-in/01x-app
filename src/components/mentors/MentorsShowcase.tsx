"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MentorCard } from "./MentorCard";
import { MentorModal } from "./MentorModal";
import type { Mentor } from "@/data/mentors";

export function MentorsShowcase() {
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [featuredMentors, setFeaturedMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/mentors?featured=1")
            .then((res) => res.json())
            .then((data) => {
                setFeaturedMentors(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch featured mentors:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section id="mentors-showcase" className="section-full">
                <div className="w-full max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Mentors</h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
                            Builders who&apos;ve shipped, scaled, and learned the hard way.
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[280px] h-[200px] rounded-lg bg-muted/50 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (featuredMentors.length === 0) return null;

    // Duplicate for seamless infinite scroll
    const duplicatedMentors = [...featuredMentors, ...featuredMentors];

    return (
        <section id="mentors-showcase" className="section-full">
            <div className="w-full max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4">Mentors</h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
                        Builders who&apos;ve shipped, scaled, and learned the hard way.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/mentors">View all mentors</Link>
                    </Button>
                </div>

                {/* Marquee container */}
                <div className="relative overflow-hidden">
                    {/* Gradient fades */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                    {/* Scrolling track */}
                    <div className="group flex">
                        <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
                            {duplicatedMentors.map((mentor, idx) => (
                                <div key={`${mentor.id}-${idx}`} className="shrink-0 w-[280px]">
                                    <MentorCard
                                        mentor={mentor}
                                        compact
                                        onClick={() => setSelectedMentor(mentor)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fallback for reduced motion - just show first set */}
                <div className="hidden motion-reduce:grid motion-reduce:grid-cols-2 motion-reduce:md:grid-cols-3 motion-reduce:lg:grid-cols-4 gap-4 mt-8">
                    {featuredMentors.slice(0, 4).map((mentor) => (
                        <MentorCard
                            key={mentor.id}
                            mentor={mentor}
                            compact
                            onClick={() => setSelectedMentor(mentor)}
                        />
                    ))}
                </div>
            </div>

            <MentorModal
                mentor={selectedMentor}
                open={!!selectedMentor}
                onOpenChange={(open) => {
                    if (!open) setSelectedMentor(null);
                }}
            />
        </section>
    );
}
