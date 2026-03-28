import { motion } from "framer-motion"
import { Link } from "wouter"
import { Shield } from "lucide-react"
import { useSEO } from "@/hooks/useSEO"

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const sections = [
  {
    title: "1. Introduction",
    content: `Cardone Loans & Grants LLC ("Cardone," "We," "Our," or "Us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, store, share, and protect your data when you use our Platform at cardoneloansgrants.org and related services.

This policy is designed to comply with applicable Kenyan data protection legislation, including the Data Protection Act, 2019 (Kenya), and internationally recognized privacy standards.`
  },
  {
    title: "2. Information We Collect",
    content: `2.1 Information You Provide Directly:
• Identity information: Full name, National ID number, passport details
• Contact information: Email address, phone number, physical address
• Financial information: Income details, employment status, business revenue figures
• Business information: Business registration number, KRA PIN, business name, type, and operating history
• Application data: Loan/grant amount requested, purpose of funds, bank account details
• Payment records: M-Pesa confirmation codes and transaction data

2.2 Information Collected Automatically:
• Device information: Browser type, operating system, device identifiers
• Usage data: Pages visited, time spent on pages, application completion rates
• IP address and approximate geographic location
• Session and authentication data (cookies)

2.3 Information from Third Parties:
• M-Pesa payment verification from Safaricom's API
• Publicly available business registry information (Kenya Registrar of Companies, KRA)`
  },
  {
    title: "3. How We Use Your Information",
    content: `We use your personal information for the following purposes:

(a) Application Processing: To assess your eligibility, process your application, and coordinate with our U.S.-based Funding Partners on your behalf.

(b) Identity Verification: To verify your identity and eligibility in compliance with our Know Your Customer (KYC) obligations.

(c) Fee Processing: To verify M-Pesa payments, reconcile fee records, and maintain payment audit trails.

(d) Communication: To send application status updates, notifications, decisions, disbursement information, and support responses.

(e) Platform Improvement: To analyze usage patterns, improve our services, and develop new features that better serve Kenyan applicants.

(f) Legal Compliance: To comply with applicable Kenyan and U.S. laws, including anti-money laundering (AML) and counter-terrorism financing (CTF) obligations.

(g) Fraud Prevention: To detect and prevent fraudulent applications, identity theft, and abuse of our platform.`
  },
  {
    title: "4. Information Sharing",
    content: `We share your personal information only in the following circumstances:

4.1 Funding Partners: We share your application information with our U.S.-based Funding Partners strictly as necessary to process your application for review and potential disbursement. Partners are contractually bound to use your data solely for this purpose.

4.2 Payment Processors: Limited payment verification data is shared with Safaricom's M-Pesa infrastructure to verify your processing fee.

4.3 Service Providers: We work with trusted third-party service providers (hosting, email, analytics) who process data on our behalf under strict data processing agreements.

4.4 Legal Requirements: We may disclose your information if required by applicable law, court order, regulatory authority, or to protect the rights and safety of Cardone, our partners, or users.

4.5 We do not sell your personal information to any third party for marketing or commercial purposes.`
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including:

• Active applications: Throughout the application lifecycle
• Completed applications (approved or declined): 7 years, for legal and audit purposes
• Account data: For the duration of your account and 3 years thereafter
• M-Pesa payment records: 7 years, as required by Kenyan financial regulations

After applicable retention periods, your data is securely deleted or anonymized.`
  },
  {
    title: "6. Data Security",
    content: `We implement industry-standard security measures to protect your personal information, including:

• 256-bit SSL/TLS encryption for all data in transit
• AES-256 encryption for sensitive data at rest
• Role-based access controls limiting staff access to personal data
• Regular security audits and penetration testing
• Secure, redundant cloud infrastructure

While we implement robust security measures, no internet-based system can be guaranteed to be 100% secure. We encourage you to use a strong, unique password and to notify us immediately at info@cardoneloansgrants.org if you suspect unauthorized access to your account.`
  },
  {
    title: "7. Your Rights",
    content: `Under the Kenya Data Protection Act, 2019, you have the following rights:

(a) Right of Access: You may request a copy of the personal data we hold about you.
(b) Right to Rectification: You may request correction of inaccurate or incomplete personal data.
(c) Right to Erasure: You may request deletion of your personal data, subject to our legal retention obligations.
(d) Right to Object: You may object to our processing of your data in certain circumstances.
(e) Right to Data Portability: You may request your data in a structured, machine-readable format.
(f) Right to Withdraw Consent: Where processing is based on consent, you may withdraw it at any time.

To exercise any of these rights, please email info@cardoneloansgrants.org with your full name, email address, and specific request. We will respond within 30 days.`
  },
  {
    title: "8. Cookies",
    content: `Our Platform uses cookies and similar technologies to:
• Maintain your session and keep you logged in
• Remember your preferences
• Analyze Platform usage and performance

You can configure your browser to block or delete cookies, though this may affect Platform functionality. We do not use cookies for targeted advertising.`
  },
  {
    title: "9. International Data Transfers",
    content: `As we operate between Kenya and the United States, your data may be transferred to and processed in the United States. We ensure such transfers comply with applicable data protection laws and that adequate safeguards are in place, including contractual clauses with our U.S.-based partners.`
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Significant changes will be communicated via email or a prominent notice on the Platform. The "Last updated" date at the top of this policy reflects the date of the most recent revision. Your continued use of the Platform after changes are posted constitutes acceptance of the updated policy.`
  },
  {
    title: "11. Contact & Complaints",
    content: `For privacy-related questions, requests, or complaints, please contact our Data Protection Officer:

Email: info@cardoneloansgrants.org
Post: Cardone Loans & Grants LLC, 17325 Castellammare Dr, Pacific Palisades, CA 90272, USA

If you are not satisfied with our response, you have the right to lodge a complaint with the Office of the Data Protection Commissioner (ODPC) of Kenya at www.odpc.go.ke.`
  },
]

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | Cardone Loans & Grants",
    description: "Learn how Cardone Loans & Grants collects, uses, and protects your personal and business information when you apply for loans or grants in Kenya.",
    canonical: "/privacy",
    keywords: "Cardone loans privacy policy, data privacy Kenya loan, personal data loan application Kenya",
  })
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/60">Last updated: January 1, 2025 · Effective date: January 1, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10 text-sm text-blue-900">
            <strong>Your Privacy Matters:</strong> We are committed to transparency about how your personal data is collected and used. This policy explains your rights and our obligations under the Kenya Data Protection Act, 2019.
          </div>

          <div className="space-y-10">
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: 0.05 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">{sec.title}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">{sec.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Cardone Loans & Grants LLC. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
