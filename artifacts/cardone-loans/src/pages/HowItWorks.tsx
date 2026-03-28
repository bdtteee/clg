import { motion } from "framer-motion"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  User, DollarSign, Smartphone, TrendingUp, CheckCircle2, ArrowRight,
  Clock, ShieldCheck, Globe, Zap, FileText, Handshake, BadgeCheck
} from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const steps = [
  {
    number: "01",
    icon: User,
    title: "Create Your Free Account",
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/30",
    desc: "Register on our platform with your email address, full name, and a secure password. Account creation is completely free and takes under two minutes. Your account becomes your personal application portal — where you track progress, receive notifications, and manage all your applications.",
    details: [
      "Free registration — no credit card required",
      "Secure email verification",
      "Instant access to your client dashboard",
      "Manage unlimited applications over time",
    ],
  },
  {
    number: "02",
    icon: FileText,
    title: "Select Product & Submit Application",
    color: "bg-secondary/10 text-secondary",
    borderColor: "border-secondary/30",
    desc: "Choose from our four products: Personal Grant ($2K–$10K), Business Grant ($5K–$30K), Personal Loan ($10K–$50K), or Business Loan ($20K–$100K). Complete the concise online form with your personal or business details, desired amount, and intended use of funds. Our form is designed specifically for Kenyan applicants — no foreign jargon or unnecessary complexity.",
    details: [
      "Four tailored products to match your situation",
      "Streamlined form — under 5 minutes to complete",
      "For loans: instant 65% pre-qualification letter issued",
      "No complex paperwork or document upload at this stage",
    ],
  },
  {
    number: "03",
    icon: Smartphone,
    title: "Pay the M-Pesa Processing Fee",
    color: "bg-accent/20 text-accent-foreground",
    borderColor: "border-accent/30",
    desc: "Once your application is submitted, you'll receive your unique Account Reference (your Application ID, e.g. APP-1042). Send the processing fee via M-Pesa to Paybill 4167853 using that reference. Our system automatically detects the payment and immediately moves your application into the underwriting queue. This is the only fee associated with your application.",
    details: [
      "M-Pesa Paybill: 4167853",
      "Account Number: Your Application ID (e.g. APP-1042)",
      "Personal Grant: KES 1,300 | Business Grant: KES 2,600",
      "Personal Loan: KES 2,600 | Business Loan: KES 6,500",
      "Fee is non-refundable regardless of outcome",
      "Payment automatically verified — no manual confirmation needed",
    ],
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Underwriting Review by U.S. Partners",
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/30",
    desc: "Your verified application is submitted to our network of 23+ U.S.-based funding partners for underwriting review. Our Kenya operations team coordinates with the partner on your behalf. You receive real-time updates via your dashboard and email notifications at every status change — pending, under review, approved, or declined.",
    details: [
      "Submitted to best-fit U.S. funding partner",
      "2–3 business day decision timeline",
      "Real-time dashboard status updates",
      "Email notification at every milestone",
      "Our team available to answer questions during review",
    ],
  },
  {
    number: "05",
    icon: TrendingUp,
    title: "Approval & USD Disbursement",
    color: "bg-secondary/10 text-secondary",
    borderColor: "border-secondary/30",
    desc: "Upon approval, you'll receive a formal approval notice with your assigned funding partner, approved amount, loan terms (if applicable), and disbursement timeline. Funds are transferred in USD directly to your nominated bank account within 14 calendar days of approval. For loan applicants, your final terms and repayment schedule are communicated at this stage.",
    details: [
      "Formal approval letter from funding partner",
      "Full terms disclosed before disbursement",
      "USD wire to your nominated account",
      "Disbursement within 14 calendar days",
      "Ongoing support for any post-disbursement queries",
    ],
  },
]

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.1)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">The Complete Process</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
              From application to funded — in days.
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Our five-step process is designed to be simple, transparent, and fully digital. No bank visits. No complex paperwork. Just a clear path from Kenya to U.S. capital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline quick overview */}
      <section className="py-12 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { step: "Day 0", action: "Create account & submit application" },
              { step: "Day 0", action: "Pay M-Pesa processing fee" },
              { step: "Day 1–3", action: "Underwriting review by U.S. partner" },
              { step: "Day 3–4", action: "Decision notification" },
              { step: "Day 17", action: "USD funds disbursed" },
            ].map((t, i) => (
              <div key={i} className="relative">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="text-xs font-bold text-primary mb-1">{t.step}</p>
                <p className="text-xs text-muted-foreground">{t.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-28 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-5 gap-8 items-start ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:order-last" : ""}`}>
                  <div className={`w-20 h-20 rounded-3xl ${step.color} flex flex-col items-center justify-center mb-6 border-2 ${step.borderColor}`}>
                    <step.icon className="h-8 w-8 mb-1" />
                    <span className="text-xs font-bold tracking-widest opacity-60">{step.number}</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-4">{step.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                <div className="lg:col-span-3">
                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-8">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Key Details</p>
                      <ul className="space-y-3">
                        {step.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground text-sm">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What happens during underwriting */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Globe className="h-4 w-4" /> Behind the Scenes
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">What happens during underwriting?</h2>
            <p className="text-muted-foreground text-lg">Transparency is a core value at Cardone. Here's exactly what our U.S. partners review.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Application Review", desc: "The U.S. funding partner reviews your application details, stated purpose, and financial profile against their eligibility criteria." },
              { icon: BadgeCheck, title: "Identity Verification", desc: "Basic identity verification is conducted using the information and documents submitted in your application. No in-person visit required." },
              { icon: Handshake, title: "Partner Matching", desc: "Your application is matched with the most appropriate funding partner from our network — based on loan/grant type, amount, and applicant profile." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full border-border hover:shadow-lg transition-all">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Important things to know</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Processing Time", desc: "2–3 business days for a decision. Up to 14 days for disbursement after approval. Total: approximately 17–20 days from application to receipt of funds." },
              { icon: ShieldCheck, title: "Non-Refundable Fees", desc: "Processing fees are non-refundable in all circumstances, including declined applications. The fee covers the cost of the underwriting process regardless of outcome." },
              { icon: DollarSign, title: "USD Disbursement", desc: "All funds are disbursed in U.S. Dollars (USD). Your bank will convert to KES at the prevailing interbank exchange rate." },
              { icon: User, title: "One Active Application", desc: "You may only maintain one active application at a time across all product types. Submitting a second application while one is active is not permitted." },
              { icon: Globe, title: "No Physical Collateral", desc: "We do not require any physical Kenyan assets as collateral. Applications are assessed on your submitted profile and financial information only." },
              { icon: TrendingUp, title: "Intermediary Role", desc: "Cardone is not a direct lender or grant-making body. We are a licensed intermediary. Actual funding decisions are made by our U.S. partner institutions." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }}>
                <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl font-display font-bold mb-4">Ready to begin your application?</h2>
            <p className="text-muted-foreground text-lg mb-8">Creating your account is free and takes under 2 minutes. Your 65% pre-qualification is waiting.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="font-bold h-14 px-10">Start Application — Free <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </Link>
              <Link href="/faq">
                <Button size="lg" variant="outline" className="h-14 px-10">Read the FAQ</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
