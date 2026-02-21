"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type StageFilter = "all" | "one" | "x";
type SortOption = "newest" | "most_upvoted";

interface FilterBarProps {
    stage: StageFilter;
    onStageChange: (stage: StageFilter) => void;
    sort: SortOption;
    onSortChange: (sort: SortOption) => void;
    search: string;
    onSearchChange: (search: string) => void;
    resultCount?: number;
    className?: string;
}

const stageOptions: { value: StageFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "one", label: "One (MVP)" },
    { value: "x", label: "X (Scale)" },
];

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "most_upvoted", label: "Most upvoted" },
];

export function FilterBar({
    stage,
    onStageChange,
    sort,
    onSortChange,
    search,
    onSearchChange,
    resultCount,
    className,
}: FilterBarProps) {
    const hasActiveFilters = stage !== "all" || search.trim().length > 0;

    const clearFilters = () => {
        onStageChange("all");
        onSearchChange("");
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* Row 1: Stage filter toggles + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Stage toggle group */}
                <div
                    className="flex rounded-lg border bg-muted/30 p-0.5 gap-0.5 w-fit"
                    role="group"
                    aria-label="Filter by stage"
                >
                    {stageOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onStageChange(opt.value)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
                                stage === opt.value
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            aria-pressed={stage === opt.value}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Sort select */}
                <div className="flex items-center gap-2">
                    <label htmlFor="sort-select" className="text-sm text-muted-foreground shrink-0">
                        Sort:
                    </label>
                    <select
                        id="sort-select"
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className={cn(
                            "rounded-md border border-input bg-background px-3 py-1.5 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                            "text-foreground"
                        )}
                        aria-label="Sort projects"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 2: Search + result count + clear */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
                    <Input
                        type="search"
                        placeholder="Search projects…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                        aria-label="Search projects"
                    />
                </div>

                {resultCount !== undefined && (
                    <span className="text-sm text-muted-foreground shrink-0">
                        {resultCount} {resultCount === 1 ? "project" : "projects"}
                    </span>
                )}

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
                        aria-label="Clear all filters"
                    >
                        <X className="h-3.5 w-3.5" aria-hidden />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
