import { motion } from "framer-motion"
import { Link } from "wouter"
import { FileText } from "lucide-react"

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Cardone Loans & Grants platform (the "Platform"), website at cardoneloansgrants.org, or any associated services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms in their entirety, you must immediately discontinue use of the Platform.

These Terms constitute a legally binding agreement between you ("Applicant," "User," or "You") and Cardone Loans & Grants LLC, a company incorporated under the laws of the State of California, USA ("Cardone," "We," "Our," or "Us").`
  },
  {
    title: "2. Nature of Services",
    content: `Cardone Loans & Grants is a financial intermediary service. We do not lend money directly, nor are we a grant-making foundation. Our services consist solely of:

(a) Facilitating applications from Kenyan individuals and businesses to U.S.-based funding institutions;
(b) Coordinating the underwriting review process between applicants and our U.S. funding partners;
(c) Processing and verifying M-Pesa administrative fees;
(d) Communicating decisions and coordinating disbursement logistics.

All actual lending, grant-making, and funding decisions are made exclusively by our independent U.S.-based partner institutions ("Funding Partners"). Cardone makes no representations or guarantees regarding partner decisions.`
  },
  {
    title: "3. Eligibility Requirements",
    content: `To use the Platform and submit an application, you must:

(a) Be a Kenyan citizen or legal resident aged 18 years or above;
(b) Possess a valid Kenyan National ID or passport;
(c) Have an active M-Pesa mobile money account registered in Kenya;
(d) For business applications: be a director, owner, or authorized representative of a registered Kenyan business entity;
(e) Not be currently subject to any court order, bankruptcy proceeding, or legal restriction prohibiting you from entering financial agreements;
(f) Provide accurate and complete information in all submitted forms and documents.

You may only maintain one (1) active application at any time across all product categories.`
  },
  {
    title: "4. Processing Fees",
    content: `4.1 Fee Schedule: The following non-refundable administrative processing fees apply per application:
• Personal Grant: KES 1,300 (approximately USD $10)
• Business Grant: KES 2,600 (approximately USD $20)
• Personal Loan: KES 2,600 (approximately USD $20)
• Business Loan: KES 6,500 (approximately USD $50)

4.2 Non-Refundability: All processing fees are strictly non-refundable under all circumstances, including but not limited to application withdrawal, application decline, system errors, or user error. By submitting payment, you acknowledge and accept this policy.

4.3 Payment Method: All fees must be paid via M-Pesa Paybill Number 4167853. The Account Reference must be your unique Application ID. Payments made to any other account or paybill number are not accepted and cannot be credited to your application.

4.4 No Guarantee of Approval: Payment of the processing fee does not constitute a guarantee of approval. The fee compensates Cardone for the administrative and coordination costs incurred regardless of the funding partner's decision.`
  },
  {
    title: "5. Loan Pre-Qualification",
    content: `5.1 For all loan products (Personal Loan and Business Loan), Cardone's automated system issues a pre-qualification equal to 65% of the requested loan amount upon submission of a complete application.

5.2 This pre-qualification is conditional and subject to final underwriting approval by the assigned Funding Partner. It does not constitute a binding loan offer or approval.

5.3 The pre-qualification may be voided, reduced, or modified at the Funding Partner's discretion following underwriting review.

5.4 Grant products do not carry a pre-qualification feature.`
  },
  {
    title: "6. Accuracy of Information",
    content: `You represent and warrant that all information submitted through the Platform — including but not limited to personal details, income information, business information, and identification documents — is accurate, complete, and not misleading.

Submission of false, fraudulent, or misleading information constitutes a material breach of these Terms and may result in:
(a) Immediate termination of your application without refund;
(b) Permanent suspension of your account;
(c) Referral to appropriate Kenyan law enforcement authorities;
(d) Civil liability for any damages incurred by Cardone or its partners.`
  },
  {
    title: "7. Disbursement",
    content: `7.1 Approved funds are disbursed in United States Dollars (USD) to the applicant's nominated bank account or mobile money account.

7.2 Disbursement occurs within fourteen (14) calendar days of formal approval notification.

7.3 Cardone is not responsible for exchange rate fluctuations or bank fees applied during the conversion of USD to Kenyan Shillings (KES).

7.4 For loan products, repayment terms, interest rates, and disbursement conditions are determined exclusively by the assigned Funding Partner and communicated to the applicant prior to disbursement.`
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law:

8.1 Cardone's total aggregate liability to you for any claim arising under or in connection with these Terms or your use of the Platform shall not exceed the processing fee paid by you for the relevant application.

8.2 Cardone shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of income, business opportunity, or data.

8.3 Cardone is not liable for delays, decisions, or failures on the part of Funding Partners.

8.4 Cardone is not liable for failed, misdirected, or delayed M-Pesa payments caused by network failures, user error, or third-party issues.`
  },
  {
    title: "9. Privacy & Data",
    content: `Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Platform, you consent to the collection, use, and disclosure of your personal information as described in the Privacy Policy.

We process your data in accordance with applicable Kenyan data protection laws and reasonable international data protection standards.`
  },
  {
    title: "10. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States of America. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Los Angeles County, California.

Notwithstanding the above, we acknowledge our obligations under Kenyan law with respect to our operations in Kenya, including the Data Protection Act, 2019.`
  },
  {
    title: "11. Amendments",
    content: `Cardone reserves the right to amend these Terms at any time. Amended Terms will be posted on the Platform with an updated effective date. Continued use of the Platform following the posting of amended Terms constitutes your acceptance of such amendments. We encourage you to review these Terms periodically.`
  },
  {
    title: "12. Contact",
    content: `For questions about these Terms, please contact us at:

Cardone Loans & Grants LLC
17325 Castellammare Dr, Pacific Palisades, CA 90272, USA
Email: info@cardoneloansgrants.org
Phone: +1 254-528-9454`
  },
]

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <section className="relative pt-32 pb-16 bg-primary overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-wide">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-white/60">Last updated: January 1, 2025 · Effective date: January 1, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-900">
            <strong>Important Notice:</strong> Please read these Terms of Service carefully before using our Platform. By creating an account or submitting an application, you agree to be legally bound by these Terms.
          </div>

          <div className="prose prose-slate max-w-none">
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: 0.05 }}
                className="mb-10"
              >
                <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">{sec.title}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">{sec.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Cardone Loans & Grants LLC. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
