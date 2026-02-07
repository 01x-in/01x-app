"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getAllDomains, type DomainTag } from "@/data/mentors";

interface MentorFiltersProps {
    selectedDomains: DomainTag[];
    onDomainsChange: (domains: DomainTag[]) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    resultCount: number;
}

export function MentorFilters({
    selectedDomains,
    onDomainsChange,
    searchQuery,
    onSearchChange,
    resultCount,
}: MentorFiltersProps) {
    const allDomains = getAllDomains();

    const toggleDomain = (domain: DomainTag) => {
        if (selectedDomains.includes(domain)) {
            onDomainsChange(selectedDomains.filter((d) => d !== domain));
        } else {
            onDomainsChange([...selectedDomains, domain]);
        }
    };

    const clearFilters = () => {
        onDomainsChange([]);
        onSearchChange("");
    };

    const hasActiveFilters = selectedDomains.length > 0 || searchQuery.trim() !== "";

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-3 items-center">
                <Input
                    type="search"
                    placeholder="Search mentors by name, title, or expertise..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="max-w-md"
                    aria-label="Search mentors"
                />
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear filters
                    </Button>
                )}
            </div>

            {/* Domain filters */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
                {allDomains.map((domain) => {
                    const isSelected = selectedDomains.includes(domain);
                    return (
                        <button
                            key={domain}
                            onClick={() => toggleDomain(domain)}
                            className={cn(
                                "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                isSelected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-border hover:bg-accent"
                            )}
                            aria-pressed={isSelected}
                        >
                            {domain}
                        </button>
                    );
                })}
            </div>

            {/* Result count */}
            <p className="text-sm text-muted-foreground">
                {resultCount === 0
                    ? "No mentors match your filters"
                    : `Showing ${resultCount} mentor${resultCount !== 1 ? "s" : ""}`}
            </p>
        </div>
    );
}
