import { Building2, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Link } from "wouter"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t-4 border-accent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary shadow-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-[14px] font-extrabold tracking-widest uppercase text-white">Cardone</span>
                <span className="font-display text-[10px] font-semibold tracking-widest uppercase text-accent">Loans & Grants</span>
              </div>
            </Link>
            <p className="text-primary-foreground/65 text-sm leading-relaxed max-w-xs">
              Kenya's premier intermediary connecting individuals and businesses with verified U.S.-based funding providers. Bridging American capital with Kenyan ambition since 2019.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>17325 Castellammare Dr, Pacific Palisades, CA 90272, USA</span>
              </div>
              <a href="tel:+12545289454" className="flex items-center gap-2.5 hover:text-accent transition-colors">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+1 254-528-9454</span>
              </a>
              <a href="mailto:info@cardoneloansgrants.org" className="flex items-center gap-2.5 hover:text-accent transition-colors">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>info@cardoneloansgrants.org</span>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base tracking-wide uppercase text-xs">Products</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Personal Grant ($2K–$10K)", href: "/grants" },
                { label: "Business Grant ($5K–$30K)", href: "/grants" },
                { label: "Personal Loan ($10K–$50K)", href: "/loans" },
                { label: "Business Loan ($20K–$100K)", href: "/loans" },
                { label: "Apply Now", href: "/register" },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base tracking-wide uppercase text-xs">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
                { label: "Client Portal", href: "/login" },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & M-Pesa */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base tracking-wide uppercase text-xs">Legal</h4>
            <ul className="space-y-2.5 mb-8">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-primary-foreground/60 hover:text-accent transition-colors text-sm flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-display font-semibold text-white mb-3 text-base tracking-wide uppercase text-xs">M-Pesa Payment</h4>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-sm">
              <p className="text-white/50 text-xs mb-1.5 uppercase tracking-wider">Paybill Number</p>
              <p className="text-accent font-bold text-xl mb-2">4167853</p>
              <p className="text-white/50 text-xs">Account = Application ID</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 space-y-5">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-sm text-primary-foreground/75 max-w-5xl">
            <strong className="text-accent block mb-1.5 text-base">Important Disclaimer</strong>
            Cardone Loans & Grants acts as a licensed intermediary connecting Kenyan applicants with U.S.-based funding providers. We are not a direct lender or grant-making foundation. All processing fees are non-refundable. Approval is not guaranteed and is subject to partner underwriting. Loan interest rates and repayment terms are set by the assigned U.S. Funding Partner. Funds are disbursed in USD.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-primary-foreground/40 text-sm">
            <p>&copy; {new Date().getFullYear()} Cardone Loans & Grants LLC. All rights reserved.</p>
            <p className="text-xs">cardoneloansgrants.org · Pacific Palisades, CA, USA</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
