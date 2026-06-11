"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { Mail, MailOpen, Paperclip, Loader2, Inbox, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const POLL_INTERVAL_MS = 30_000

interface InboxListItem {
    id: string
    from_address: string | null
    from_name: string | null
    to_address: string | null
    subject: string | null
    has_attachments: number
    is_read: number
    received_at: string | null
}

interface InboxMessageDetail {
    id: string
    fromAddress: string | null
    fromName: string | null
    toAddress: string | null
    subject: string | null
    receivedAt: string | null
    hasAttachments: boolean
    attachments: { id: string; filename?: string }[]
    isRead: boolean
    html: string | null
    text: string | null
}

function formatDate(value: string | null): string {
    if (!value) return ""
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / 86_400_000)
    if (days === 0) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function formatFullDate(value: string | null): string {
    if (!value) return ""
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export function InboxClient({ inboxEmail }: { inboxEmail: string }) {
    const [messages, setMessages] = useState<InboxListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<InboxMessageDetail | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [unreadOnly, setUnreadOnly] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const fetchInFlight = useRef(false)

    const fetchMessages = useCallback(async (opts: { silent?: boolean; showErrorToast?: boolean } = {}) => {
        if (fetchInFlight.current) return
        fetchInFlight.current = true
        const showErrorToast = opts.showErrorToast ?? !opts.silent
        if (opts.silent) setRefreshing(true)
        else setLoading(true)
        try {
            const res = await fetch("/api/v1/inbox")
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setMessages(data.messages ?? [])
        } catch (err) {
            if (showErrorToast) toast.error(err instanceof Error ? err.message : "Failed to load inbox")
        } finally {
            if (opts.silent) setRefreshing(false)
            else setLoading(false)
            fetchInFlight.current = false
        }
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    useEffect(() => {
        const interval = setInterval(() => fetchMessages({ silent: true, showErrorToast: false }), POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [fetchMessages])

    const filtered = useMemo(() => {
        return messages.filter((m) => {
            if (unreadOnly && m.is_read === 1) return false
            if (search) {
                const q = search.toLowerCase()
                const inFrom = (m.from_name ?? m.from_address ?? "").toLowerCase().includes(q)
                const inSubject = (m.subject ?? "").toLowerCase().includes(q)
                if (!inFrom && !inSubject) return false
            }
            return true
        })
    }, [messages, search, unreadOnly])

    async function openMessage(id: string) {
        // Optimistically select from list while loading detail
        if (selected?.id === id) return
        setSelected(null)
        setDetailLoading(true)
        try {
            const res = await fetch(`/api/v1/inbox/${id}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setSelected(data.message)
            setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)))
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to open message")
        } finally {
            setDetailLoading(false)
        }
    }

    return (
        <div className="flex h-full flex-1 overflow-hidden bg-card">
            {/* Left panel — message list */}
            <div className="flex w-80 shrink-0 flex-col border-r">
                {/* List header */}
                <div className="flex flex-col gap-3 border-b p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium">Inbox</span>
                        <div className="flex items-center gap-3">
                            <Label className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Unreads</span>
                                <Switch
                                    checked={unreadOnly}
                                    onCheckedChange={setUnreadOnly}
                                    className="shadow-none"
                                />
                            </Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => fetchMessages({ silent: true, showErrorToast: true })}
                                disabled={refreshing || loading}
                                aria-label="Refresh inbox"
                            >
                                <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    </div>
                    <Input
                        placeholder="Type to search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>

                {/* Message list */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Inbox className="mb-2 size-6 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {search || unreadOnly ? "No matching messages" : "No messages yet"}
                            </p>
                            {!search && !unreadOnly && (
                                <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                                    Mail sent to{" "}
                                    <span className="font-medium text-foreground">{inboxEmail}</span>{" "}
                                    will appear here.
                                </p>
                            )}
                        </div>
                    ) : (
                        filtered.map((m) => {
                            const unread = m.is_read !== 1
                            const isActive = selected?.id === m.id
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => openMessage(m.id)}
                                    className={`flex w-full flex-col items-start gap-1.5 border-b p-4 text-left text-sm last:border-b-0 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                                    }`}
                                >
                                    <div className="flex w-full items-center gap-2">
                                        {unread ? (
                                            <Mail className="size-3.5 shrink-0 text-primary" />
                                        ) : (
                                            <MailOpen className="size-3.5 shrink-0 text-muted-foreground" />
                                        )}
                                        <span className={`truncate ${unread ? "font-semibold" : ""}`}>
                                            {m.from_name || m.from_address || "Unknown sender"}
                                        </span>
                                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                            {formatDate(m.received_at)}
                                        </span>
                                    </div>
                                    <span className={`truncate w-full ${unread ? "font-medium" : "text-muted-foreground"}`}>
                                        {m.subject || "(no subject)"}
                                    </span>
                                    {m.has_attachments === 1 && (
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Paperclip className="size-3" /> Attachment
                                        </span>
                                    )}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Right panel — message detail */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {detailLoading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : selected ? (
                    <>
                        {/* Detail header */}
                        <div className="border-b p-6">
                            <h2 className="text-lg font-semibold">{selected.subject || "(no subject)"}</h2>
                            <div className="mt-1.5 space-y-0.5 text-sm text-muted-foreground">
                                <div>
                                    From:{" "}
                                    <span className="text-foreground">
                                        {selected.fromName
                                            ? `${selected.fromName} <${selected.fromAddress}>`
                                            : selected.fromAddress}
                                    </span>
                                </div>
                                <div>
                                    To: <span className="text-foreground">{selected.toAddress}</span>
                                </div>
                                <div>{formatFullDate(selected.receivedAt)}</div>
                            </div>
                            {selected.attachments.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selected.attachments.map((a) => (
                                        <span
                                            key={a.id}
                                            className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs"
                                        >
                                            <Paperclip className="size-3" />
                                            {a.filename || "attachment"}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detail body */}
                        <div className="flex-1 overflow-auto bg-white">
                            {selected.html ? (
                                <iframe
                                    title="Email content"
                                    sandbox=""
                                    srcDoc={selected.html}
                                    className="h-full w-full"
                                />
                            ) : selected.text ? (
                                <pre className="whitespace-pre-wrap p-6 text-sm text-neutral-900">{selected.text}</pre>
                            ) : (
                                <p className="p-6 text-sm text-neutral-500">No content.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                        <Mail className="size-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Select a message to read</p>
                        <p className="text-xs text-muted-foreground">{inboxEmail}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
