import Link from "next/link"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-xs font-bold">
                            01
                        </div>
                        01X
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignupForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-12">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-3xl font-bold shadow-lg">
                        01X
                    </div>
                    <div className="text-center space-y-2 max-w-sm">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Join the Builder Community
                        </h2>
                        <p className="text-muted-foreground">
                            Create your account to access the 01X dashboard, manage your
                            projects, and connect with mentors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
