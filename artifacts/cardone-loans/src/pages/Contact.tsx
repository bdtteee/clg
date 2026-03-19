import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import {
  Mail, Phone, MapPin, Clock, MessageSquare, Globe,
  Smartphone, ArrowRight, CheckCircle2, Building2
} from "lucide-react"
import { useState } from "react"

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.1)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Contact Our Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
              We're here to help you.
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Have questions about our loan or grant products? Need guidance on your application? Our team is available to assist you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: Mail, color: "bg-primary/10 text-primary",
                title: "Email Support",
                details: "info@cardoneloansgrants.org",
                sub: "Response within 24 business hours",
                href: "mailto:info@cardoneloansgrants.org"
              },
              {
                icon: Phone, color: "bg-secondary/10 text-secondary",
                title: "Phone",
                details: "+1 254-528-9454",
                sub: "Mon–Fri, 9am–5pm EST",
                href: "tel:+12545289454"
              },
              {
                icon: MapPin, color: "bg-accent/20 text-accent-foreground",
                title: "U.S. Office",
                details: "17325 Castellammare Dr",
                sub: "Pacific Palisades, CA 90272",
                href: null
              },
              {
                icon: Smartphone, color: "bg-primary/10 text-primary",
                title: "M-Pesa Paybill",
                details: "4167853",
                sub: "Processing fees only",
                href: null
              },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-7">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{item.title}</h3>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-primary hover:underline block mb-1 text-sm">{item.details}</a>
                    ) : (
                      <p className="font-semibold text-foreground mb-1 text-sm">{item.details}</p>
                    )}
                    <p className="text-muted-foreground text-xs">{item.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form + Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            >
              <h2 className="text-3xl font-display font-bold mb-2">Send us a message</h2>
              <p className="text-muted-foreground mb-8">Our team responds within one business day. For urgent queries, please call us directly.</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Message Received!</h3>
                  <p className="text-muted-foreground max-w-sm mb-8">Thank you for reaching out. Our team will respond to your enquiry at <strong>{form.email}</strong> within one business day.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Full Name *</label>
                      <input
                        required type="text"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Kamau"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Email Address *</label>
                      <input
                        required type="email"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                        value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Subject *</label>
                      <select
                        required
                        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition"
                        value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      >
                        <option value="">Select a subject</option>
                        <option>Personal Loan Enquiry</option>
                        <option>Business Loan Enquiry</option>
                        <option>Personal Grant Enquiry</option>
                        <option>Business Grant Enquiry</option>
                        <option>Application Status</option>
                        <option>M-Pesa Payment Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Message *</label>
                    <textarea
                      required rows={5}
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition resize-none"
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your question or situation in detail. The more context you provide, the faster we can assist you..."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-13 font-bold">
                    Send Message <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">By submitting this form you agree to our <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>. We will never share your details with third parties.</p>
                </form>
              )}
            </motion.div>

            {/* Info Sidebar */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-border bg-muted/30">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Office Hours</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    {[
                      { day: "Monday – Friday", time: "9:00 AM – 6:00 PM EST" },
                      { day: "Saturday", time: "10:00 AM – 2:00 PM EST" },
                      { day: "Sunday", time: "Closed" },
                    ].map((h, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                        <span className="text-muted-foreground">{h.day}</span>
                        <span className="font-semibold">{h.time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Kenya applicants: Our team accommodates EAT timezone enquiries. Email responses are sent within 24 business hours.</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Already Applied?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">Check your application status, view notifications, and track your disbursement timeline in your secure client dashboard.</p>
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5">
                      Access Client Portal <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg">Quick Links</h3>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "How It Works", href: "/how-it-works" },
                      { label: "Loan Products", href: "/loans" },
                      { label: "Grant Products", href: "/grants" },
                      { label: "FAQ", href: "/faq" },
                      { label: "Terms of Service", href: "/terms" },
                    ].map((l, i) => (
                      <Link key={i} href={l.href} className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-primary border-b border-border last:border-0 transition-colors">
                        {l.label} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
