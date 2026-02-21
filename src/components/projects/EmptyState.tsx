"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    secondaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

export function EmptyState({ icon, title, description, action, secondaryAction, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
            {icon && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">{description}</p>
            )}
            {(action || secondaryAction) && (
                <div className="flex flex-col sm:flex-row gap-3">
                    {action && (
                        action.href ? (
                            <Button asChild>
                                <Link href={action.href}>{action.label}</Link>
                            </Button>
                        ) : (
                            <Button onClick={action.onClick}>{action.label}</Button>
                        )
                    )}
                    {secondaryAction && (
                        secondaryAction.href ? (
                            <Button variant="outline" asChild>
                                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={secondaryAction.onClick}>
                                {secondaryAction.label}
                            </Button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
