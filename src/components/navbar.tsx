"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import O1XLogo from "@/components/o1x-logo";

export default function Navbar() {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full py-4">
            <div className="container-wide">
                <nav className="flex h-14 items-center justify-between rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 shadow-sm">
                    {/* Logo & Brand */}
                    <button
                        onClick={() => scrollTo("hero")}
                        className="flex items-center gap-2.5"
                    >
                        <O1XLogo size={32} color="#d7ff00" />
                        <span className="font-semibold text-base tracking-tight">01X</span>
                    </button>

                    {/* Navigation */}
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

                    {/* CTA */}
                    <Button size="sm" className="rounded-full">
                        Apply for Access
                    </Button>
                </nav>
            </div>
        </header>
    );
}
