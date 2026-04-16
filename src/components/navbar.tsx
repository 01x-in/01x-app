"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

interface NavbarProps {
    variant?: "default" | "apply" | "pages";
    backHref?: string;
}

export default function Navbar({ variant = "default", backHref = "/" }: NavbarProps) {
    const pathname = usePathname();

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        const container = document.querySelector('.scroll-snap-container');
        if (element && container) {
            container.scrollTo({
                top: element.offsetTop,
                behavior: "smooth"
            });
        }
    };

    const isApplyPage = variant === "apply";
    const isPagesVariant = variant === "pages";

    // Cross-link: flip between /mentors and /projects
    const isOnMentors = pathname?.startsWith("/mentors");
    const crossLink = isOnMentors
        ? { label: "Projects", href: "/projects" }
        : { label: "Mentors", href: "/mentors" };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full py-4">
            <div className="container-wide">
                <nav className="flex h-14 items-center justify-between rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 shadow-sm">
                    {/* Logo & Brand — always links to home */}
                    <Link href="/" className="flex items-center gap-2.5">
                        {/* Inline SVG so currentColor adapts to light/dark mode */}
                        <span
                            aria-label="01X Logo"
                            className="text-brand transition-colors"
                        >
                            <svg
                                viewBox="0 0 220 100"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-auto"
                                aria-hidden="true"
                            >
                                {/* 0 (Circle) */}
                                <circle cx="50" cy="50" r="30" />
                                {/* 1 (Bar) */}
                                <rect x="100" y="20" width="20" height="60" rx="6" />
                                {/* X (Crossed Bars) */}
                                <g transform="translate(175, 50) scale(1.15)">
                                    <rect x="-10" y="-30" width="20" height="60" rx="6" transform="rotate(45)" />
                                    <rect x="-10" y="-30" width="20" height="60" rx="6" transform="rotate(-45)" />
                                </g>
                            </svg>
                        </span>
                    </Link>

                    {/* Navigation — pages variant (/mentors, /projects) */}
                    {isPagesVariant && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href={crossLink.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {crossLink.label}
                            </Link>
                        </div>
                    )}

                    {/* Navigation — default home variant */}
                    {!isApplyPage && !isPagesVariant && (
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => scrollTo("how-it-works")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => scrollTo("mentors-showcase")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Mentors
                            </button>
                            <button
                                onClick={() => scrollTo("built-in-01x")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Projects
                            </button>
                            <button
                                onClick={() => scrollTo("for-you")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Is this for You?
                            </button>
                        </div>
                    )}

                    {/* CTA */}
                    {isApplyPage ? (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                            <Link href={backHref}>
                                <ArrowLeft className="h-4 w-4 mr-1.5" />
                                Back
                            </Link>
                        </Button>
                    ) : (
                        <Button size="sm" className="rounded-full" asChild>
                            <Link href="/apply">Apply to Cohort</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
