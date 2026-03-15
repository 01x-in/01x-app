"use client"

import { useState, useEffect, useCallback } from "react"

interface ShowcaseItem {
    id: string
    title: string
    tagline: string | null
    stage: string
    cover_image_url: string | null
    product_url: string | null
    tech_stack: string | null
    creator_name: string | null
}

const STAGE_LABELS: Record<string, string> = {
    zero: "Idea",
    one: "MVP",
    x: "Scale",
}

const STAGE_COLORS: Record<string, string> = {
    zero: "bg-yellow-500/20 text-yellow-400",
    one: "bg-green-500/20 text-green-400",
    x: "bg-blue-500/20 text-blue-400",
}

export function LoginShowcase() {
    const [items, setItems] = useState<ShowcaseItem[]>([])
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        fetch("/api/v1/showcase")
            .then((r) => r.json())
            .then((data) => {
                if (data.items?.length) setItems(data.items)
            })
            .catch(() => { })
    }, [])

    // Auto-advance every 5 seconds
    useEffect(() => {
        if (items.length <= 1) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % items.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [items.length])

    const goTo = useCallback((index: number) => {
        setCurrent(index)
    }, [])

    // Fallback when no showcase items exist
    if (items.length === 0) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold shadow-lg">
                    01X
                </div>
                <div className="text-center space-y-2 max-w-sm">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        From Zero to One to Scale
                    </h2>
                    <p className="text-muted-foreground">
                        A paid builder environment. Join a cohort, explore an idea, use AI
                        to accelerate, and ship an MVP.
                    </p>
                </div>
            </div>
        )
    }

    const item = items[current]
    const techStack = item.tech_stack ? JSON.parse(item.tech_stack) as string[] : []

    return (
        <div className="absolute inset-0 flex flex-col">
            {/* Cover image area */}
            <div className="relative flex-1">
                {item.cover_image_url ? (
                    <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/20" />
                )}
                {/* Gradient overlay at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Text overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                {/* Stage badge */}
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[item.stage] || "bg-muted text-muted-foreground"}`}
                    >
                        {STAGE_LABELS[item.stage] || item.stage}
                    </span>
                    {item.creator_name && (
                        <span className="text-xs text-white/60">
                            by {item.creator_name}
                        </span>
                    )}
                </div>

                {/* Title and tagline */}
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white leading-tight">
                        {item.title}
                    </h3>
                    {item.tagline && (
                        <p className="text-sm text-white/70 line-clamp-2">
                            {item.tagline}
                        </p>
                    )}
                </div>

                {/* Tech stack pills */}
                {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {techStack.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80 backdrop-blur-sm"
                            >
                                {tech}
                            </span>
                        ))}
                        {techStack.length > 4 && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                                +{techStack.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Dot indicators */}
                {items.length > 1 && (
                    <div className="flex items-center gap-2 pt-1">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === current
                                        ? "w-6 bg-white"
                                        : "w-1.5 bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
