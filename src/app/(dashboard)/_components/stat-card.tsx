import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    trend?: "up" | "down" | "neutral"
    className?: string
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "rounded-xl border bg-card p-6 shadow-sm transition-colors",
                className
            )}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
            </div>
        </div>
    )
}
