import Link from "next/link"
import O1XLogo from "@/components/o1x-logo"
import O1XLogoStatic from "@/components/o1x-logo-static"

import { LoginForm } from "@/components/login-form"
import { LoginShowcase } from "@/components/login-showcase"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2.5 font-medium">
            <O1XLogo size={32} color="#d7ff00" />
            <span className="font-semibold text-base tracking-tight">01X</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <LoginShowcase />
      </div>
    </div>
  )
}
