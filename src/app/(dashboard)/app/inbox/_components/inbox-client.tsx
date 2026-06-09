"use client"

import { useEffect, useState } from "react"
import { Mail, MailOpen, Paperclip, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

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
    html: string | null
    text: string | null
}

function formatDate(value: string | null): string {
    if (!value) return ""
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString(undefined, {
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

    useEffect(() => {
        let active = true
        fetch("/api/v1/inbox")
            .then((res) => res.json())
            .then((data) => {
                if (!active) return
                if (data.error) throw new Error(data.error)
                setMessages(data.messages ?? [])
            })
            .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load inbox"))
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [])

    async function openMessage(id: string) {
        setDetailLoading(true)
        setSelected(null)
        try {
            const res = await fetch(`/api/v1/inbox/${id}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setSelected(data.message)
            // Reflect read state in the list.
            setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)))
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to open message")
        } finally {
            setDetailLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center rounded-xl border bg-card p-12">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
                <Mail className="mb-3 size-8 text-muted-foreground" />
                <h3 className="font-semibold">No messages yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Mail sent to <span className="font-medium text-foreground">{inboxEmail}</span>{" "}
                    will appear here.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border bg-card">
                <ul className="divide-y">
                    {messages.map((m) => {
                        const unread = m.is_read !== 1
                        return (
                            <li key={m.id}>
                                <button
                                    type="button"
                                    onClick={() => openMessage(m.id)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                                >
                                    {unread ? (
                                        <Mail className="size-4 shrink-0 text-primary" />
                                    ) : (
                                        <MailOpen className="size-4 shrink-0 text-muted-foreground" />
                                    )}
                                    <span className={`w-44 shrink-0 truncate text-sm ${unread ? "font-semibold" : ""}`}>
                                        {m.from_name || m.from_address || "Unknown sender"}
                                    </span>
                                    <span className={`flex-1 truncate text-sm ${unread ? "font-medium" : "text-muted-foreground"}`}>
                                        {m.subject || "(no subject)"}
                                    </span>
                                    {m.has_attachments === 1 && (
                                        <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                                    )}
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {formatDate(m.received_at)}
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <Dialog open={detailLoading || selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-2xl">
                    {detailLoading || !selected ? (
                        <>
                            <DialogTitle className="sr-only">Loading message</DialogTitle>
                            <DialogDescription className="sr-only">Fetching email content</DialogDescription>
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle className="pr-6">{selected.subject || "(no subject)"}</DialogTitle>
                                <DialogDescription asChild>
                                    <div className="space-y-0.5">
                                        <div>
                                            From: {selected.fromName ? `${selected.fromName} ` : ""}
                                            {selected.fromAddress ? `<${selected.fromAddress}>` : ""}
                                        </div>
                                        <div>To: {selected.toAddress}</div>
                                        <div>{formatDate(selected.receivedAt)}</div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            {selected.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2">
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

                            <div className="max-h-[55vh] overflow-auto rounded-md border bg-background">
                                {selected.html ? (
                                    <iframe
                                        title="Email content"
                                        sandbox=""
                                        srcDoc={selected.html}
                                        className="h-[50vh] w-full"
                                    />
                                ) : selected.text ? (
                                    <pre className="whitespace-pre-wrap p-4 text-sm">{selected.text}</pre>
                                ) : (
                                    <p className="p-4 text-sm text-muted-foreground">No content.</p>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
