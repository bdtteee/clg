import { motion } from "framer-motion"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  CheckCircle2, ArrowRight, User, Briefcase, DollarSign, Clock,
  ShieldCheck, Smartphone, TrendingUp, HelpCircle, ChevronDown, AlertCircle
} from "lucide-react"
import { useState } from "react"

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const personalLoanFeatures = [
  "Loan range: $10,000 – $50,000 USD",
  "Instant 65% pre-qualification on submission",
  "No collateral required",
  "Flexible repayment terms (12–60 months)",
  "Decision in 2–3 business days",
  "Disbursement within 14 days of approval",
  "Valid National ID required",
  "Employment or income proof required",
  "M-Pesa processing fee: KES 2,600 (~$20)",
]

const businessLoanFeatures = [
  "Loan range: $20,000 – $100,000 USD",
  "Instant 65% pre-qualification on submission",
  "Business and personal use accepted",
  "Flexible repayment terms (12–84 months)",
  "Decision in 2–3 business days",
  "Disbursement within 14 days of approval",
  "Business registration + KRA PIN required",
  "Annual revenue statement required",
  "M-Pesa processing fee: KES 6,500 (~$50)",
]

const eligibilityPersonal = [
  "Kenyan citizen or resident, aged 18 or above",
  "Valid National ID or passport",
  "Active M-Pesa mobile number",
  "Verifiable source of income or employment",
  "No minimum credit score required",
  "Open to all counties in Kenya",
]

const eligibilityBusiness = [
  "Registered Kenyan business entity (any type)",
  "Valid KRA PIN certificate",
  "Business registration certificate",
  "Operating for at least 6 months",
  "Active business M-Pesa or bank account",
  "Applicant must be a director or owner",
]

const faqs = [
  { q: "What is the 65% pre-qualification?", a: "Upon submission, our automated system immediately issues a binding pre-qualification at 65% of your requested loan amount. For example, a $30,000 application instantly qualifies for $19,500 pending final underwriting. This is confirmed to you before the M-Pesa fee is requested." },
  { q: "Are there collateral requirements?", a: "No. Our U.S.-based funding partners do not require Kenyan collateral. Applications are assessed based on your submitted information, income, and business details." },
  { q: "When exactly will funds be disbursed?", a: "Funds are disbursed within 14 calendar days of your application being approved. Disbursement is made in USD directly to your nominated bank account or mobile money account." },
  { q: "Can I apply for more than one loan?", a: "Applicants may not have more than one active loan application at a time. Once a prior loan is fully settled, you may reapply for a new facility." },
  { q: "What happens if my application is declined?", a: "In the event of a decline, our team will notify you by email with the reasons. The processing fee is non-refundable as it covers the administrative cost of the review. You may reapply after 90 days with updated information." },
]

export default function Loans() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">USD Loan Products</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
              U.S. Dollar loans for Kenyan ambitions.
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
              Access personal and business loans ranging from $10,000 to $100,000 USD — sourced from our network of 23+ verified American lenders. No collateral. Fast decisions. M-Pesa payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" variant="accent" className="text-primary font-bold h-14 px-10 shadow-2xl shadow-accent/30">
                  Apply for a Loan <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white h-14">
                  Speak to an Advisor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Loan Range", val: "$10K–$100K USD" },
              { label: "Decision Time", val: "2–3 Business Days" },
              { label: "Disbursement", val: "Within 14 Days" },
              { label: "Pre-approval", val: "65% Guaranteed" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-display font-bold text-primary mb-1">{s.val}</p>
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Choose your loan product</h2>
            <p className="text-muted-foreground text-lg">Two tailored loan products designed for every type of Kenyan borrower.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Loan */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
              <Card className="h-full border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                    <User className="h-7 w-7 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Personal Loan</CardTitle>
                  <p className="text-muted-foreground">For individuals with significant personal financial goals — medical, education, property, or any major need.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Amount Range</p>
                      <p className="font-bold text-lg">$10,000 – $50,000</p>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">M-Pesa Fee</p>
                      <p className="font-bold text-lg text-accent-foreground">KES 2,600</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-4">
                    <TrendingUp className="h-4 w-4" /> 65% Pre-approval Included
                  </div>
                  <ul className="space-y-3">
                    {personalLoanFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/register" className="w-full">
                    <Button className="w-full font-bold h-12">Apply for Personal Loan <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Business Loan */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <Card className="h-full border-2 border-primary/30 hover:shadow-xl hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-5 py-1.5 rounded-bl-xl tracking-wide">
                  MOST POPULAR
                </div>
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Business Loan</CardTitle>
                  <p className="text-muted-foreground">For Kenyan businesses ready to expand, invest in equipment, hire, or access working capital for growth.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Amount Range</p>
                      <p className="font-bold text-lg">$20,000 – $100,000</p>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">M-Pesa Fee</p>
                      <p className="font-bold text-lg text-accent-foreground">KES 6,500</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                    <TrendingUp className="h-4 w-4" /> 65% Pre-approval Included
                  </div>
                  <ul className="space-y-3">
                    {businessLoanFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/register" className="w-full">
                    <Button className="w-full font-bold h-12 bg-primary">Apply for Business Loan <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <ShieldCheck className="h-4 w-4" /> Eligibility Criteria
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">Who can apply?</h2>
            <p className="text-muted-foreground text-lg">Our eligibility requirements are designed to be accessible to the broadest possible range of Kenyan applicants.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
              <h3 className="flex items-center gap-2 text-xl font-bold mb-6"><User className="h-5 w-5 text-secondary" /> Personal Loan Eligibility</h3>
              <ul className="space-y-4">
                {eligibilityPersonal.map((e, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-foreground">{e}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <h3 className="flex items-center gap-2 text-xl font-bold mb-6"><Briefcase className="h-5 w-5 text-primary" /> Business Loan Eligibility</h3>
              <ul className="space-y-4">
                {eligibilityBusiness.map((e, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{e}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">How the loan process works</h2>
            <p className="text-white/60 text-lg">Four simple steps from application to funded.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", icon: User, title: "Create Account", desc: "Register with your email and basic details. Free and takes under 2 minutes." },
              { step: "02", icon: DollarSign, title: "Submit Application", desc: "Complete your loan application with personal or business details and your desired amount." },
              { step: "03", icon: Smartphone, title: "Pay Processing Fee", desc: "Send the M-Pesa fee to Paybill 4167853. Your application immediately moves to underwriting." },
              { step: "04", icon: TrendingUp, title: "Receive Funds", desc: "Approval in 2–3 days. Funds disbursed in USD within 14 days directly to your account." },
            ].map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex flex-col items-center justify-center mx-auto mb-5">
                  <s.icon className="h-7 w-7 text-accent mb-1" />
                  <span className="text-xs font-bold text-white/50 tracking-widest">{s.step}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 items-start p-6 rounded-xl border border-border bg-muted/30">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Important Disclaimer:</strong> Cardone Loans & Grants is a financial intermediary, not a direct lender. We facilitate connections between Kenyan applicants and U.S.-based funding partners. All processing fees are non-refundable. Approval is not guaranteed and is subject to partner underwriting criteria. Loan terms, interest rates, and disbursement schedules are determined by the assigned U.S. funding partner.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" /> Loan FAQs
            </div>
            <h2 className="text-3xl font-display font-bold">Common loan questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.05 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left flex items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border hover:border-primary/20 transition-colors"
                >
                  <span className="font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="bg-muted/50 px-5 py-4 rounded-b-xl border-x border-b border-border -mt-1 text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl font-display font-bold mb-4">Ready to access U.S. funding?</h2>
            <p className="text-muted-foreground text-lg mb-8">Register free today. Your 65% pre-qualification is waiting.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="font-bold h-14 px-10">Apply Now — Free <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
