"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { KNOWN_DOMAINS } from "@/lib/mentor-input"

export function AddMentorForm() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [title, setTitle] = useState("")
    const [domains, setDomains] = useState<string[]>([])
    const [location, setLocation] = useState("")
    const [bioShort, setBioShort] = useState("")
    const [bioLong, setBioLong] = useState("")
    const [highlights, setHighlights] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [twitter, setTwitter] = useState("")
    const [website, setWebsite] = useState("")
    const [imageSrc, setImageSrc] = useState("")
    const [isFeatured, setIsFeatured] = useState(false)
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)

    const toggleDomain = (domain: string): void => {
        setDomains((prev) =>
            prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
        )
    }

    const splitLines = (value: string): string[] =>
        value.split("\n").map((line) => line.trim()).filter(Boolean)

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const res = await fetch("/api/v1/mentors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    email,
                    title,
                    domains,
                    location,
                    bioShort,
                    bioLong,
                    highlights: splitLines(highlights),
                    socials: { linkedin, twitter, website },
                    imageSrc,
                    isFeatured,
                    sendWelcomeEmail,
                }),
            })
            const data = await res.json() as { error?: string; inboxEmail?: string }
            if (!res.ok) {
                throw new Error(data.error || "Failed to create mentor")
            }
            toast.success(`Mentor created — inbox ${data.inboxEmail}`)
            router.push("/app/mentors")
            router.refresh()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create mentor"
            setError(message)
            toast.error(message)
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl">
            <FieldGroup>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="fullName">Full name *</FieldLabel>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Jane Doe"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Email *</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="jane@example.com"
                        />
                    </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Head of Product"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="location">Location</FieldLabel>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Bengaluru, India"
                        />
                    </Field>
                </div>

                <Field>
                    <FieldLabel>Domains</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                        {KNOWN_DOMAINS.map((domain) => (
                            <button
                                key={domain}
                                type="button"
                                onClick={() => toggleDomain(domain)}
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${domains.includes(domain)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                                    }`}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                    <FieldDescription>Defaults to “General” if none selected</FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="bioShort">Short bio</FieldLabel>
                    <Textarea
                        id="bioShort"
                        value={bioShort}
                        onChange={(e) => setBioShort(e.target.value)}
                        rows={2}
                        placeholder="One or two lines shown on the mentor card"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="bioLong">Long bio</FieldLabel>
                    <Textarea
                        id="bioLong"
                        value={bioLong}
                        onChange={(e) => setBioLong(e.target.value)}
                        rows={4}
                        placeholder="Full bio shown on the mentor profile"
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="highlights">Highlights</FieldLabel>
                    <Textarea
                        id="highlights"
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        rows={3}
                        placeholder={"One per line\nScaled app to 10M users\nEx-Acme"}
                    />
                    <FieldDescription>One per line</FieldDescription>
                </Field>

                <div className="grid gap-6 sm:grid-cols-3">
                    <Field>
                        <FieldLabel htmlFor="linkedin">LinkedIn</FieldLabel>
                        <Input
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/…"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="twitter">Twitter / X</FieldLabel>
                        <Input
                            id="twitter"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            placeholder="https://x.com/…"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="website">Website</FieldLabel>
                        <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://…"
                        />
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="imageSrc">Image path</FieldLabel>
                    <Input
                        id="imageSrc"
                        value={imageSrc}
                        onChange={(e) => setImageSrc(e.target.value)}
                        placeholder="/mentors/default.jpg"
                    />
                    <FieldDescription>Defaults to /mentors/default.jpg</FieldDescription>
                </Field>

                <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 text-sm">
                        <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                        Featured mentor
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <Switch checked={sendWelcomeEmail} onCheckedChange={setSendWelcomeEmail} />
                        Send welcome email
                    </label>
                </div>

                {error && <FieldError>{error}</FieldError>}

                <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Creating…" : "Create mentor"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/app/mentors")}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                </div>
            </FieldGroup>
        </form>
    )
}
