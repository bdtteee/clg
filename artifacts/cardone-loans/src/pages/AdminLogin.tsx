import { useState } from "react"
import { useLocation, Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogin, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Building2, ArrowRight, Loader2, AlertCircle, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [, setLocation] = useLocation()

  const loginMutation = useLogin()
  const queryClient = useQueryClient()

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } })
  if (user) {
    setLocation(user.role === "admin" ? "/admin" : "/dashboard")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
          if (data.user.role !== "admin") {
            setErrorMsg("Access denied. This portal is for administrators only.")
            return
          }
          setLocation("/admin")
        },
        onError: (error: any) => {
          setErrorMsg(error?.data?.error || error?.message || "Invalid credentials")
        },
      }
    )
  }

  return (
    <div className="min-h-screen flex flex-row">
      {/* Brand panel */}
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

        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-4">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className="text-accent text-xs font-semibold uppercase tracking-wider">Restricted Access</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-3 leading-tight">
              Administration Portal
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Authorized personnel only. This portal provides access to application management, payment verification, and user administration.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "Review and process loan & grant applications",
              "Verify M-Pesa payment confirmations",
              "Manage applicant KYC documents",
              "Generate reports and analytics",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                </div>
                <span className="text-white/80 text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-5 rounded-2xl bg-white/8 border border-white/12 flex items-start gap-3">
          <Lock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <p className="text-white/60 text-sm leading-relaxed">
            All admin sessions are encrypted and logged. Unauthorized access attempts are monitored and reported.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-16 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
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

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Administrator Sign In</h1>
            <p className="text-muted-foreground text-sm">Enter your admin credentials to access the management dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Admin Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cardoneloansgrants.com"
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-base mt-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Access Dashboard <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border text-center">
            <p className="text-xs text-muted-foreground">
              Not an admin?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Go to client portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
