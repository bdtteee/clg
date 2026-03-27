import { Link } from "wouter"
import { CheckCircle2, Building2, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConfirmEmail() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight text-left">
            <span className="font-display font-extrabold text-sm tracking-widest uppercase text-primary">Cardone</span>
            <span className="font-display font-semibold text-[10px] tracking-widest uppercase text-accent-foreground">Loans & Grants</span>
          </div>
        </Link>

        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-secondary/15 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-secondary" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">
          Email Confirmed!
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          Your email address has been successfully verified. Your account is now active and you can access the full Cardone Loans & Grants portal.
        </p>

        {/* Info card */}
        <div className="bg-muted/50 border border-border rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">What happens next?</p>
              <p className="text-sm text-muted-foreground mt-1">
                Log in to your account to start your loan or grant application. Our team reviews applications within 2–3 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <Button className="w-full sm:w-auto font-bold px-8 h-12">
              Sign In to Portal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/apply">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8">
              Start Application
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{" "}
          <a href="mailto:info@cardoneloansgrants.org" className="text-primary font-semibold hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
