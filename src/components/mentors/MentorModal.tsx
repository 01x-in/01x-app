"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Mentor } from "@/data/mentors";
import { ONE_ON_ONE_LABELS } from "@/data/mentors";
import Link from "next/link";

interface MentorModalProps {
    mentor: Mentor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MentorModal({ mentor, open, onOpenChange }: MentorModalProps) {
    if (!mentor) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div
                            className="shrink-0 h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium text-xl overflow-hidden"
                            aria-hidden="true"
                        >
                            {mentor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-2xl">{mentor.name}</DialogTitle>
                            <DialogDescription className="text-base mt-1">{mentor.title}</DialogDescription>

                            {mentor.location && (
                                <p className="text-sm text-muted-foreground mt-1">📍 {mentor.location}</p>
                            )}

                            {/* Domain badges */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {mentor.domains.map((domain) => (
                                    <Badge key={domain} variant="secondary" className="text-xs">
                                        {domain}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Bio */}
                    <div>
                        <p className="text-muted-foreground leading-relaxed">
                            {mentor.bioLong || mentor.bioShort}
                        </p>
                    </div>

                    <Separator />

                    {/* Highlights */}
                    <div>
                        <h4 className="font-semibold mb-3">Highlights</h4>
                        <ul className="space-y-2">
                            {mentor.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                    <span className="text-foreground shrink-0">→</span>
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    {/* Mentoring Style */}
                    <div>
                        <h4 className="font-semibold mb-3">How They Mentor</h4>
                        <ul className="space-y-2">
                            {mentor.mentoringStyle.map((style, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                                    <span className="text-foreground shrink-0">•</span>
                                    {style}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Separator />

                    {/* Availability */}
                    <div>
                        <h4 className="font-semibold mb-3">Availability</h4>
                        <div className="flex flex-wrap gap-3">
                            {mentor.availability.async && (
                                <Badge variant="outline" className="text-sm py-1.5 px-3">
                                    <span className="mr-1.5 text-green-600">✓</span>
                                    Async Feedback
                                </Badge>
                            )}
                            {mentor.availability.weekend && (
                                <Badge variant="outline" className="text-sm py-1.5 px-3">
                                    <span className="mr-1.5 text-green-600">✓</span>
                                    Weekend Sessions
                                </Badge>
                            )}
                            {mentor.availability.oneOnOneFrequency && (
                                <Badge variant="outline" className="text-sm py-1.5 px-3">
                                    <span className="mr-1.5 text-blue-600">📅</span>
                                    {ONE_ON_ONE_LABELS[mentor.availability.oneOnOneFrequency]}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Socials */}
                    {mentor.socials && Object.keys(mentor.socials).length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-3">Connect</h4>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.socials.linkedin && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={mentor.socials.linkedin} target="_blank" rel="noopener noreferrer">
                                                LinkedIn
                                            </a>
                                        </Button>
                                    )}
                                    {mentor.socials.twitter && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={mentor.socials.twitter} target="_blank" rel="noopener noreferrer">
                                                Twitter
                                            </a>
                                        </Button>
                                    )}
                                    {mentor.socials.website && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={mentor.socials.website} target="_blank" rel="noopener noreferrer">
                                                Website
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* CTA */}
                    <div className="pt-2">
                        <Button size="lg" className="w-full" asChild>
                            <Link href="/apply">Apply to Cohort</Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
