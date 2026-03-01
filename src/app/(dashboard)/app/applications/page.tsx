"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PageHeader } from "../../_components/page-header"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

type Tab = "cohort" | "mentor"

interface Application {
    id: number
    full_name: string
    email: string
    status: string
    created_at: string
    [key: string]: unknown
}

const PAGE_SIZE = 20

export default function ApplicationsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("cohort")
    const [cohortApps, setCohortApps] = useState<Application[]>([])
    const [mentorApps, setMentorApps] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [page, setPage] = useState(1)

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

    const rawApps = activeTab === "cohort" ? cohortApps : mentorApps

    // Client-side filtering
    const filteredApps = useMemo(() => {
        let apps = rawApps
        if (search) {
            const q = search.toLowerCase()
            apps = apps.filter(
                (a) =>
                    a.full_name.toLowerCase().includes(q) ||
                    a.email.toLowerCase().includes(q)
            )
        }
        if (statusFilter) {
            apps = apps.filter((a) => a.status === statusFilter)
        }
        return apps
    }, [rawApps, search, statusFilter])

    const totalItems = filteredApps.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)
    const currentPage = Math.min(page, Math.max(1, totalPages))
    const paginatedApps = filteredApps.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    // Reset page when filters change
    function handleSearch(val: string) {
        setSearch(val)
        setPage(1)
    }
    function handleStatusFilter(val: string) {
        setStatusFilter(val)
        setPage(1)
    }
    function handleTabChange(tab: Tab) {
        setActiveTab(tab)
        setPage(1)
    }

    const pendingCohort = cohortApps.filter((a) => a.status === "pending").length
    const pendingMentor = mentorApps.filter((a) => a.status === "pending").length

    return (
        <div className="space-y-4">
            <PageHeader
                title="Applications"
                description="Review and manage cohort member and mentor applications"
            />

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
                <button
                    onClick={() => handleTabChange("cohort")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "cohort"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Cohort Applications
                    {pendingCohort > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {pendingCohort}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => handleTabChange("mentor")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === "mentor"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Mentor Applications
                    {pendingMentor > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {pendingMentor}
                        </span>
                    )}
                </button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search applications…"
                        className="h-9 w-full max-w-xs rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus-visible:ring-2 placeholder:text-muted-foreground"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                    className="h-9 rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2 text-muted-foreground cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
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
                            ) : paginatedApps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        {search || statusFilter
                                            ? "No matching applications"
                                            : `No ${activeTab === "cohort" ? "cohort" : "mentor"} applications`}
                                    </td>
                                </tr>
                            ) : (
                                paginatedApps.map((app) => (
                                    <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium">
                                            <Link
                                                href={`/app/applications/${activeTab}/${app.id}`}
                                                className="text-primary underline-offset-4 hover:underline"
                                            >
                                                {app.full_name}
                                            </Link>
                                        </td>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
                    <p className="text-xs text-muted-foreground">
                        Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center justify-center size-8 rounded-md border text-sm disabled:opacity-50 disabled:pointer-events-none hover:bg-muted transition-colors"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`inline-flex items-center justify-center size-8 rounded-md text-sm font-medium transition-colors ${p === currentPage
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="inline-flex items-center justify-center size-8 rounded-md border text-sm disabled:opacity-50 disabled:pointer-events-none hover:bg-muted transition-colors"
                            aria-label="Next page"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
