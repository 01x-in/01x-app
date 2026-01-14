"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-0.5 rounded-full border p-0.5 bg-muted/50">
                <div className="h-6 w-6" />
                <div className="h-6 w-6" />
                <div className="h-6 w-6" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-0.5 rounded-full border p-0.5 bg-muted/50">
            <Button
                variant={theme === "light" ? "secondary" : "ghost"}
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setTheme("light")}
            >
                <Sun className="h-3 w-3" />
                <span className="sr-only">Light mode</span>
            </Button>
            <Button
                variant={theme === "system" ? "secondary" : "ghost"}
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setTheme("system")}
            >
                <Monitor className="h-3 w-3" />
                <span className="sr-only">System mode</span>
            </Button>
            <Button
                variant={theme === "dark" ? "secondary" : "ghost"}
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setTheme("dark")}
            >
                <Moon className="h-3 w-3" />
                <span className="sr-only">Dark mode</span>
            </Button>
        </div>
    );
}
