import { cn } from "@/lib/utils"
import Link from "next/link"

// ---------------------------------------------------------------------------
// DetailSection — groups related fields with a title
// ---------------------------------------------------------------------------
export function DetailSection({
    title,
    children,
    className,
}: {
    title: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <section className={cn("space-y-4", className)}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {title}
            </h2>
            <div className="rounded-xl border bg-card p-5 space-y-4">
                {children}
            </div>
        </section>
    )
}

// ---------------------------------------------------------------------------
// DetailField — label + value pair
// ---------------------------------------------------------------------------
export function DetailField({
    label,
    value,
    href,
    className,
}: {
    label: string
    value: React.ReactNode
    href?: string
    className?: string
}) {
    if (value === null || value === undefined || value === "") return null

    const rendered = href ? (
        <Link
            href={href}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
            {value}
        </Link>
    ) : (
        value
    )

    return (
        <div className={cn("grid grid-cols-[140px_1fr] gap-2 text-sm", className)}>
            <span className="text-muted-foreground font-medium">{label}</span>
            <span>{rendered}</span>
        </div>
    )
}

// ---------------------------------------------------------------------------
// DetailBadges — renders a JSON array as inline badge chips
// ---------------------------------------------------------------------------
export function DetailBadges({
    label,
    json,
    colorClass = "bg-primary/10 text-primary",
}: {
    label: string
    json: string | null | undefined
    colorClass?: string
}) {
    let items: string[] = []
    try {
        items = json ? JSON.parse(json) : []
    } catch {
        /* ignore */
    }
    if (items.length === 0) return null

    return (
        <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span className="text-muted-foreground font-medium">{label}</span>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                    <span
                        key={item}
                        className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            colorClass
                        )}
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// StatusBadge — colored badge for status fields
// ---------------------------------------------------------------------------
export function StatusBadge({
    active,
    trueLabel = "Active",
    falseLabel = "Inactive",
}: {
    active: boolean | number
    trueLabel?: string
    falseLabel?: string
}) {
    const isActive = active === true || active === 1
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                isActive
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
            )}
        >
            {isActive ? trueLabel : falseLabel}
        </span>
    )
}
