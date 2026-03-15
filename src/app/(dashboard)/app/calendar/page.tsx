import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "../../_components/page-header"

export default async function CalendarPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    const ismentor = user.role === "mentor"

    return (
        <div className="space-y-6">
            <PageHeader
                title="Calendar"
                description={
                    ismentor
                        ? "Your 1:1s and events you're hosting"
                        : "Cohort calendar with 1:1s, events, and deadlines"
                }
            />

            {/* Calendar placeholder — ready for a real calendar component */}
            <div className="rounded-xl border bg-card p-8">
                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div
                            key={day}
                            className="bg-muted/50 px-3 py-2 text-center text-xs font-medium text-muted-foreground"
                        >
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                        const dayNum = i - 2 // offset for month start
                        const isToday = dayNum === new Date().getDate()
                        const isValidDay = dayNum > 0 && dayNum <= 28

                        return (
                            <div
                                key={i}
                                className={`bg-background px-3 py-3 min-h-[80px] text-sm ${isToday ? "ring-2 ring-primary ring-inset" : ""
                                    } ${!isValidDay ? "bg-muted/20" : ""}`}
                            >
                                {isValidDay && (
                                    <span className={`text-xs ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                        {dayNum}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 space-y-2">
                    <h3 className="text-sm font-medium">Upcoming</h3>
                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                        No upcoming events — this feature is coming soon
                    </div>
                </div>
            </div>
        </div>
    )
}
