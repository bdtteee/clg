import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Link } from "wouter"
import { motion, useInView } from "framer-motion"
import {
  CheckCircle2, ShieldCheck, Zap, Briefcase, User, HelpCircle,
  ChevronDown, ArrowRight, Star, Globe, Clock, TrendingUp,
  DollarSign, Users, Award, Lock, ChevronRight, Smartphone, MapPin, Building
} from "lucide-react"

function AnimatedCounter({ end, duration = 2, prefix = "", suffix = "" }: {
  end: number; duration?: number; prefix?: string; suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: "Who can apply for funding?",
      a: "Any Kenyan individual aged 18+ or registered Kenyan business can apply. You must have a valid National ID or passport and an active M-Pesa line for the processing fee."
    },
    {
      q: "How long does the approval process take?",
      a: "Standard approval takes 2–3 business days after documentation and the processing fee are received. Our U.S.-based underwriting partners work diligently to provide timely decisions."
    },
    {
      q: "When will my funds be disbursed to Kenya?",
      a: "Disbursement occurs exactly 14 days after your application is approved. Funds are transferred directly to your provided bank account or mobile money account."
    },
    {
      q: "Are you a direct lender?",
      a: "No. Cardone Loans & Grants acts as an intermediary connecting Kenyan applicants with reputable U.S.-based funding companies. We facilitate applications and coordinate with our American funding partners."
    },
    {
      q: "What does the 65% pre-approval mean?",
      a: "For loan products, our automated eligibility check guarantees 65% of your requested amount pending final verification. For example, if you apply for $20,000, you receive an instant pre-approval for $13,000."
    },
    {
      q: "Why is the processing fee paid via M-Pesa?",
      a: "M-Pesa (Paybill 4167853) is our secure, verified payment channel for Kenyan applicants. The fee covers administrative costs, credit assessment, document verification, and coordination with our U.S. partners. It is one-time and non-refundable."
    },
    {
      q: "What documents do I need?",
      a: "Personal: National ID and basic personal info. Business: Business registration number and KRA PIN. Our streamlined process minimises paperwork for Kenyan applicants."
    },
  ]

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-20 pb-16 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--secondary)/0.1)_0%,_transparent_60%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6"
              >
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide">Kenya's Gateway to U.S. Capital</span>
              </motion.div>

              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-display font-extrabold text-white leading-[1.05] mb-6"
              >
                American funding.{" "}
                <span className="text-accent">Kenyan dreams.</span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-white/70 mb-4 leading-relaxed max-w-lg"
              >
                We connect Kenyan individuals and businesses directly with U.S.-based funding companies — offering personal and business loans & grants from <strong className="text-white">$2,000 to $100,000 USD</strong>.
              </motion.p>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.25 }}
                className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-white/8 border border-white/12 w-fit"
              >
                <Smartphone className="h-5 w-5 text-accent shrink-0" />
                <span className="text-white/80 text-sm">Processing fee paid securely via <strong className="text-white">M-Pesa Paybill 4167853</strong></span>
              </motion.div>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/register">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto text-primary font-bold text-base px-8 h-14 shadow-2xl shadow-accent/30 group">
                    Apply Now — It's Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white h-14 text-base">
                    See How It Works
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/60"
              >
                {[
                  "No collateral required",
                  "2–3 day decisions",
                  "Open to all Kenyans",
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, label: "Total Disbursed (USD)", value: 52, suffix: "M+", prefix: "$", color: "text-accent" },
                  { icon: Users, label: "Kenyan Applicants Served", value: 14800, suffix: "+", prefix: "", color: "text-secondary" },
                  { icon: Award, label: "Approval Rate", value: 87, suffix: "%", prefix: "", color: "text-accent" },
                  { icon: Building, label: "U.S. Funding Partners", value: 23, suffix: "+", prefix: "", color: "text-secondary" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="text-3xl font-display font-bold text-white mb-1">
                      <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </div>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 p-5 rounded-2xl bg-accent/15 border border-accent/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Kenya → United States</p>
                    <p className="text-white/60 text-sm">Bridging Kenyan talent with American capital since 2019</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────── */}
      <section className="py-8 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
            {[
              { icon: Lock, label: "256-bit SSL Security", color: "text-primary" },
              { icon: Smartphone, label: "M-Pesa Payments", color: "text-secondary" },
              { icon: Zap, label: "Instant Pre-Qualification", color: "text-accent-foreground" },
              { icon: Globe, label: "U.S. Provider Network", color: "text-primary" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <item.icon className={`h-7 w-7 ${item.color}`} />
                <span className="font-semibold text-sm text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" className="py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Zap className="h-4 w-4" /> Simple 4-Step Process
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              From Nairobi to funded — in days
            </h2>
            <p className="text-muted-foreground text-lg">
              No complex paperwork. No bank visits. Apply from anywhere in Kenya and receive U.S. dollars.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

            {[
              { step: "01", icon: User, title: "Choose Your Product", desc: "Select from personal or business loan/grant — sized for your specific need and ambition, from $2,000 to $100,000 USD.", color: "bg-primary/10 text-primary" },
              { step: "02", icon: CheckCircle2, title: "Submit Application", desc: "Fill out our concise online form with your personal or business details. Takes under 5 minutes for most Kenyan applicants.", color: "bg-secondary/10 text-secondary" },
              { step: "03", icon: Smartphone, title: "Pay via M-Pesa", desc: "Send the small processing fee via M-Pesa Paybill 4167853. This activates your underwriting review with our U.S. partners.", color: "bg-accent/20 text-accent-foreground" },
              { step: "04", icon: TrendingUp, title: "Receive USD Funding", desc: "Decision in 2–3 business days. Funds disbursed within 14 days of approval directly to your account.", color: "bg-primary/10 text-primary" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-3xl bg-white border border-border shadow-xl shadow-black/5 flex flex-col items-center justify-center group-hover:border-primary/20 group-hover:shadow-primary/10 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground tracking-widest">{item.step}</span>
                  </div>
                  {i < 3 && <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-border z-20" />}
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ──────────────────────────────────── */}
      <section id="products" className="py-28 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--accent)/0.08)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-4">
              <Briefcase className="h-4 w-4" /> Our Products
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              USD funding for every Kenyan goal
            </h2>
            <p className="text-white/60 text-lg">
              Processing fees are paid in KES via M-Pesa. Funding is disbursed in USD.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: User, iconBg: "bg-secondary/20", iconColor: "text-secondary",
                title: "Personal Grant", subtitle: "Non-repayable funds for personal goals.",
                range: "$2,000 – $10,000 USD", fee: "KES 1,300 (~$10)", badge: null,
                features: ["No repayment required", "National ID only", "2–3 day decision"],
              },
              {
                icon: Briefcase, iconBg: "bg-accent/20", iconColor: "text-accent",
                title: "Business Grant", subtitle: "Growth capital for Kenyan businesses.",
                range: "$5,000 – $30,000 USD", fee: "KES 2,600 (~$20)", badge: null,
                features: ["No repayment required", "Business reg. + KRA PIN", "Any business type"],
              },
              {
                icon: User, iconBg: "bg-secondary/20", iconColor: "text-secondary",
                title: "Personal Loan", subtitle: "Flexible USD for significant personal needs.",
                range: "$10,000 – $50,000 USD", fee: "KES 2,600 (~$20)", badge: "65% Pre-approved",
                features: ["Instant 65% pre-qualification", "Flexible repayment schedule", "Personal use"],
              },
              {
                icon: Briefcase, iconBg: "bg-accent/20", iconColor: "text-accent",
                title: "Business Loan", subtitle: "Major capital for Kenyan enterprise growth.",
                range: "$20,000 – $100,000 USD", fee: "KES 6,500 (~$50)", badge: "65% Pre-approved",
                features: ["Instant 65% pre-qualification", "Business expansion ready", "Most popular product"],
                highlight: true,
              },
            ].map((product, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className={`h-full ${product.highlight
                  ? "bg-white/12 border-accent/60 border-2 relative overflow-hidden"
                  : "bg-white/5 border-white/10 hover:bg-white/8"
                  } text-white backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/20`}
                >
                  {product.highlight && (
                    <div className="absolute top-0 right-0 bg-accent text-primary text-xs font-bold px-5 py-1.5 rounded-bl-xl tracking-wide">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${product.iconBg} flex items-center justify-center mb-4`}>
                      <product.icon className={`h-6 w-6 ${product.iconColor}`} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-2xl text-white mb-1">{product.title}</CardTitle>
                        <CardDescription className="text-white/55 text-base">{product.subtitle}</CardDescription>
                      </div>
                      {product.badge && (
                        <span className="inline-flex items-center shrink-0 rounded-lg bg-accent/20 px-2.5 py-1 text-xs font-bold text-accent ring-1 ring-accent/30 whitespace-nowrap">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-white/50 text-xs font-medium mb-1 uppercase tracking-wider">USD Amount</p>
                        <p className="font-bold text-base text-white">{product.range}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-white/50 text-xs font-medium mb-1 uppercase tracking-wider">M-Pesa Fee</p>
                        <p className="font-bold text-base text-accent">{product.fee}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {product.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/register" className="w-full">
                      <Button className={`w-full font-bold h-11 ${product.highlight
                        ? "bg-accent text-primary hover:bg-accent/90"
                        : "bg-white text-primary hover:bg-white/90"
                        }`}>
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY US ────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Kenyans choose Cardone</h2>
            <p className="text-muted-foreground">Built specifically for the Kenyan market. Backed by U.S. funding partners.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe, color: "bg-primary/10 text-primary",
                title: "Direct U.S. Funding Network",
                desc: "We maintain active relationships with 23+ accredited U.S. lending companies and grant foundations. Your application goes directly to verified American capital sources."
              },
              {
                icon: Smartphone, color: "bg-secondary/10 text-secondary",
                title: "M-Pesa Native",
                desc: "No wire transfers, no bank visits. The processing fee is paid in KES via M-Pesa Paybill 4167853 — the way Kenyans do business."
              },
              {
                icon: ShieldCheck, color: "bg-accent/20 text-accent-foreground",
                title: "Transparent Process",
                desc: "We are an intermediary, not a lender. We're upfront about every fee, every step, and every timeline. No hidden charges. No surprises."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-5`}>
                      <item.icon className="h-6 w-6" />
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

      {/* ─── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Kenyans who got funded</h2>
            <div className="flex justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
            </div>
            <p className="text-muted-foreground text-sm">Rated 4.9/5 by over 3,000 Kenyan applicants</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Grace M.", role: "Business Owner, Nairobi", quote: "Applied for the Business Grant on Monday, had my approval decision by Wednesday. The team was professional and the M-Pesa payment was simple. Highly recommended for any Kenyan business owner.", rating: 5 },
              { name: "David K.", role: "Engineer, Mombasa", quote: "I needed capital to start a tech project. The 65% pre-approval notice came instantly after submitting my loan. Process was transparent — exactly as described on the website. Funds arrived in 14 days.", rating: 5 },
              { name: "Amina W.", role: "Restaurant Owner, Kisumu", quote: "I was initially skeptical about a U.S. company helping Kenyans. But the process was fully online, the M-Pesa fee was straightforward, and the funds were disbursed exactly as promised. Legit!", rating: 5 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-white">
                  <CardContent className="p-7">
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-accent text-accent" />)}
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-muted-foreground text-xs">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" /> Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className={`border rounded-2xl overflow-hidden bg-white transition-all duration-200 ${openFaq === i ? "border-primary/30 shadow-md shadow-primary/5" : "border-border hover:border-primary/20"}`}>
                  <button
                    className="w-full flex justify-between items-center p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-foreground text-base pr-4">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">{faq.a}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────── */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--secondary)/0.15)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <MapPin className="h-8 w-8 text-accent/70" />
              <span className="text-white/40 text-3xl font-light">→</span>
              <Globe className="h-8 w-8 text-accent/70" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Kenya to the U.S. — start your application today
            </h2>
            <p className="text-white/60 text-xl mb-10 max-w-2xl mx-auto">
              Join 14,800+ Kenyans who have already accessed U.S. capital through our platform. Create your free account in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="accent" className="text-primary font-bold text-base px-10 h-14 shadow-2xl shadow-accent/20 group">
                  Start Your Application
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-white border-white/25 bg-white/10 hover:bg-white/20 hover:text-white h-14 text-base">
                  Sign In to Portal
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-white/40 text-sm">
              Free to register. Processing fee only paid upon application submission via M-Pesa.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
