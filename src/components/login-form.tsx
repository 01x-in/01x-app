"use client"

import { useState, useEffect } from "react"
import { useSignIn, useSession, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import O1XLogoStatic from "@/components/o1x-logo-static"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { session } = useSession()
  const { signOut } = useClerk()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [needs2FA, setNeeds2FA] = useState(false)
  const [otpCode, setOtpCode] = useState("")

  // If already signed in, redirect to /app
  useEffect(() => {
    if (session) {
      router.push("/app")
    }
  }, [session, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return

    setError("")
    setLoading(true)

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/app")
      } else if (result.status === "needs_second_factor") {
        // Prepare the email code second factor
        await signIn.prepareSecondFactor({
          strategy: "email_code",
        })
        setNeeds2FA(true)
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code?: string; message: string }[] }
      const errorCode = clerkError.errors?.[0]?.code

      // Handle "session already exists" — sign out stale session and retry
      if (errorCode === "session_exists") {
        await signOut()
        // Retry the sign-in after clearing the stale session
        try {
          const retryResult = await signIn.create({
            identifier: email,
            password,
          })
          if (retryResult.status === "complete") {
            await setActive({ session: retryResult.createdSessionId })
            router.push("/app")
            return
          }
        } catch (retryErr: unknown) {
          const retryError = retryErr as { errors?: { message: string }[] }
          setError(retryError.errors?.[0]?.message || "Login failed, please try again")
        }
      } else {
        setError(
          clerkError.errors?.[0]?.message || "Invalid email or password"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !otpCode) return

    setError("")
    setLoading(true)

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: otpCode,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/app")
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] }
      setError(
        clerkError.errors?.[0]?.message || "Invalid verification code"
      )
    } finally {
      setLoading(false)
    }
  }

  // 2FA verification step
  if (needs2FA) {
    return (
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleVerify}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-3 text-center">
            <O1XLogoStatic height={48} color="var(--brand)" />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-muted-foreground text-sm text-balance">
                We sent a verification code to {email}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </Field>
          <Field>
            <Button type="submit" disabled={loading || otpCode.length < 6}>
              {loading ? "Verifying…" : "Verify & Login"}
            </Button>
          </Field>
          <Field>
            <Button
              variant="ghost"
              type="button"
              className="text-sm"
              onClick={() => {
                setNeeds2FA(false)
                setOtpCode("")
                setError("")
              }}
            >
              ← Back to login
            </Button>
          </Field>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-3 text-center">
          <O1XLogoStatic height={48} color="var(--brand)" />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Login to your account</h1>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Want to join?{" "}
            <a href="/apply" className="underline underline-offset-4">
              Apply to Cohort
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
