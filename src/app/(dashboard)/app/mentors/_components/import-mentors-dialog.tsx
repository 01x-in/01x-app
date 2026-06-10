"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ImportRow {
    row: number
    email: string
    status: "created" | "skipped_duplicate" | "invalid" | "failed" | "valid"
    error?: string
    inboxEmail?: string
}

interface ImportResponse {
    error?: string
    dryRun?: boolean
    summary?: {
        total: number
        valid: number
        created: number
        skipped: number
        invalid: number
        failed: number
    }
    rows?: ImportRow[]
}

const STATUS_STYLES: Record<ImportRow["status"], string> = {
    valid: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    created: "bg-green-500/10 text-green-600 dark:text-green-400",
    skipped_duplicate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    invalid: "bg-red-500/10 text-red-600 dark:text-red-400",
    failed: "bg-red-500/10 text-red-600 dark:text-red-400",
}

const STATUS_LABELS: Record<ImportRow["status"], string> = {
    valid: "Valid",
    created: "Created",
    skipped_duplicate: "Skipped (duplicate)",
    invalid: "Invalid",
    failed: "Failed",
}

export function ImportMentorsDialog() {
    const router = useRouter()
    const fileRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
    const [report, setReport] = useState<ImportResponse | null>(null)

    const reset = (): void => {
        setReport(null)
        setBusy(false)
        if (fileRef.current) fileRef.current.value = ""
    }

    const submit = async (dryRun: boolean): Promise<void> => {
        const file = fileRef.current?.files?.[0]
        if (!file) {
            toast.error("Choose a CSV file first")
            return
        }
        setBusy(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("sendWelcomeEmail", String(sendWelcomeEmail))
            formData.append("dryRun", String(dryRun))

            const res = await fetch("/api/v1/mentors/import", {
                method: "POST",
                body: formData,
            })
            const data = await res.json() as ImportResponse
            if (!res.ok) {
                throw new Error(data.error || "Import failed")
            }
            setReport(data)
            if (!dryRun) {
                toast.success(`Created ${data.summary?.created ?? 0} mentor(s)`)
                router.refresh()
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Import failed")
        } finally {
            setBusy(false)
        }
    }

    const validCount = report?.summary?.valid ?? 0
    const finished = report !== null && report.dryRun === false

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next)
                if (!next) reset()
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline">Import CSV</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import mentors from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV with one mentor per row.{" "}
                        {/* Plain <a>: this is a CSV download from an API route, not page navigation */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a
                            href="/api/v1/mentors/import/template"
                            className="text-primary underline underline-offset-4"
                        >
                            Download the template
                        </a>{" "}
                        for the expected columns. Multi-value cells (domains, highlights,
                        mentoring style) are pipe-separated.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".csv,text/csv"
                        disabled={busy || finished}
                        onChange={() => setReport(null)}
                        className="file:bg-muted file:text-foreground w-full cursor-pointer rounded-md border text-sm file:mr-3 file:cursor-pointer file:border-0 file:px-3 file:py-2"
                    />

                    <label className="flex items-center gap-2 text-sm">
                        <Switch
                            checked={sendWelcomeEmail}
                            onCheckedChange={setSendWelcomeEmail}
                            disabled={busy || finished}
                        />
                        Send welcome email to created mentors
                    </label>

                    {report?.summary && (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                {report.summary.total} row(s):{" "}
                                {report.dryRun
                                    ? `${report.summary.valid} valid, ${report.summary.skipped} duplicate, ${report.summary.invalid} invalid`
                                    : `${report.summary.created} created, ${report.summary.skipped} skipped, ${report.summary.invalid} invalid, ${report.summary.failed} failed`}
                            </p>
                            <div className="max-h-64 overflow-y-auto rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Row</th>
                                            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
                                            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                                            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.rows?.map((row) => (
                                            <tr key={row.row} className="border-b last:border-0">
                                                <td className="px-3 py-2 text-muted-foreground">{row.row}</td>
                                                <td className="px-3 py-2">{row.email || "—"}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                                                        {STATUS_LABELS[row.status]}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-xs text-muted-foreground">
                                                    {row.error || row.inboxEmail || ""}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        {finished ? (
                            <Button onClick={() => setOpen(false)}>Done</Button>
                        ) : report?.dryRun ? (
                            <>
                                <Button variant="outline" onClick={reset} disabled={busy}>
                                    Start over
                                </Button>
                                <Button onClick={() => submit(false)} disabled={busy || validCount === 0}>
                                    {busy ? "Creating…" : `Create ${validCount} mentor(s)`}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => submit(true)} disabled={busy}>
                                {busy ? "Validating…" : "Validate"}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
