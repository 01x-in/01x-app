"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MentorFilters } from "@/components/mentors/MentorFilters";
import { MentorsGrid } from "@/components/mentors/MentorsGrid";
import { filterMentors, type Mentor, type DomainTag } from "@/data/mentors";

export default function MentorsPage() {
    const [selectedDomains, setSelectedDomains] = useState<DomainTag[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allMentors, setAllMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/mentors")
            .then((res) => res.json())
            .then((data) => {
                setAllMentors(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch mentors:", err);
                setLoading(false);
            });
    }, []);

    const filteredMentors = filterMentors(allMentors, selectedDomains, searchQuery);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-16">
                <div className="container-wide">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-semibold mb-4">Meet the Mentors</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            You&apos;re not paying for motivation. You&apos;re paying for experienced feedback from people who&apos;ve built, shipped, and learned the hard way.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8">
                        <MentorFilters
                            selectedDomains={selectedDomains}
                            onDomainsChange={setSelectedDomains}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            resultCount={filteredMentors.length}
                        />
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-[280px] rounded-lg bg-muted/50 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <MentorsGrid mentors={filteredMentors} />
                    )}

                    {/* Become a Mentor Section */}
                    <section className="mt-24 pt-12 border-t">
                        <div className="max-w-xl">
                            <h2 className="text-2xl font-semibold mb-4">Want to mentor builders?</h2>
                            <ul className="space-y-2 text-muted-foreground mb-6">
                                <li className="flex gap-3">
                                    <span className="text-foreground">→</span>
                                    Weekend sessions, async feedback, no daily meetings.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-foreground">→</span>
                                    You pick your intensity.
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-foreground">→</span>
                                    We&apos;ll handle ops; you focus on impact.
                                </li>
                            </ul>
                            <Button asChild>
                                <Link href="/mentor/apply">
                                    Become a Mentor
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t mt-24">
                    <div className="container-wide py-8">
                        {/* Mobile: stacked and centered */}
                        <div className="flex flex-col items-center gap-4 text-center md:hidden">
                            <p className="text-sm text-muted-foreground">
                                Built by people who build. For people who want to.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                                <span className="text-border">|</span>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                                <ThemeToggle />
                            </div>
                        </div>
                        {/* Desktop: horizontal single row */}
                        <div className="hidden md:flex items-center justify-between gap-8">
                            <p className="text-sm text-muted-foreground shrink-0">
                                Built by people who build. For people who want to.
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                                <span className="text-border">|</span>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                                <span className="text-border">|</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
