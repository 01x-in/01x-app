"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, LogIn } from "lucide-react";

interface NavbarProps {
    variant?: "default" | "apply" | "pages" | "cohort";
    backHref?: string;
}

function LogoSvg() {
    return (
        <svg viewBox="0 0 220 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" aria-hidden="true">
            <circle cx="50" cy="50" r="30" />
            <rect x="100" y="20" width="20" height="60" rx="6" />
            <g transform="translate(175, 50) scale(1.15)">
                <rect x="-10" y="-30" width="20" height="60" rx="6" transform="rotate(45)" />
                <rect x="-10" y="-30" width="20" height="60" rx="6" transform="rotate(-45)" />
            </g>
        </svg>
    );
}

const linkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";

export default function Navbar({ variant = "default", backHref = "/" }: NavbarProps) {
    const pathname = usePathname();

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        const container = document.querySelector(".scroll-snap-container");
        if (element && container) {
            container.scrollTo({ top: element.offsetTop, behavior: "smooth" });
        }
    };

    const isHome = pathname === "/";
    const isOnCohort = pathname?.startsWith("/cohort");
    const isOnProjects = pathname?.startsWith("/projects");
    const isApply = variant === "apply";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full py-4">
            <div className="container-wide">
                <nav className="flex h-14 items-center justify-between rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 shadow-sm">

                    {/* Logo */}
                    {isHome ? (
                        <button onClick={() => scrollTo("hero")} aria-label="Back to top" className="flex items-center">
                            <span className="text-brand transition-colors"><LogoSvg /></span>
                        </button>
                    ) : (
                        <Link href="/" aria-label="01X home" className="flex items-center">
                            <span className="text-brand transition-colors"><LogoSvg /></span>
                        </Link>
                    )}

                    {/* Nav links */}
                    {!isApply && (
                        <div className="hidden md:flex items-center gap-6">
                            {isHome && (
                                <>
                                    <button onClick={() => scrollTo("cohort")} className={linkClass}>Cohort</button>
                                    <button onClick={() => scrollTo("built-in-01x")} className={linkClass}>Projects</button>
                                </>
                            )}
                            {isOnCohort && (
                                <>
                                    <Link href="/" className={linkClass}>Home</Link>
                                    <Link href="/projects" className={linkClass}>Projects</Link>
                                </>
                            )}
                            {isOnProjects && (
                                <>
                                    <Link href="/" className={linkClass}>Home</Link>
                                    <Link href="/cohort" className={linkClass}>Cohort</Link>
                                </>
                            )}
                            {!isHome && !isOnCohort && !isOnProjects && (
                                <>
                                    <Link href="/" className={linkClass}>Home</Link>
                                    <Link href="/cohort" className={linkClass}>Cohort</Link>
                                    <Link href="/projects" className={linkClass}>Projects</Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* CTA */}
                    {isApply ? (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                            <Link href={backHref}>
                                <ArrowLeft className="h-4 w-4 mr-1.5" />
                                Back
                            </Link>
                        </Button>
                    ) : (
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/login" aria-label="Login" className="text-muted-foreground hover:text-foreground transition-colors">
                                        <LogIn className="h-5 w-5" strokeWidth={2.5} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">Login</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                </nav>
            </div>
        </header>
    );
}
