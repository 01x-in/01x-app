"use client"

import { useState } from "react"
import { PageHeader } from "../../_components/page-header"

type Tab = "cohort" | "mentor"

interface Application {
    id: number
    full_name: string
    email: string
    status: string
    created_at: string
    [key: string]: unknown
}

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("cohort")
    const [cohortApps, setCohortApps] = useState<Application[]>([])
    const [mentorApps, setMentorApps] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    // Fetch applications on mount and tab change
    useState(() => {
        fetchApplications()
    })

    async function fetchApplications() {
        setLoading(true)
        try {
            const [cohortRes, mentorRes] = await Promise.all([
                fetch("/api/v1/applications"),
                fetch("/api/v1/applications/mentor"),
            ])
            if (cohortRes.ok) {
                const data = await cohortRes.json()
                setCohortApps(data.applications || [])
            }
            if (mentorRes.ok) {
                const data = await mentorRes.json()
                setMentorApps(data.applications || [])
            }
        } catch (err) {
            console.error("Failed to fetch applications:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleAction(id: number, action: "approve" | "reject", type: Tab) {
        setActionLoading(id)
        try {
            const res = await fetch(`/api/v1/applications/${id}/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            })
            if (res.ok) {
                // Refresh applications
                await fetchApplications()
            } else {
                const data = await res.json()
                alert(data.error || "Action failed")
            }
        } catch (err) {
            console.error("Action failed:", err)
        } finally {
            setActionLoading(null)
        }
    }

    const currentApps = activeTab === "cohort" ? cohortApps : mentorApps

    return (
        <div className="space-y-6">
            <PageHeader
                title="Applications"
                description="Review and manage cohort member and mentor applications"
            />

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
                <button
                    onClick={() => setActiveTab("cohort")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "cohort"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Cohort Applications
                    {cohortApps.filter((a) => a.status === "pending").length > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {cohortApps.filter((a) => a.status === "pending").length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("mentor")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "mentor"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Mentor Applications
                    {mentorApps.filter((a) => a.status === "pending").length > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {mentorApps.filter((a) => a.status === "pending").length}
                        </span>
                    )}
                </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Loading…
                                    </td>
                                </tr>
                            ) : currentApps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No {activeTab === "cohort" ? "cohort" : "mentor"} applications
                                    </td>
                                </tr>
                            ) : (
                                currentApps.map((app) => (
                                    <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">{app.full_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{app.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${app.status === "pending"
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    : app.status === "approved"
                                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {app.status === "pending" && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(app.id, "approve", activeTab)}
                                                        disabled={actionLoading === app.id}
                                                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {actionLoading === app.id ? "…" : "Approve"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(app.id, "reject", activeTab)}
                                                        disabled={actionLoading === app.id}
                                                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        {actionLoading === app.id ? "…" : "Reject"}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
