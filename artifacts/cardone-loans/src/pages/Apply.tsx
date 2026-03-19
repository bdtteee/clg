import { useState } from "react"
import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCreateApplication, useSubmitPayment } from "@workspace/api-client-react"
import { CreateApplicationRequestType, CreateApplicationRequestCategory } from "@workspace/api-client-react"
import { formatCurrency } from "@/lib/utils"
import {
  Building2, User, ChevronRight, Loader2, CheckCircle2,
  ArrowRight, Zap, Smartphone, AlertCircle
} from "lucide-react"

const PRODUCTS = {
  personal_grant: { type: 'grant' as const, category: 'personal' as const, title: 'Personal Grant', min: 2000, max: 10000, feeUsd: 10, feeKes: 1300, icon: User },
  business_grant: { type: 'grant' as const, category: 'business' as const, title: 'Business Grant', min: 5000, max: 30000, feeUsd: 20, feeKes: 2600, icon: Building2 },
  personal_loan: { type: 'loan' as const, category: 'personal' as const, title: 'Personal Loan', min: 10000, max: 50000, feeUsd: 20, feeKes: 2600, icon: User },
  business_loan: { type: 'loan' as const, category: 'business' as const, title: 'Business Loan', min: 20000, max: 100000, feeUsd: 50, feeKes: 6500, icon: Building2 },
}

export function Apply() {
  const [step, setStep] = useState(1)
  const [, setLocation] = useLocation()

  const [selectedProduct, setSelectedProduct] = useState<keyof typeof PRODUCTS | null>(null)
  const [appData, setAppData] = useState<any>({ amountRequested: 0, country: "Kenya" })
  const [createdAppId, setCreatedAppId] = useState<number | null>(null)
  const [paymentCode, setPaymentCode] = useState("")
  const [formError, setFormError] = useState("")

  const createMut = useCreateApplication()
  const paymentMut = useSubmitPayment()

  const productDef = selectedProduct ? PRODUCTS[selectedProduct] : null

  const handleProductSelect = (key: keyof typeof PRODUCTS) => {
    setSelectedProduct(key)
    setAppData({ amountRequested: PRODUCTS[key].min, country: "Kenya" })
    setStep(2)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productDef) return
    setFormError("")

    const payload = {
      type: productDef.type as CreateApplicationRequestType,
      category: productDef.category as CreateApplicationRequestCategory,
      fullName: appData.fullName,
      email: appData.email,
      phoneNumber: appData.phoneNumber,
      country: "Kenya",
      reason: appData.reason,
      amountRequested: Number(appData.amountRequested),
      businessName: appData.businessName,
      nationalIdNumber: appData.nationalIdNumber,
      kraPin: appData.kraPin,
      registrationNumber: appData.registrationNumber,
      employmentStatus: appData.employmentStatus,
      monthlyIncome: appData.monthlyIncome ? Number(appData.monthlyIncome) : undefined,
      annualRevenue: appData.annualRevenue ? Number(appData.annualRevenue) : undefined,
    }

    createMut.mutate({ data: payload }, {
      onSuccess: (data) => {
        setCreatedAppId(data.id)
        setStep(3)
      },
      onError: (err: any) => {
        setFormError(err?.data?.error || err?.message || "Submission failed. Please try again.")
      }
    })
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!createdAppId) return
    paymentMut.mutate({
      id: createdAppId,
      data: { paymentCode }
    }, {
      onSuccess: () => setStep(4),
      onError: (err: any) => {
        setFormError(err?.data?.error || err?.message || "Payment verification failed.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-background py-16 pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Progress */}
        <div className="mb-14">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= i ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border-2 border-border text-muted-foreground'}`}>
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-semibold text-muted-foreground">
            <span className={step >= 1 ? "text-primary" : ""}>Select</span>
            <span className={step >= 2 ? "text-primary" : ""}>Details</span>
            <span className={step >= 3 ? "text-primary" : ""}>Payment</span>
            <span className={step >= 4 ? "text-primary" : ""}>Done</span>
          </div>
        </div>

        {/* STEP 1: Product Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold">Select Your Product</h1>
              <p className="text-muted-foreground mt-2">Choose the right U.S. funding product for your Kenyan goals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.entries(PRODUCTS) as [keyof typeof PRODUCTS, typeof PRODUCTS[keyof typeof PRODUCTS]][]).map(([key, prod]) => {
                const Icon = prod.icon
                return (
                  <Card
                    key={key}
                    className="cursor-pointer group hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
                    onClick={() => handleProductSelect(key)}
                  >
                    {prod.type === 'loan' && (
                      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-bl-xl z-10">
                        65% PRE-APPROVED
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{prod.title}</CardTitle>
                          <CardDescription className="uppercase tracking-wider text-xs font-semibold mt-0.5">
                            {formatCurrency(prod.min)} – {formatCurrency(prod.max)} USD
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm bg-muted/50 rounded-lg p-3">
                        <span className="text-muted-foreground font-medium">M-Pesa Processing Fee</span>
                        <div className="text-right">
                          <span className="font-bold text-primary block">KES {prod.feeKes.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">~{formatCurrency(prod.feeUsd)} USD</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Application Details */}
        {step === 2 && productDef && (
          <Card className="animate-in fade-in slide-in-from-right-8 duration-500 shadow-xl shadow-primary/5">
            <CardHeader className="border-b border-border bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{productDef.title} Application</CardTitle>
                  <CardDescription>Provide accurate information for fast processing.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {formError && (
                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20 mb-6">
                  <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-6">

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Requested Amount (USD $)</label>
                  <Input
                    type="number"
                    min={productDef.min}
                    max={productDef.max}
                    required
                    value={appData.amountRequested}
                    onChange={e => setAppData({ ...appData, amountRequested: e.target.value })}
                    className="text-lg font-bold h-12"
                  />
                  <p className="text-xs text-muted-foreground">Between {formatCurrency(productDef.min)} and {formatCurrency(productDef.max)} USD</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-border">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Full Name</label>
                    <Input required value={appData.fullName || ''} onChange={e => setAppData({ ...appData, fullName: e.target.value })} placeholder="As on your National ID" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Email Address</label>
                    <Input type="email" required value={appData.email || ''} onChange={e => setAppData({ ...appData, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">M-Pesa Phone Number</label>
                    <Input required value={appData.phoneNumber || ''} onChange={e => setAppData({ ...appData, phoneNumber: e.target.value })} placeholder="07XX XXX XXX" />
                    <p className="text-xs text-muted-foreground">Kenyan number for M-Pesa payments</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">National ID Number</label>
                    <Input required value={appData.nationalIdNumber || ''} onChange={e => setAppData({ ...appData, nationalIdNumber: e.target.value })} placeholder="e.g. 12345678" />
                  </div>

                  {productDef.category === 'personal' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Employment Status</label>
                        <Input required value={appData.employmentStatus || ''} onChange={e => setAppData({ ...appData, employmentStatus: e.target.value })} placeholder="Employed, Self-employed, etc." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Monthly Income (KES)</label>
                        <Input type="number" required value={appData.monthlyIncome || ''} onChange={e => setAppData({ ...appData, monthlyIncome: e.target.value })} placeholder="e.g. 80000" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Business Name</label>
                        <Input required value={appData.businessName || ''} onChange={e => setAppData({ ...appData, businessName: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Business Registration No.</label>
                        <Input required value={appData.registrationNumber || ''} onChange={e => setAppData({ ...appData, registrationNumber: e.target.value })} placeholder="e.g. CPR/2019/XXXXXX" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">KRA PIN</label>
                        <Input required value={appData.kraPin || ''} onChange={e => setAppData({ ...appData, kraPin: e.target.value })} placeholder="e.g. A000000000X" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Annual Revenue (KES)</label>
                        <Input type="number" required value={appData.annualRevenue || ''} onChange={e => setAppData({ ...appData, annualRevenue: e.target.value })} placeholder="e.g. 2000000" />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1.5 pt-4 border-t border-border">
                  <label className="text-sm font-semibold">Purpose of Funds</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-border bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                    required
                    value={appData.reason || ''}
                    onChange={e => setAppData({ ...appData, reason: e.target.value })}
                    placeholder="Describe how you plan to use these funds..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-12 font-bold" disabled={createMut.isPending}>
                  {createMut.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Continue to M-Pesa Payment <ChevronRight className="ml-2 h-5 w-5" /></>}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: M-Pesa Payment */}
        {step === 3 && productDef && createdAppId && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <Card className="md:col-span-3 border-primary/20 shadow-xl shadow-primary/5">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Smartphone className="h-6 w-6 text-accent" />
                  M-Pesa Payment Instructions
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Pay the processing fee to activate your application review.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-accent-foreground mb-1">Processing Fee Due</p>
                  <p className="text-2xl font-bold text-primary">KES {productDef.feeKes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">~{formatCurrency(productDef.feeUsd)} USD</p>
                </div>
                <ol className="space-y-3 mb-8 text-muted-foreground text-sm">
                  {[
                    "Go to M-Pesa on your phone",
                    <>Select <strong className="text-foreground">Lipa na M-Pesa</strong></>,
                    <>Select <strong className="text-foreground">Paybill</strong></>,
                    <>Business Number: <strong className="text-foreground text-lg tracking-widest font-mono">4167853</strong></>,
                    <>Account Number: <strong className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">APP-{createdAppId}</strong></>,
                    <>Amount: <strong className="text-primary font-bold">KES {productDef.feeKes.toLocaleString()}</strong></>,
                    "Enter your M-Pesa PIN and confirm",
                    "Copy the confirmation code from your SMS",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {formError && (
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20 mb-4">
                    <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit} className="bg-muted/50 p-6 rounded-xl border border-border">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground">Enter M-Pesa Confirmation Code</label>
                    <Input
                      required
                      value={paymentCode}
                      onChange={e => setPaymentCode(e.target.value.toUpperCase())}
                      placeholder="e.g. QKT5B9XX7L"
                      className="font-mono text-lg uppercase tracking-widest bg-white h-12"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full mt-4 font-bold" disabled={paymentMut.isPending}>
                    {paymentMut.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="bg-muted/30 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Product", value: productDef.title },
                    { label: "Amount (USD)", value: formatCurrency(appData.amountRequested) },
                    { label: "Country", value: "🇰🇪 Kenya" },
                    { label: "App Reference", value: `APP-${createdAppId}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <span className="text-muted-foreground text-sm">{label}</span>
                      <span className="font-semibold text-sm text-right">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-foreground font-bold">Fee Due Now</span>
                    <div className="text-right">
                      <span className="text-primary font-bold text-lg block">KES {productDef.feeKes.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">~{formatCurrency(productDef.feeUsd)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {productDef.type === 'loan' && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm">
                  <strong className="text-accent-foreground block mb-2 flex items-center gap-1">
                    <Zap className="h-4 w-4" /> Instant Pre-Approval
                  </strong>
                  <p className="text-muted-foreground">
                    After payment verification you'll receive an instant <strong>65% pre-approval</strong> for{" "}
                    <strong className="text-primary">{formatCurrency(Number(appData.amountRequested) * 0.65)} USD</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && productDef && (
          <div className="animate-in zoom-in-95 duration-700 max-w-2xl mx-auto text-center mt-8">
            <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-secondary" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Application Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Reference: <strong className="text-primary font-mono">APP-{createdAppId}</strong>. Your M-Pesa payment has been received.
            </p>

            {productDef.type === 'loan' && (
              <Card className="border-accent bg-accent/5 shadow-xl mb-8 overflow-hidden relative text-left">
                <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                <CardContent className="p-8">
                  <p className="text-accent-foreground font-bold text-xs uppercase tracking-widest mb-2">Instant Pre-Approval Decision</p>
                  <div className="text-4xl font-display font-extrabold text-primary mb-3">
                    {formatCurrency(Number(appData.amountRequested) * 0.65)} USD
                  </div>
                  <p className="text-muted-foreground">
                    Congratulations! You are <strong>65% pre-approved</strong> based on our initial automated criteria. Final approval pending full underwriting review.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="bg-muted p-6 rounded-2xl mb-8 text-left">
              <h4 className="font-bold mb-4">What happens next?</h4>
              <ul className="space-y-4">
                {[
                  "Our U.S.-based underwriting team will review your complete profile within <strong>2–3 business days</strong>.",
                  "You'll receive an email and dashboard notification for your final approval decision.",
                  "Upon final approval, USD funds are disbursed within <strong>14 days</strong> to your provided account.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">{i + 1}</div>
                    <p className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: text }} />
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto font-bold">
                Go to My Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
