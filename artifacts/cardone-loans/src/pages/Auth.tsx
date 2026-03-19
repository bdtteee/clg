import { useState } from "react"
import { useLocation, Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLogin, useRegister, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Building2, ArrowRight, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Globe, Clock } from "lucide-react"

const brandFeatures = [
  { icon: ShieldCheck, text: "256-bit SSL encryption, always" },
  { icon: Globe, text: "U.S.-accredited funding network" },
  { icon: Clock, text: "Decisions in 2–3 business days" },
  { icon: CheckCircle2, text: "No collateral required" },
]

function AuthShell({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className={`min-h-screen flex ${reverse ? "flex-row-reverse" : "flex-row"}`}>
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
            <h2 className="text-4xl font-display font-bold text-white mb-3 leading-tight">
              Access global capital from Kenya
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Personal and business funding from $2,000 to $100,000 through our U.S. partner network.
            </p>
          </div>

          <ul className="space-y-4">
            {brandFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-accent" />
                </div>
                <span className="text-white/80 text-sm font-medium">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-5 rounded-2xl bg-white/8 border border-white/12">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white/70 text-sm italic leading-relaxed">
            "The process was transparent and professional. Got approval in 2 days and funding exactly as promised."
          </p>
          <p className="text-white/50 text-xs mt-2 font-medium">— Grace M., Business Owner, Nairobi</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-16 bg-background">
        {children}
      </div>
    </div>
  )
}

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [, setLocation] = useLocation()

  const loginMutation = useLogin()
  const queryClient = useQueryClient()

  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } })
  if (user) {
    setLocation(user.role === 'admin' ? '/admin' : '/dashboard')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        setLocation(data.user.role === 'admin' ? '/admin' : '/dashboard')
      },
      onError: (error: any) => {
        setErrorMsg(error?.data?.error || error?.message || "Invalid email or password")
      }
    })
  }

  return (
    <AuthShell>
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
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to access your funding portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Email Address</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Password</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-12 font-bold text-base mt-2" disabled={loginMutation.isPending}>
            {loginMutation.isPending
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
            }
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export function Register() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [, setLocation] = useLocation()

  const registerMutation = useRegister()
  const queryClient = useQueryClient()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    registerMutation.mutate({ data: { fullName, email, password } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        setLocation('/dashboard')
      },
      onError: (error: any) => {
        setErrorMsg(error?.data?.error || error?.message || "Registration failed. Please try again.")
      }
    })
  }

  return (
    <AuthShell reverse>
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
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground">Join thousands of Kenyans accessing U.S. capital.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Full Name</label>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="h-11"
            />
          </div>

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

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Password</label>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-12 font-bold text-base mt-2" disabled={registerMutation.isPending}>
            {registerMutation.isPending
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
            }
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center mt-4 text-xs text-muted-foreground/60">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </AuthShell>
  )
}
