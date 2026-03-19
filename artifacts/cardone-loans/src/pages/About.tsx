import { motion } from "framer-motion"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Globe, Shield, Users, Award, Building2, Target, Heart,
  CheckCircle2, ArrowRight, MapPin, Clock, TrendingUp, Handshake
} from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const teamMembers = [
  {
    name: "James R. Cardone",
    title: "Chief Executive Officer",
    bio: "15+ years in cross-border financing across Sub-Saharan Africa and the United States. Former VP at a major U.S. investment fund with deep expertise in emerging market lending.",
    initials: "JC",
  },
  {
    name: "Amara N. Wanjiku",
    title: "Head of Kenya Operations",
    bio: "Nairobi-based operations director with 10 years in Kenyan fintech and mobile money systems. Former M-Pesa product manager and financial inclusion advocate.",
    initials: "AW",
  },
  {
    name: "Dr. Patricia O. Odhiambo",
    title: "Chief Compliance Officer",
    bio: "Legal expert in U.S.–Africa cross-border financial regulations. Former senior counsel at a Washington D.C. law firm specializing in international financial services.",
    initials: "PO",
  },
  {
    name: "Michael S. Thompson",
    title: "Director of Partner Relations",
    bio: "Manages relationships with 23+ U.S.-based lending institutions and grant foundations. 12 years in institutional lending and alternative finance partnerships.",
    initials: "MT",
  },
]

const milestones = [
  { year: "2019", event: "Cardone Loans & Grants founded in Pacific Palisades, CA with a mission to bridge U.S. capital with Kenyan opportunity." },
  { year: "2020", event: "Launched M-Pesa integration for seamless KES fee processing, making access easier for all Kenyan applicants." },
  { year: "2021", event: "Reached 2,500 successful disbursements. Expanded partner network to 15 U.S.-based funding institutions." },
  { year: "2022", event: "Introduced Business Grant product. Total disbursements exceeded $20M USD to Kenyan applicants." },
  { year: "2023", event: "Crossed 10,000 Kenyan families served. Launched digital application portal for fully online processing." },
  { year: "2024", event: "Expanded to 23+ U.S. funding partners. Achieved $52M+ total disbursements. 87% approval rate." },
]

export default function About() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">About Cardone Loans & Grants</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
              Bridging American capital with Kenyan ambition.
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              Founded in 2019 and headquartered in Pacific Palisades, California, Cardone Loans & Grants is a licensed financial intermediary dedicated to connecting Kenyan individuals and businesses with verified U.S.-based funding providers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Target className="h-4 w-4" /> Our Mission
              </div>
              <h2 className="text-4xl font-display font-bold mb-6">
                Democratizing access to U.S. capital for every Kenyan.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We believe that geography should never be a barrier to financial opportunity. Kenya is a nation of entrepreneurs, innovators, and dreamers — yet traditional banking channels have long made it difficult for Kenyans to access the kind of capital that fuels real growth.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Cardone Loans & Grants was built to change that. By leveraging our extensive network of U.S.-based funding partners and combining it with Kenya's M-Pesa mobile money infrastructure, we've created the most accessible cross-border funding channel available to Kenyan applicants today.
              </p>
              <div className="space-y-3">
                {[
                  "No collateral requirements for individuals",
                  "Decisions in 2–3 business days",
                  "Full process handled digitally — no bank visits",
                  "Funds disbursed directly to your account",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { icon: Globe, color: "bg-primary/10 text-primary", label: "Global Reach", val: "U.S. → Kenya" },
                { icon: Users, color: "bg-secondary/10 text-secondary", label: "Clients Served", val: "14,800+" },
                { icon: Award, color: "bg-accent/20 text-accent-foreground", label: "Approval Rate", val: "87%" },
                { icon: TrendingUp, color: "bg-primary/10 text-primary", label: "Total Disbursed", val: "$52M+ USD" },
              ].map((stat, i) => (
                <Card key={i} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-display font-bold mb-1">{stat.val}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Clock className="h-4 w-4" /> Our Story
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">Five years of building bridges</h2>
            <p className="text-muted-foreground text-lg">From a Pacific Palisades vision to Kenya's most trusted cross-border funding intermediary.</p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} transition={{ delay: i * 0.08 }}
                  className="flex gap-8 items-start pl-0"
                >
                  <div className="shrink-0 relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm shadow-lg">
                      {m.year}
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-foreground leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Heart className="h-4 w-4" /> Core Values
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">What we stand for</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, color: "bg-primary/10 text-primary", title: "Transparency", desc: "We state every fee, every step, and every timeline upfront. No hidden costs. No surprises. Ever." },
              { icon: Handshake, color: "bg-secondary/10 text-secondary", title: "Integrity", desc: "We act as a trusted intermediary. We never misrepresent our role, our partners, or our products." },
              { icon: Users, color: "bg-accent/20 text-accent-foreground", title: "Inclusion", desc: "Every Kenyan deserves access to capital — not just those with existing banking relationships or collateral." },
              { icon: TrendingUp, color: "bg-primary/10 text-primary", title: "Excellence", desc: "We maintain the highest standards in applicant communication, underwriting speed, and partner vetting." },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border hover:shadow-lg hover:border-primary/20 transition-all">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 rounded-2xl ${val.color} flex items-center justify-center mb-5`}>
                      <val.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{val.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Users className="h-4 w-4" /> Our Leadership
            </div>
            <h2 className="text-4xl font-display font-bold mb-4">Experienced professionals, two continents</h2>
            <p className="text-muted-foreground text-lg">Our team combines U.S. financial expertise with deep Kenyan market knowledge.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border hover:shadow-lg transition-all text-center">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-display font-bold mx-auto mb-4 shadow-lg">
                      {member.initials}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-semibold mb-4">{member.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
                <MapPin className="h-4 w-4" /> Where We Operate
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">Two offices. One mission.</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg mb-1">U.S. Headquarters</p>
                    <p className="text-white/70">17325 Castellammare Dr,<br />Pacific Palisades, CA 90272, USA</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg mb-1">Kenya Operations</p>
                    <p className="text-white/70">Nairobi, Kenya<br />Serving all 47 counties nationwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-white/60 text-lg mb-8">Ready to access U.S. capital for your Kenyan goals?</p>
              <Link href="/register">
                <Button size="lg" variant="accent" className="text-primary font-bold h-14 px-10 shadow-2xl shadow-accent/30">
                  Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
