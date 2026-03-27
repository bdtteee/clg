import { useState } from "react"
import { Link } from "wouter"
import { Building2, ArrowRight, Loader2, AlertCircle, CheckCircle2, KeyRound, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetMe } from "@workspace/api-client-react"

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.18)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--secondary)/0.12)_0%,_transparent_60%)]" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-extrabold text-sm tracking-widest uppercase text-white">Cardone</span>
              <span className="font-display font-semibold text-xs tracking-widest uppercase text-accent">Loans & Grants</span>
            </div>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-display font-bold text-white mb-3 leading-tight">
              Account Security
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Keep your Cardone account secure with a strong, unique password.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Use at least 8 characters",
              "Mix letters, numbers & symbols",
              "Never share your password",
              "Change your password regularly",
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <KeyRound className="h-4 w-4 text-accent" />
                </div>
                <span className="text-white/80 text-sm font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 p-5 rounded-2xl bg-white/8 border border-white/12 text-sm text-white/60">
          Your security is our priority. All passwords are encrypted with bcrypt and never stored in plain text.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-16 bg-background">
        {children}
      </div>
    </div>
  )
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-secondary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-3">Check your email</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          If an account exists for <strong>{email}</strong>, we've sent password reset instructions. Please check your inbox and spam folder.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Didn't get it? Contact us directly at{" "}
          <a href="mailto:info@cardoneloansgrants.org" className="text-primary font-semibold hover:underline">
            info@cardoneloansgrants.org
          </a>
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full h-11">
            Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="lg:hidden flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-extrabold text-xs tracking-widest uppercase text-primary">Cardone</span>
            <span className="font-display font-semibold text-[10px] tracking-widest uppercase text-accent-foreground">Loans & Grants</span>
          </div>
        </Link>
      </div>

      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Reset your password</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Enter the email address associated with your account and we'll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Email Address</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="h-11"
          />
        </div>

        <Button type="submit" className="w-full h-12 font-bold text-base">
          <span className="flex items-center gap-2">Send Reset Instructions <ArrowRight className="h-4 w-4" /></span>
        </Button>
      </form>

      <p className="text-center mt-6 text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match")
      return
    }

    setIsPending(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to change password")
      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setIsPending(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-secondary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-3">Password updated</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Your password has been changed successfully. Use your new password next time you sign in.
        </p>
        <Link href="/dashboard">
          <Button className="w-full h-11 font-bold">
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="lg:hidden flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-extrabold text-xs tracking-widest uppercase text-primary">Cardone</span>
            <span className="font-display font-semibold text-[10px] tracking-widest uppercase text-accent-foreground">Loans & Grants</span>
          </div>
        </Link>
      </div>

      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Change password</h1>
        <p className="text-muted-foreground text-sm">Update your account password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Current Password</label>
          <Input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">New Password</label>
          <Input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
          <Input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="h-11"
          />
        </div>

        <Button type="submit" className="w-full h-12 font-bold text-base mt-2" disabled={isPending}>
          {isPending
            ? <Loader2 className="h-5 w-5 animate-spin" />
            : <span className="flex items-center gap-2">Update Password <ArrowRight className="h-4 w-4" /></span>
          }
        </Button>
      </form>
    </div>
  )
}

export function ResetPassword() {
  const { data: user, isLoading } = useGetMe()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthShell>
      {user ? <ChangePasswordForm /> : <ForgotPasswordForm />}
    </AuthShell>
  )
}
