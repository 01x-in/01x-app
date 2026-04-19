import Link from "next/link";
import O1XLogoStatic from "@/components/o1x-logo-static";
import { cn } from "@/lib/utils";

interface FooterProps {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn("border-t", className)}>
            <div className="container-wide py-8">
                {/* Mobile: stacked and centered */}
                <div className="flex flex-col items-center gap-4 text-center md:hidden">
                    <O1XLogoStatic height={20} color="currentColor" className="text-muted-foreground opacity-70" />
                    <p className="text-sm text-muted-foreground">
                        Built by people who build. For people who want to.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-2">
                        <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                        <Link href="mailto:hello@01x.in" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                        <span className="text-border">|</span>
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                        &copy; {currentYear} 01X. All rights reserved.
                    </p>
                </div>

                {/* Desktop: horizontal single row layout */}
                <div className="hidden md:flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-8">
                        {/* Left side: Logo + Tagline */}
                        <div className="flex items-center gap-4 shrink-0">
                            <O1XLogoStatic height={24} color="currentColor" className="text-muted-foreground opacity-80" />
                            <div className="h-4 w-px bg-border"></div>
                            <p className="text-sm text-muted-foreground">
                                Built by people who build. For people who want to.
                            </p>
                        </div>

                        {/* Right side: Links */}
                        <div className="flex items-center gap-4 text-sm">
                            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                            <Link href="mailto:hello@01x.in" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                            <span className="text-border">|</span>
                            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground/60">
                        <p>&copy; {currentYear} 01X. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
