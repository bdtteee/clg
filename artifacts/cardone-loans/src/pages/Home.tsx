import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Link } from "wouter"
import { motion, useInView } from "framer-motion"
import {
  CheckCircle2, ShieldCheck, Zap, Briefcase, User, HelpCircle,
  ChevronDown, ArrowRight, Star, Globe, Clock, TrendingUp,
  DollarSign, Users, Award, Lock, ChevronRight
} from "lucide-react"

function AnimatedCounter({ end, duration = 2, prefix = "", suffix = "" }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: "How long does the approval process take?",
      a: "Standard approval takes 2–3 business days after all documentation and processing fees are received. Our dedicated underwriting team works efficiently to provide timely decisions."
    },
    {
      q: "When will the funds be disbursed?",
      a: "Disbursement occurs exactly 14 days after your application has been officially approved. Funds are transferred directly to your provided bank account."
    },
    {
      q: "Are you a direct lender?",
      a: "No. Cardone Loans & Grants acts as an intermediary connecting applicants with reputable U.S.-based funding providers. We facilitate the application process and coordinate with our network of funding partners."
    },
    {
      q: "What does the 65% pre-approval mean?",
      a: "For loan products, our automated eligibility system conducts an initial check that guarantees 65% of your requested amount pending final verification by our underwriting team."
    },
    {
      q: "What is the M-Pesa processing fee for?",
      a: "The processing fee covers administrative costs, credit assessment, document verification, and coordination with our U.S.-based funding partners. It is a one-time, non-refundable charge."
    },
    {
      q: "What documents do I need to apply?",
      a: "For personal products: National ID and basic personal information. For business products: Business registration number, KRA PIN, and basic business financials. Our streamlined process minimizes documentation requirements."
    },
  ]

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.15)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--secondary)/0.1)_0%,_transparent_60%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <img
              src={`${import.meta.env.BASE_URL}images/hero-abstract.png`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-8"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide">U.S. Accredited Funding Partner</span>
              </motion.div>

              <motion.h1
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-display font-extrabold text-white leading-[1.05] mb-6"
              >
                Unlock global capital for your{" "}
                <span className="text-accent">future.</span>
              </motion.h1>

              <motion.p
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-white/70 mb-10 leading-relaxed max-w-lg"
              >
                Personal and business loans & grants from $2,000 to $100,000. Fast approvals, transparent process, and immediate pre-qualification results.
              </motion.p>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/register">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto text-primary font-bold text-base px-8 h-14 shadow-2xl shadow-accent/30 group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white h-14 text-base">
                    How It Works
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex items-center gap-6 text-sm text-white/60"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>No collateral required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>2–3 day decisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  <span>Secure & confidential</span>
                </div>
              </motion.div>
            </div>

            {/* Hero stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, label: "Total Disbursed", value: 52, suffix: "M+", prefix: "$", color: "text-accent" },
                  { icon: Users, label: "Applicants Served", value: 14800, suffix: "+", prefix: "", color: "text-secondary" },
                  { icon: Award, label: "Approval Rate", value: 87, suffix: "%", prefix: "", color: "text-accent" },
                  { icon: Globe, label: "Funding Partners", value: 23, suffix: "+", prefix: "", color: "text-secondary" },
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
                    <div className={`text-3xl font-display font-bold text-white mb-1`}>
                      <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </div>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────── */}
      <section className="py-8 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
            {[
              { icon: Lock, label: "256-bit SSL Encryption", color: "text-primary" },
              { icon: CheckCircle2, label: "Fast 2–3 Day Approvals", color: "text-secondary" },
              { icon: Zap, label: "Instant Pre-Qualification", color: "text-accent" },
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
              From application to funding
            </h2>
            <p className="text-muted-foreground text-lg">
              We've removed the friction. Four straightforward steps stand between you and your capital.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />

            {[
              { step: "01", icon: User, title: "Select Your Product", desc: "Choose from personal or business loans and grants — tailored to your specific needs and financial goals.", color: "bg-primary/10 text-primary" },
              { step: "02", icon: CheckCircle2, title: "Submit Application", desc: "Complete our secure, abbreviated form with your key details. No extensive paperwork required.", color: "bg-secondary/10 text-secondary" },
              { step: "03", icon: DollarSign, title: "Pay Processing Fee", desc: "Securely pay the minor processing fee via M-Pesa (Paybill 4167853). This initiates the underwriting review.", color: "bg-accent/20 text-accent-foreground" },
              { step: "04", icon: TrendingUp, title: "Receive Funding", desc: "Get your decision within 2–3 business days. Upon approval, funds are disbursed within 14 days.", color: "bg-primary/10 text-primary" },
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
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-border z-20" />
                  )}
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
              Targeted financial products
            </h2>
            <p className="text-white/60 text-lg">
              Whether launching a venture or handling personal expenses, we have a structured program designed for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: User, iconBg: "bg-secondary/20", iconColor: "text-secondary",
                title: "Personal Grant", subtitle: "Non-repayable funds for personal advancement.",
                range: "$2,000 – $10,000", fee: "$10", badge: null,
                features: ["No repayment required", "Quick 2–3 day decision", "Any personal purpose"],
              },
              {
                icon: Briefcase, iconBg: "bg-accent/20", iconColor: "text-accent",
                title: "Business Grant", subtitle: "Catalyst capital for business growth.",
                range: "$5,000 – $30,000", fee: "$20", badge: null,
                features: ["No repayment required", "Business development", "All business types"],
              },
              {
                icon: User, iconBg: "bg-secondary/20", iconColor: "text-secondary",
                title: "Personal Loan", subtitle: "Flexible funding for significant personal expenses.",
                range: "$10,000 – $50,000", fee: "$20", badge: "65% Pre-approved",
                features: ["Immediate 65% pre-qualification", "Flexible repayment", "Personal use"],
              },
              {
                icon: Briefcase, iconBg: "bg-accent/20", iconColor: "text-accent",
                title: "Business Loan", subtitle: "Major capital injection for enterprise expansion.",
                range: "$20,000 – $100,000", fee: "$50", badge: "65% Pre-approved",
                features: ["Immediate 65% pre-qualification", "Business expansion", "Most popular"],
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
                        <p className="text-white/50 text-xs font-medium mb-1 uppercase tracking-wider">Amount Range</p>
                        <p className="font-bold text-lg text-white">{product.range}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-white/50 text-xs font-medium mb-1 uppercase tracking-wider">Processing Fee</p>
                        <p className="font-bold text-lg text-accent">{product.fee}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {product.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                          <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/register" className="w-full">
                      <Button
                        className={`w-full font-bold h-11 ${product.highlight
                          ? "bg-accent text-primary hover:bg-accent/90"
                          : "bg-white text-primary hover:bg-white/90"
                          }`}
                      >
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

      {/* ─── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Trusted by thousands</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
            </div>
            <p className="text-muted-foreground">Rated 4.9/5 by over 3,000 applicants</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Grace M.", role: "Business Owner, Nairobi",
                quote: "The process was incredibly straightforward. I applied for a business grant on Monday and had my approval decision by Wednesday. The funds changed everything for my boutique.",
                rating: 5,
              },
              {
                name: "David K.", role: "Engineer, Mombasa",
                quote: "I was skeptical at first, but the transparency of the process won me over. The 65% pre-approval gave me immediate confidence. Highly recommend for anyone needing financial support.",
                rating: 5,
              },
              {
                name: "Amina W.", role: "Restaurant Owner, Kisumu",
                quote: "Applied for the Business Loan to expand my restaurant. The step-by-step application was easy to follow. Professional service from start to finish. Funds arrived exactly as promised.",
                rating: 5,
              },
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
      <section id="faq" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <HelpCircle className="h-4 w-4" /> FAQ
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
                <div
                  className={`border rounded-2xl overflow-hidden bg-white transition-all duration-200 ${openFaq === i ? "border-primary/30 shadow-md shadow-primary/5" : "border-border hover:border-primary/20"}`}
                >
                  <button
                    className="w-full flex justify-between items-center p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-foreground text-base pr-4">{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                      {faq.a}
                    </div>
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
            <Clock className="h-12 w-12 text-accent mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Ready to get funded?
            </h2>
            <p className="text-white/60 text-xl mb-10 max-w-2xl mx-auto">
              Create your account in minutes and submit your application today. Decisions in 2–3 business days.
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
              No credit check required to apply. Secure 256-bit encryption.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
