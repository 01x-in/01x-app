"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import O1XLogo from "@/components/o1x-logo";
import { ArrowLeft } from "lucide-react";

interface NavbarProps {
    variant?: "default" | "apply";
}

export default function Navbar({ variant = "default" }: NavbarProps) {
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

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full py-4">
            <div className="container-wide">
                <nav className="flex h-14 items-center justify-between rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 shadow-sm">
                    {/* Logo & Brand */}
                    {isApplyPage ? (
                        <Link href="/" className="flex items-center gap-2.5">
                            <O1XLogo size={32} color="#d7ff00" />
                            <span className="font-semibold text-base tracking-tight">01X</span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => scrollTo("hero")}
                            className="flex items-center gap-2.5"
                        >
                            <O1XLogo size={32} color="#d7ff00" />
                            <span className="font-semibold text-base tracking-tight">01X</span>
                        </button>
                    )}

                    {/* Navigation - only show on default variant */}
                    {!isApplyPage && (
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => scrollTo("how-it-works")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => scrollTo("mentorship")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Mentorship
                            </button>
                            <button
                                onClick={() => scrollTo("for-you")}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Is This For You?
                            </button>
                        </div>
                    )}

                    {/* CTA - different based on variant */}
                    {isApplyPage ? (
                        <Button size="sm" variant="outline" className="rounded-full" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-1.5" />
                                Back
                            </Link>
                        </Button>
                    ) : (
                        <Button size="sm" className="rounded-full" asChild>
                            <Link href="/apply">Apply</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
