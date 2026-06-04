"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCardSkeleton } from "@/components/projects/ProjectCardSkeleton";
import { FilterBar } from "@/components/projects/FilterBar";
import { EmptyState } from "@/components/projects/EmptyState";
import { Boxes, RefreshCw } from "lucide-react";
import type { ProjectWithRelations } from "@/types/projects";
import Footer from "@/components/footer";

type SortOption = "newest" | "most_upvoted";

const PAGE_SIZE = 12;

export default function ProjectsPage() {
    const [allProjects, setAllProjects] = useState<ProjectWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [displayed, setDisplayed] = useState(PAGE_SIZE);

    // Filters
    const [sort, setSort] = useState<SortOption>("newest");
    const [search, setSearch] = useState("");

    const fetchProjects = () => {
        setLoading(true);
        setError(false);

        const params = new URLSearchParams({
            visibility: "public",
            published: "1",
            sortBy: sort === "newest" ? "newest" : "most_upvoted",
            stage: "one,x",
        });

        fetch(`/api/v1/projects?${params}`)
            .then((res) => {
                if (!res.ok) throw new Error("fetch failed");
                return res.json();
            })
            .then((data) => {
                setAllProjects(data.projects ?? []);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    const filtered = useMemo(() => {
        if (!search.trim()) return allProjects;
        const q = search.toLowerCase();
        return allProjects.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.tagline?.toLowerCase().includes(q) ||
                p.techStack?.some((t) => t.toLowerCase().includes(q))
        );
    }, [allProjects, search]);

    const visible = filtered.slice(0, displayed);
    const hasMore = displayed < filtered.length;

    return (
        <>
            <Navbar variant="pages" />
            <main className="min-h-screen flex flex-col bg-background pt-24">
                <div className="container-wide flex-1 pb-16">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-semibold mb-4">Projects</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            Real products built by 01X members. From early MVPs to growing products —
                            these are the things people shipped inside the program.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8">
                        <FilterBar
                            sort={sort}
                            onSortChange={setSort}
                            search={search}
                            onSearchChange={(s) => { setSearch(s); setDisplayed(PAGE_SIZE); }}
                            resultCount={loading ? undefined : filtered.length}
                        />
                    </div>

                    {/* States */}
                    {error && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <p className="text-sm text-muted-foreground">
                                Could not load projects. Please try again.
                            </p>
                            <Button variant="outline" size="sm" onClick={fetchProjects} className="gap-2">
                                <RefreshCw className="h-4 w-4" aria-hidden />
                                Retry
                            </Button>
                        </div>
                    )}

                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ProjectCardSkeleton key={i} variant="standard" />
                            ))}
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <EmptyState
                            icon={<Boxes className="h-7 w-7" />}
                            title={search ? "No projects match your search" : "No published projects yet"}
                            description={
                                search
                                    ? "Try a different search term."
                                    : "Be the first to ship an MVP and get featured here."
                            }
                            action={
                                search
                                    ? { label: "Clear search", onClick: () => setSearch("") }
                                    : { label: "Start a project", href: "/me/projects/new" }
                            }
                        />
                    )}

                    {!loading && !error && visible.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {visible.map((project) => (
                                    <ProjectCard key={project.id} project={project} variant="standard" />
                                ))}
                            </div>

                            {/* Load more */}
                            {hasMore && (
                                <div className="mt-12 flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDisplayed((d) => d + PAGE_SIZE)}
                                    >
                                        Load more projects
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Start a project CTA */}
                    {!loading && !error && (
                        <section className="mt-24 pt-12 border-t">
                            <div className="max-w-xl">
                                <h2 className="text-2xl font-semibold mb-3">Building something?</h2>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    01X members can document their build journey from day one.
                                    Start private, ship when ready, stay on the record forever.
                                </p>
                                <Button asChild>
                                    <Link href="/cohort/apply">Apply for access</Link>
                                </Button>
                            </div>
                        </section>
                    )}
                </div>

                <Footer className="mt-24" />
            </main>
        </>
    );
}
