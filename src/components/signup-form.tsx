"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import O1XLogoStatic from "@/components/o1x-logo-static"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-3 text-center">
                    <O1XLogoStatic height={48} color="var(--brand)" />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold">Join 01X</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            01X is invite-only. Accounts are created after your
                            application is approved.
                        </p>
                    </div>
                </div>

                <Field>
                    <Button asChild>
                        <Link href="/apply">Apply to a Cohort</Link>
                    </Button>
                </Field>

                <Field>
                    <FieldDescription className="text-center">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4"
                        >
                            Log in
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </div>
    )
}
