"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { MentorCard } from "./MentorCard";
import { MentorModal } from "./MentorModal";
import type { Mentor } from "@/data/mentors";

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return reduced;
}

interface MentorsShowcaseProps {
    variant?: "featured" | "team";
}

export function MentorsShowcase({ variant = "featured" }: MentorsShowcaseProps) {
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const reducedMotion = useReducedMotion();

    const isTeam = variant === "team";
    const apiUrl = isTeam ? "/api/v1/mentors?team=1" : "/api/v1/mentors?featured=1";

    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                setMentors(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch mentors:", err);
                setLoading(false);
            });
    }, [apiUrl]);

    const heading = isTeam ? "The 01x team." : "Mentors";
    const subheading = isTeam
        ? "Builders who've been shipping with AI from day one. In the cohort, they're your primary mentors."
        : "Builders who've shipped, scaled, and learned the hard way.";

    if (loading) {
        return (
            <section id="mentors-showcase" className="section-full">
                <div className="w-full max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">{heading}</h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
                            {subheading}
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="shrink-0 w-[280px] h-[200px] rounded-lg bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (mentors.length === 0) return null;

    const duplicatedMentors = [...mentors, ...mentors];

    return (
        <section id="mentors-showcase" className="section-full">
            <div className="w-full max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4">{heading}</h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
                        {subheading}
                    </p>
                    {!isTeam && (
                        <Button variant="outline" asChild>
                            <Link href="/mentors">View all mentors</Link>
                        </Button>
                    )}
                </div>

                {/* Team variant: always use carousel (deliberate, no marquee) */}
                {isTeam ? (
                    <div className="px-12">
                        <Carousel
                            opts={{ align: "start", dragFree: true, loop: mentors.length > 3 }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {mentors.map((mentor) => (
                                    <CarouselItem key={mentor.id} className="pl-4 basis-auto">
                                        <MentorCard
                                            mentor={mentor}
                                            compact
                                            onClick={() => setSelectedMentor(mentor)}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {mentors.length > 3 && (
                                <>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </>
                            )}
                        </Carousel>
                    </div>
                ) : reducedMotion ? (
                    /* ── shadcn Carousel — Reduce Motion ON ── */
                    <div className="px-12">
                        <Carousel
                            opts={{ align: "start", dragFree: true, loop: true }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {mentors.map((mentor) => (
                                    <CarouselItem key={mentor.id} className="pl-4 basis-auto">
                                        <MentorCard
                                            mentor={mentor}
                                            compact
                                            onClick={() => setSelectedMentor(mentor)}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                ) : (
                    /* ── Animated marquee — Reduce Motion OFF ── */
                    <div className="relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                        <div className="group flex">
                            <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused]">
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
                )}

                {/* Guest mentor note — team variant only */}
                {isTeam && (
                    <p className="text-sm text-muted-foreground text-center mt-8 max-w-lg mx-auto">
                        The cohort also brings in guest mentors — domain specialists who join
                        during specific phases to contribute targeted expertise.
                    </p>
                )}
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
