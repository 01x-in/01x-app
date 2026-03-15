"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { Search } from "lucide-react"

// ---------------------------------------------------------------------------
// SearchInput — debounced search that updates ?q= URL param
// ---------------------------------------------------------------------------
export function SearchInput({
    placeholder = "Search…",
    paramName = "q",
}: {
    placeholder?: string
    paramName?: string
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()
    const [value, setValue] = useState(searchParams.get(paramName) || "")
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    const updateParam = useCallback(
        (val: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (val) {
                params.set(paramName, val)
            } else {
                params.delete(paramName)
            }
            // Reset to page 1 on new search
            params.delete("page")
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
            })
        },
        [router, pathname, searchParams, paramName]
    )

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value
        setValue(val)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => updateParam(val), 300)
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="h-9 w-full max-w-xs rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus-visible:ring-2 placeholder:text-muted-foreground"
            />
        </div>
    )
}

// ---------------------------------------------------------------------------
// FilterSelect — dropdown that updates a URL param
// ---------------------------------------------------------------------------
export function FilterSelect({
    paramName,
    label,
    options,
}: {
    paramName: string
    label: string
    options: { value: string; label: string }[]
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [, startTransition] = useTransition()
    const current = searchParams.get(paramName) || ""

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value) {
            params.set(paramName, e.target.value)
        } else {
            params.delete(paramName)
        }
        params.delete("page")
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }

    return (
        <select
            value={current}
            onChange={handleChange}
            aria-label={label}
            className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2 text-muted-foreground cursor-pointer"
        >
            <option value="">{label}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    )
}

// ---------------------------------------------------------------------------
// ListToolbar — layout wrapper for search + filters
// ---------------------------------------------------------------------------
export function ListToolbar({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {children}
        </div>
    )
}
