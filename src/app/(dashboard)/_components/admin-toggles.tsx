"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// ---------------------------------------------------------------------------
// AdminToggle — toggle-group for boolean fields (Active/Inactive, etc.)
// ---------------------------------------------------------------------------
export function AdminToggle({
    entityType,
    entityId,
    field,
    currentValue,
    trueLabel,
    falseLabel,
}: {
    entityType: "members" | "mentors"
    entityId: string
    field: string
    currentValue: boolean | number
    trueLabel: string
    falseLabel: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [optimistic, setOptimistic] = useState(!!currentValue)

    async function handleChange(val: string) {
        if (!val) return
        const newValue = val === "true"
        if (newValue === optimistic) return
        setOptimistic(newValue)

        try {
            const res = await fetch(`/api/v1/${entityType}/${entityId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: newValue }),
            })
            if (!res.ok) {
                setOptimistic(!newValue)
                return
            }
            startTransition(() => {
                router.refresh()
            })
        } catch {
            setOptimistic(!newValue)
        }
    }

    return (
        <ToggleGroup
            type="single"
            value={optimistic ? "true" : "false"}
            onValueChange={handleChange}
            variant="outline"
            size="sm"
            className={isPending ? "opacity-50 pointer-events-none" : ""}
        >
            <ToggleGroupItem value="true" aria-label={trueLabel}>
                {trueLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="false" aria-label={falseLabel}>
                {falseLabel}
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

// ---------------------------------------------------------------------------
// AdminSelect — dropdown for enum fields (stage, visibility)
// ---------------------------------------------------------------------------
export function AdminSelect({
    entityId,
    apiPath,
    field,
    currentValue,
    options,
    label,
}: {
    entityId: string
    apiPath: string
    field: string
    currentValue: string
    options: { value: string; label: string }[]
    label: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [optimistic, setOptimistic] = useState(currentValue)

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newValue = e.target.value
        const oldValue = optimistic
        if (newValue === oldValue) return
        setOptimistic(newValue)

        try {
            const res = await fetch(`/api/v1/${apiPath}/${entityId}/admin`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: newValue }),
            })
            if (!res.ok) {
                setOptimistic(oldValue)
                return
            }
            startTransition(() => {
                router.refresh()
            })
        } catch {
            setOptimistic(oldValue)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {label && <label className="text-xs text-muted-foreground font-medium">{label}</label>}
            <select
                value={optimistic}
                onChange={handleChange}
                disabled={isPending}
                className="h-7 rounded-md border bg-background px-2 text-xs outline-none ring-ring focus-visible:ring-2 cursor-pointer disabled:opacity-50"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

// ---------------------------------------------------------------------------
// AdminProjectToggle — toggle-group for project boolean fields
// ---------------------------------------------------------------------------
export function AdminProjectToggle({
    entityId,
    field,
    currentValue,
    trueLabel,
    falseLabel,
}: {
    entityId: string
    field: string
    currentValue: boolean | number
    trueLabel: string
    falseLabel: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [optimistic, setOptimistic] = useState(!!currentValue)

    async function handleChange(val: string) {
        if (!val) return
        const newValue = val === "true"
        if (newValue === optimistic) return
        setOptimistic(newValue)

        try {
            const res = await fetch(`/api/v1/projects/${entityId}/admin`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: newValue }),
            })
            if (!res.ok) {
                setOptimistic(!newValue)
                return
            }
            startTransition(() => {
                router.refresh()
            })
        } catch {
            setOptimistic(!newValue)
        }
    }

    return (
        <ToggleGroup
            type="single"
            value={optimistic ? "true" : "false"}
            onValueChange={handleChange}
            variant="outline"
            size="sm"
            className={isPending ? "opacity-50 pointer-events-none" : ""}
        >
            <ToggleGroupItem value="true" aria-label={trueLabel}>
                {trueLabel}
            </ToggleGroupItem>
            <ToggleGroupItem value="false" aria-label={falseLabel}>
                {falseLabel}
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

// ---------------------------------------------------------------------------
// AdminEnumToggle — toggle-group for enum fields (stage, visibility)
// ---------------------------------------------------------------------------
export function AdminEnumToggle({
    entityId,
    apiPath,
    field,
    currentValue,
    options,
}: {
    entityId: string
    apiPath: string
    field: string
    currentValue: string
    options: { value: string; label: string }[]
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [optimistic, setOptimistic] = useState(currentValue)

    async function handleChange(val: string) {
        if (!val || val === optimistic) return
        const oldValue = optimistic
        setOptimistic(val)

        try {
            const res = await fetch(`/api/v1/${apiPath}/${entityId}/admin`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: val }),
            })
            if (!res.ok) {
                setOptimistic(oldValue)
                return
            }
            startTransition(() => {
                router.refresh()
            })
        } catch {
            setOptimistic(oldValue)
        }
    }

    return (
        <ToggleGroup
            type="single"
            value={optimistic}
            onValueChange={handleChange}
            variant="outline"
            size="sm"
            className={isPending ? "opacity-50 pointer-events-none" : ""}
        >
            {options.map((opt) => (
                <ToggleGroupItem key={opt.value} value={opt.value} aria-label={opt.label}>
                    {opt.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}
