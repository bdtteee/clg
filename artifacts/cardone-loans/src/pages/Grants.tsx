import { motion } from "framer-motion"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  CheckCircle2, ArrowRight, User, Briefcase, Gift, Clock,
  ShieldCheck, Smartphone, Heart, HelpCircle, ChevronDown, AlertCircle, Star
} from "lucide-react"
import { useState } from "react"

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const personalGrantFeatures = [
  "Grant range: $2,000 – $10,000 USD",
  "No repayment ever required",
  "No collateral requirement",
  "Valid National ID sufficient",
  "Decision in 2–3 business days",
  "Disbursement within 14 days of approval",
  "Open to all individual Kenyan applicants",
  "Use of funds is flexible",
  "M-Pesa processing fee: KES 1,300 (~$10)",
]

const businessGrantFeatures = [
  "Grant range: $5,000 – $30,000 USD",
  "No repayment ever required",
  "Business registration + KRA PIN required",
  "All industry types accepted",
  "Decision in 2–3 business days",
  "Disbursement within 14 days of approval",
  "SME, startup, and established business eligible",
  "Funds can be used for any business purpose",
  "M-Pesa processing fee: KES 2,600 (~$20)",
]

const grantUseCases = [
  { icon: "🏠", title: "Housing & Renovation", desc: "Improve your home, build an extension, or secure better housing for your family." },
  { icon: "📚", title: "Education", desc: "University fees, professional certifications, vocational training — invest in your future." },
  { icon: "🏥", title: "Medical Expenses", desc: "Cover significant medical bills, surgeries, or long-term health treatments." },
  { icon: "🌱", title: "Business Startup", desc: "Launch your entrepreneurial dream with non-repayable capital from U.S. grant foundations." },
  { icon: "⚙️", title: "Equipment & Technology", desc: "Purchase machinery, computers, or tools necessary for your business operations." },
  { icon: "🌍", title: "Agricultural Development", desc: "Invest in farming equipment, irrigation, seeds, and agribusiness infrastructure." },
]

const faqs = [
  { q: "Do I ever need to repay a grant?", a: "Absolutely not. Grants are non-repayable funding. Once disbursed, there is no repayment schedule, no interest, and no obligation to return the funds. This is the fundamental difference between a grant and a loan." },
  { q: "How are grants funded?", a: "Our U.S.-based grant foundation partners allocate grant pools specifically for cross-border development and entrepreneurship in Sub-Saharan Africa, with a dedicated allocation for Kenyan applicants. Cardone facilitates the application and disbursement process." },
  { q: "Can I apply for both a loan and a grant simultaneously?", a: "No. You may only have one active application at a time. Please choose the product most appropriate for your situation." },
  { q: "Is there any restriction on how I use the grant funds?", a: "Grant funds can be used for any lawful purpose. We do not restrict use to specific categories, though we do ask you to describe your intended use in the application for our records." },
  { q: "Can businesses apply for personal grants?", a: "No. Personal grants are for individual Kenyan applicants. Registered businesses must apply for the Business Grant product. Applications misrepresenting this will be declined." },
]

export default function Grants() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--secondary)/0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-6">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Non-Repayable Grant Funding</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
              Free money. Real impact. <br />
              <span className="text-secondary">For every Kenyan.</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed mb-4 max-w-2xl">
              Our grant programs connect Kenyan individuals and businesses with U.S.-based grant foundations providing <strong className="text-white">$2,000 to $30,000 USD</strong> — funds you never have to repay.
            </p>
            <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-secondary/10 border border-secondary/20 w-fit">
              <Star className="h-5 w-5 text-secondary shrink-0" />
              <span className="text-white/80 text-sm"><strong className="text-white">100% Non-Repayable</strong> — This is not a loan. You keep every dollar disbursed.</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold h-14 px-10 shadow-2xl shadow-secondary/30">
                  Apply for a Grant <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white h-14">
                  Ask a Question
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is a grant */}
      <section className="py-16 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Gift, label: "No Repayment", desc: "Grants are free money — you never repay the principal or any interest.", color: "text-secondary" },
              { icon: ShieldCheck, label: "Verified Partners", desc: "Sourced from 23+ accredited U.S. grant foundations with dedicated African programs.", color: "text-primary" },
              { icon: Clock, label: "Fast Disbursement", desc: "2–3 business day decisions. Funds transferred within 14 days of approval.", color: "text-accent-foreground" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <p className="font-bold text-lg">{item.label}</p>
                <p className="text-muted-foreground text-sm max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grant Products */}
      <section className="py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Grant products at a glance</h2>
            <p className="text-muted-foreground text-lg">Two dedicated grant products for individuals and businesses across Kenya.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Grant */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }}>
              <Card className="h-full border-secondary/30 border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                    <User className="h-7 w-7 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Personal Grant</CardTitle>
                  <p className="text-muted-foreground">For individual Kenyans seeking non-repayable funding for personal, educational, medical, or development purposes.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Grant Range</p>
                      <p className="font-bold text-lg text-secondary">$2,000 – $10,000</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">M-Pesa Fee</p>
                      <p className="font-bold text-lg">KES 1,300</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {personalGrantFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/register" className="w-full">
                    <Button className="w-full font-bold h-12 bg-secondary hover:bg-secondary/90">Apply for Personal Grant <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Business Grant */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}>
              <Card className="h-full border-primary/30 border-2 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Business Grant</CardTitle>
                  <p className="text-muted-foreground">For registered Kenyan businesses seeking non-repayable capital to start, expand, or sustain their operations.</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Grant Range</p>
                      <p className="font-bold text-lg text-primary">$5,000 – $30,000</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">M-Pesa Fee</p>
                      <p className="font-bold text-lg">KES 2,600</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {businessGrantFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/register" className="w-full">
                    <Button className="w-full font-bold h-12">Apply for Business Grant <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              <Heart className="h-4 w-4" /> What Kenyans Use Grants For
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">Any purpose. Every dream.</h2>
            <p className="text-muted-foreground text-lg">There are no restrictions on how you use your grant funds. These are just some of the most common uses among our applicants.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grantUseCases.map((uc, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }}>
                <Card className="h-full border-border hover:shadow-lg hover:border-secondary/30 transition-all duration-300">
                  <CardContent className="p-7">
                    <div className="text-4xl mb-4">{uc.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{uc.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{uc.desc}</p>
                  </CardContent>
                </Card>
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
              <strong>Important Disclaimer:</strong> Cardone Loans & Grants is a financial intermediary, not a direct grant-making foundation. We facilitate connections between Kenyan applicants and U.S.-based grant foundations. All processing fees are non-refundable and cover administrative, underwriting, and coordination costs. Grant approval is not guaranteed. Disbursement is subject to partner foundation review and approval.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" /> Grant FAQs
            </div>
            <h2 className="text-3xl font-display font-bold">Common grant questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.05 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left flex items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border hover:border-secondary/30 transition-colors"
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
      <section className="py-20 bg-secondary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl font-display font-bold text-white mb-4">Apply for free grant funding today.</h2>
            <p className="text-white/80 text-lg mb-8">No repayment. No interest. Just capital to move your life or business forward.</p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold h-14 px-12 shadow-2xl shadow-black/20">
                Apply for Your Grant <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
