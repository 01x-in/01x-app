interface PageHeaderProps {
    title?: string
    description?: string
    children?: React.ReactNode
}

export function PageHeader({ description, children }: PageHeaderProps) {
    if (!description && !children) return null

    return (
        <div className="flex items-center justify-between">
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
}
