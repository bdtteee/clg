import { motion } from "framer-motion"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { ArrowRight, HelpCircle, ChevronDown, Search } from "lucide-react"
import { useState } from "react"
import { useSEO } from "@/hooks/useSEO"

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const categories = [
  {
    label: "Getting Started",
    faqs: [
      { q: "What is Cardone Loans & Grants?", a: "Cardone Loans & Grants is a U.S.-based financial intermediary that connects Kenyan individuals and businesses with verified American funding providers. We are not a direct lender or grant-making foundation — we facilitate the application, underwriting, and disbursement process between Kenyan applicants and our U.S. partners." },
      { q: "Who can apply?", a: "Any Kenyan citizen or resident aged 18 or above can apply for a personal loan or personal grant. Registered Kenyan businesses (sole proprietors, partnerships, limited companies, NGOs) can apply for business loans or business grants. All applicants must have a valid National ID or passport and an active M-Pesa line." },
      { q: "Do I need to visit an office?", a: "No. The entire process — application, document submission, fee payment, and communication — is handled digitally and via M-Pesa. You never need to visit a physical office. We serve all 47 Kenyan counties." },
      { q: "Can Kenyans living abroad apply?", a: "Applications are currently available to Kenyan citizens and residents based within Kenya. Diaspora applications are not accepted at this time as our M-Pesa payment infrastructure and partner underwriting criteria require Kenyan residency." },
    ],
  },
  {
    label: "Loans",
    faqs: [
      { q: "What loan amounts are available?", a: "Personal Loans range from $10,000 to $50,000 USD. Business Loans range from $20,000 to $100,000 USD. All amounts are disbursed in USD." },
      { q: "What is the 65% pre-approval?", a: "For all loan products, our automated system issues a binding pre-qualification equal to 65% of your requested amount immediately upon application submission. This means that if you apply for $20,000, you immediately receive a $13,000 pre-approval — before even paying the processing fee. Final disbursement is subject to the full underwriting review." },
      { q: "What interest rates apply?", a: "Interest rates and repayment schedules are determined by your assigned U.S. funding partner and disclosed to you in full upon approval. Rates vary based on loan amount, applicant profile, and market conditions. All terms are communicated in writing before any funds are disbursed." },
      { q: "Is collateral required?", a: "No collateral is required for any of our products. Our U.S.-based funding partners assess applications based on submitted information, income, and business details — not physical Kenyan assets." },
    ],
  },
  {
    label: "Grants",
    faqs: [
      { q: "Do I really never repay a grant?", a: "Correct. Grants are 100% non-repayable. There is no repayment schedule, no interest, and no future obligation once funds are disbursed. This is what distinguishes a grant from a loan." },
      { q: "What grant amounts are available?", a: "Personal Grants range from $2,000 to $10,000 USD. Business Grants range from $5,000 to $30,000 USD." },
      { q: "Can I use grant money for anything?", a: "Yes. Grant funds can be used for any lawful personal or business purpose. There are no category restrictions. Common uses include education, housing, healthcare, business startup, equipment, and agricultural development." },
      { q: "Where does the grant money come from?", a: "Grant funds come from U.S.-based philanthropic foundations and corporate social responsibility grant programs that have dedicated African development allocations. Cardone facilitates the application and disbursement process on behalf of these foundations." },
    ],
  },
  {
    label: "M-Pesa & Fees",
    faqs: [
      { q: "What is the processing fee for?", a: "The processing fee covers administrative costs, credit assessment, document verification, M-Pesa processing infrastructure, partner coordination, and international wire transfer setup. It is a one-time, non-refundable fee per application." },
      { q: "What are the exact M-Pesa fees?", a: "Personal Grant: KES 1,300 (~$10). Business Grant: KES 2,600 (~$20). Personal Loan: KES 2,600 (~$20). Business Loan: KES 6,500 (~$50). All paid via M-Pesa Paybill 4167853, Account Number = your Application ID." },
      { q: "Is the fee refundable if I'm rejected?", a: "No. Processing fees are non-refundable regardless of the outcome. The fee is charged to initiate the underwriting review process, which incurs costs regardless of the decision." },
      { q: "Can I pay the fee in installments?", a: "No. The full processing fee must be paid in a single M-Pesa transaction before your application proceeds to underwriting review." },
    ],
  },
  {
    label: "Application Process",
    faqs: [
      { q: "How long does the process take?", a: "From submission to decision: 2–3 business days. From approval to disbursement: up to 14 calendar days. Total process from application to receiving funds: typically 17–20 days." },
      { q: "What happens after I submit my application?", a: "After submission, you will immediately receive your pre-approval (for loans) and an M-Pesa payment request. Once the fee is verified, your application enters our underwriting queue. You'll receive email and dashboard notifications at every stage." },
      { q: "What documents do I need?", a: "Personal applications: Valid National ID or passport + income information. Business applications: Business registration certificate + KRA PIN certificate + basic financial information. All submitted digitally through your dashboard." },
      { q: "Can I submit multiple applications?", a: "You may only have one active application at a time. Once your application is approved and disbursed — or declined — you may apply again." },
      { q: "What if my application is declined?", a: "You will receive a formal decline notice with the stated reason. The processing fee is not refunded. You may reapply after 90 days. We encourage you to contact our team for guidance on strengthening a future application." },
    ],
  },
  {
    label: "Disbursement",
    faqs: [
      { q: "How are funds sent to me?", a: "Funds are disbursed in USD directly to your nominated bank account or international mobile money account. We coordinate with our U.S. funding partners to arrange the international wire or transfer." },
      { q: "Can I receive funds in KES instead of USD?", a: "Disbursements are made in USD as our funding partners operate in U.S. dollars. Your bank will apply the prevailing exchange rate to convert to KES upon receipt." },
      { q: "What if my bank doesn't receive the funds after approval?", a: "If approved funds are not received within 14 business days of the disbursement notification, contact us immediately at info@cardoneloansgrants.org with your application ID and bank details. We will investigate with our partner and resolve the issue." },
    ],
  },
]

export default function FAQ() {
  useSEO({
    title: "FAQ — Loans & Grants Questions Answered | Cardone Loans & Grants",
    description: "Get answers to all your questions about applying for personal and business loans and grants in Kenya. Learn about eligibility, M-Pesa fees, approval timelines, disbursement, and more.",
    canonical: "/faq",
    keywords: "Kenya loan FAQ, grant application questions, M-Pesa loan Kenya, loan eligibility Kenya, business loan questions Kenya, how to apply for grant Kenya",
  })
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState("")

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = categories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq =>
      !search ||
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.faqs.length > 0)

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.1)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <HelpCircle className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Frequently Asked Questions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-6">
              Answers to your questions.
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Everything you need to know about our loan and grant products, the application process, fees, and disbursements.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-white rounded-xl pl-12 pr-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-xl text-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No results found for "{search}"</p>
              <p className="text-sm mt-2">Try different keywords or <a href="mailto:info@cardoneloansgrants.org" className="text-primary underline">contact us directly</a>.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {filteredCategories.map((cat, ci) => (
                <motion.div key={ci} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-display font-bold">{cat.label}</h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3">
                    {cat.faqs.map((faq, fi) => {
                      const key = `${ci}-${fi}`
                      return (
                        <div key={fi}>
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full text-left flex items-center justify-between gap-4 bg-white p-5 rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all"
                          >
                            <span className="font-semibold text-foreground">{faq.q}</span>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${openItems[key] ? "rotate-180" : ""}`} />
                          </button>
                          {openItems[key] && (
                            <div className="bg-muted/40 px-5 py-4 rounded-b-xl border-x border-b border-border -mt-1 text-muted-foreground text-sm leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-white/70 text-lg mb-8">Our team is available via email, phone, or the contact form. We typically respond within one business day.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="accent" className="text-primary font-bold h-13 px-10">
                  Contact Our Team <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:info@cardoneloansgrants.org">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white/20 hover:text-white h-13 px-10">
                  Email Us Directly
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
