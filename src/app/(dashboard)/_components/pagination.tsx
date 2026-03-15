"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
}: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()

    if (totalPages <= 1) return null

    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, totalItems)

    function goToPage(page: number) {
        const params = new URLSearchParams(searchParams.toString())
        if (page <= 1) {
            params.delete("page")
        } else {
            params.set("page", String(page))
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }

    // Generate page numbers to show
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        pages.push(1)
        if (currentPage > 3) pages.push("ellipsis")
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i)
        }
        if (currentPage < totalPages - 2) pages.push("ellipsis")
        pages.push(totalPages)
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
            <p className="text-xs text-muted-foreground">
                Showing {start}–{end} of {totalItems}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center justify-center size-8 rounded-md border text-sm disabled:opacity-50 disabled:pointer-events-none hover:bg-muted transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="size-4" />
                </button>
                {pages.map((p, i) =>
                    p === "ellipsis" ? (
                        <span key={`e${i}`} className="px-1 text-muted-foreground text-sm">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`inline-flex items-center justify-center size-8 rounded-md text-sm font-medium transition-colors ${p === currentPage
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex items-center justify-center size-8 rounded-md border text-sm disabled:opacity-50 disabled:pointer-events-none hover:bg-muted transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>
        </div>
    )
}
