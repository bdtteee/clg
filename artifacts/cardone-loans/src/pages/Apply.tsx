import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useSearch } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCreateApplication, useSubmitPayment, useGetApplication, getGetApplicationQueryKey } from "@workspace/api-client-react"
import { CreateApplicationRequestType, CreateApplicationRequestCategory } from "@workspace/api-client-react"
import { formatCurrency } from "@/lib/utils"
import {
  Building2, User, ChevronRight, Loader2, CheckCircle2,
  ArrowRight, Zap, Smartphone, AlertCircle, FileText,
  Upload, X, FileCheck
} from "lucide-react"

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || ""

const PRODUCTS = {
  personal_grant: { type: 'grant' as const, category: 'personal' as const, title: 'Personal Grant', min: 2000, max: 10000, feeUsd: 10, feeKes: 1300, icon: User },
  business_grant: { type: 'grant' as const, category: 'business' as const, title: 'Business Grant', min: 5000, max: 30000, feeUsd: 20, feeKes: 2600, icon: Building2 },
  personal_loan: { type: 'loan' as const, category: 'personal' as const, title: 'Personal Loan', min: 10000, max: 50000, feeUsd: 20, feeKes: 2600, icon: User },
  business_loan: { type: 'loan' as const, category: 'business' as const, title: 'Business Loan', min: 20000, max: 100000, feeUsd: 50, feeKes: 6500, icon: Building2 },
}

type ProductKey = keyof typeof PRODUCTS
type IdDocType = 'passport' | 'national_id'

interface UploadedFile {
  file: File
  objectPath: string
  fileName: string
  uploading: boolean
  error?: string
}

async function requestPresignedUrl(file: File) {
  const res = await fetch(`${BASE}/api/storage/uploads/request-url`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  })
  if (!res.ok) throw new Error("Failed to get upload URL")
  return res.json() as Promise<{ uploadURL: string; objectPath: string }>
}

async function uploadToStorage(file: File): Promise<{ objectPath: string; fileName: string }> {
  const { uploadURL, objectPath } = await requestPresignedUrl(file)
  const putRes = await fetch(uploadURL, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "x-upsert": "true",
    },
    body: file,
  })
  if (!putRes.ok) throw new Error("Upload failed")
  return { objectPath, fileName: file.name }
}

async function saveKycDocuments(appId: number, docs: Array<{ documentType: string; fileUrl: string | null; fileName: string | null }>) {
  const res = await fetch(`${BASE}/api/applications/${appId}/kyc-documents`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documents: docs }),
  })
  if (!res.ok) throw new Error("Failed to save documents")
  return res.json()
}

async function loadKycDocuments(appId: number) {
  const res = await fetch(`${BASE}/api/applications/${appId}/kyc-documents`, { credentials: "include" })
  if (!res.ok) return []
  return res.json()
}

// ─── File Upload Field Component ──────────────────────────────────────────────
function FileUploadField({
  label,
  hint,
  uploaded,
  onChange,
}: {
  label: string
  hint?: string
  uploaded: UploadedFile | null
  onChange: (f: UploadedFile | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const entry: UploadedFile = { file, objectPath: "", fileName: file.name, uploading: true }
    onChange(entry)
    try {
      const { objectPath, fileName } = await uploadToStorage(file)
      onChange({ file, objectPath, fileName, uploading: false })
    } catch (e: any) {
      onChange({ file, objectPath: "", fileName: file.name, uploading: false, error: "Upload failed — please try again" })
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {!uploaded ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
        >
          <Upload className="h-7 w-7" />
          <span className="text-sm font-medium">Click to upload file</span>
          <span className="text-xs">JPG, PNG or PDF — max 10 MB</span>
        </button>
      ) : uploaded.uploading ? (
        <div className="w-full border border-border rounded-xl p-4 flex items-center gap-3 bg-muted/30">
          <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{uploaded.fileName}</p>
            <p className="text-xs text-muted-foreground">Uploading…</p>
          </div>
        </div>
      ) : uploaded.error ? (
        <div className="w-full border border-destructive/40 rounded-xl p-4 flex items-center gap-3 bg-destructive/5">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-destructive">{uploaded.error}</p>
          </div>
          <button type="button" onClick={() => onChange(null)} className="text-destructive hover:text-destructive/70">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-full border border-green-200 rounded-xl p-4 flex items-center gap-3 bg-green-50">
          <FileCheck className="h-5 w-5 text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-green-800">{uploaded.fileName}</p>
            <p className="text-xs text-green-600">Uploaded successfully</p>
          </div>
          <button type="button" onClick={() => onChange(null)} className="text-green-700 hover:text-green-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = "" }}
      />
    </div>
  )
}

// ─── ID Type Selector ─────────────────────────────────────────────────────────
function IdTypeSelector({ value, onChange }: { value: IdDocType; onChange: (v: IdDocType) => void }) {
  return (
    <div className="flex gap-3">
      {[
        { val: 'passport' as const, label: 'Passport', desc: 'Upload bio-data page' },
        { val: 'national_id' as const, label: 'National ID', desc: 'Upload front & back' },
      ].map(opt => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`flex-1 rounded-xl border-2 p-3 text-left transition-all ${value === opt.val ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
        >
          <p className="text-sm font-bold">{opt.label}</p>
          <p className="text-xs text-muted-foreground">{opt.desc}</p>
        </button>
      ))}
    </div>
  )
}

// ─── Main Apply Component ─────────────────────────────────────────────────────
export function Apply() {
  const [step, setStep] = useState(1)
  const [, setLocation] = useLocation()
  const searchString = useSearch()
  const resumeId = new URLSearchParams(searchString).get("resume")

  const [selectedProduct, setSelectedProduct] = useState<ProductKey | null>(null)
  const [appData, setAppData] = useState<any>({ amountRequested: 0, country: "Kenya" })
  const [createdAppId, setCreatedAppId] = useState<number | null>(null)
  const [paymentCode, setPaymentCode] = useState("")
  const [formError, setFormError] = useState("")
  const [kycSaving, setKycSaving] = useState(false)

  // KYC doc type choices
  const [personalIdType, setPersonalIdType] = useState<IdDocType>('national_id')
  const [directorIdType, setDirectorIdType] = useState<IdDocType>('national_id')

  // KYC uploaded files: key → UploadedFile | null
  const [kycFiles, setKycFiles] = useState<Record<string, UploadedFile | null>>({})

  // Business plan upload (step 2)
  const [businessPlanFile, setBusinessPlanFile] = useState<UploadedFile | null>(null)

  const setDoc = (key: string, val: UploadedFile | null) =>
    setKycFiles(prev => ({ ...prev, [key]: val }))

  const createMut = useCreateApplication()
  const paymentMut = useSubmitPayment()

  const productDef = selectedProduct ? PRODUCTS[selectedProduct] : null
  const isPersonal = productDef?.category === 'personal'

  // ── Resume logic ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!resumeId) return
    const id = parseInt(resumeId)
    if (isNaN(id)) return

    ;(async () => {
      try {
        const res = await fetch(`${BASE}/api/applications/${id}`, { credentials: "include" })
        if (!res.ok) return
        const app = await res.json()

        // Reconstruct product key
        const key = `${app.category}_${app.type}` as ProductKey
        if (!PRODUCTS[key]) return

        setSelectedProduct(key)
        setCreatedAppId(app.id)
        setAppData({
          fullName: app.fullName,
          email: app.email,
          phoneNumber: app.phoneNumber,
          amountRequested: app.amountRequested,
          nationalIdNumber: app.nationalIdNumber,
          employmentStatus: app.employmentStatus,
          monthlyIncome: app.monthlyIncome,
          businessName: app.businessName,
          registrationNumber: app.registrationNumber,
          kraPin: app.kraPin,
          annualRevenue: app.annualRevenue,
          reason: app.reason,
          country: app.country || "Kenya",
        })

        // Always start at step 2 so the user can review/edit their details
        setStep(2)
      } catch {}
    })()
  }, [resumeId])

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleProductSelect = (key: ProductKey) => {
    setSelectedProduct(key)
    setAppData({ amountRequested: PRODUCTS[key].min, country: "Kenya" })
    setKycFiles({})
    setStep(2)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productDef) return
    setFormError("")

    // If editing an existing incomplete application, PATCH it
    if (createdAppId) {
      try {
        const patchRes = await fetch(`${BASE}/api/applications/${createdAppId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: appData.fullName,
            email: appData.email,
            phoneNumber: appData.phoneNumber,
            purposeOfFunds: appData.reason || "",
            amountRequested: Number(appData.amountRequested),
            businessName: appData.businessName,
            nationalIdNumber: appData.nationalIdNumber,
            kraPin: appData.kraPin,
            registrationNumber: appData.registrationNumber,
            employmentStatus: appData.employmentStatus,
            monthlyIncome: appData.monthlyIncome ? Number(appData.monthlyIncome) : null,
            annualRevenue: appData.annualRevenue ? Number(appData.annualRevenue) : null,
          }),
        })
        if (!patchRes.ok) {
          const body = await patchRes.json().catch(() => ({}))
          setFormError(body.error || "Failed to save changes. Please try again.")
          return
        }
        // Check if KYC docs already exist — if so jump to payment
        const docs = await loadKycDocuments(createdAppId)
        setStep(docs.length > 0 ? 4 : 3)
      } catch {
        setFormError("Failed to save changes. Please try again.")
      }
      return
    }

    // New application — POST
    const payload = {
      type: productDef.type as CreateApplicationRequestType,
      category: productDef.category as CreateApplicationRequestCategory,
      fullName: appData.fullName,
      email: appData.email,
      phoneNumber: appData.phoneNumber,
      purposeOfFunds: appData.reason || "",
      amountRequested: Number(appData.amountRequested),
      businessName: appData.businessName,
      nationalId: appData.nationalIdNumber,
      kraPin: appData.kraPin,
      registrationNumber: appData.registrationNumber,
      employmentStatus: appData.employmentStatus,
      monthlyIncome: appData.monthlyIncome ? Number(appData.monthlyIncome) : undefined,
      annualRevenue: appData.annualRevenue ? Number(appData.annualRevenue) : undefined,
    }

    createMut.mutate({ data: payload }, {
      onSuccess: (data) => { setCreatedAppId(data.id); setStep(3) },
      onError: (err: any) => {
        setFormError(err?.data?.error || err?.message || "Submission failed. Please try again.")
      }
    })
  }

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createdAppId) return
    setFormError("")

    // Check no file is still uploading
    const uploading = Object.values(kycFiles).some(f => f?.uploading) || businessPlanFile?.uploading
    if (uploading) { setFormError("Please wait for all files to finish uploading."); return }

    setKycSaving(true)
    try {
      // Build document list based on id type choices
      const docs: Array<{ documentType: string; fileUrl: string | null; fileName: string | null }> = []

      if (isPersonal) {
        if (personalIdType === 'passport') {
          docs.push({ documentType: 'passport', fileUrl: kycFiles['passport']?.objectPath || null, fileName: kycFiles['passport']?.fileName || null })
        } else {
          docs.push({ documentType: 'national_id_front', fileUrl: kycFiles['national_id_front']?.objectPath || null, fileName: kycFiles['national_id_front']?.fileName || null })
          docs.push({ documentType: 'national_id_back', fileUrl: kycFiles['national_id_back']?.objectPath || null, fileName: kycFiles['national_id_back']?.fileName || null })
        }
        docs.push({ documentType: 'proof_of_income', fileUrl: kycFiles['proof_of_income']?.objectPath || null, fileName: kycFiles['proof_of_income']?.fileName || null })
      } else {
        docs.push({ documentType: 'business_registration', fileUrl: kycFiles['business_registration']?.objectPath || null, fileName: kycFiles['business_registration']?.fileName || null })
        docs.push({ documentType: 'kra_certificate', fileUrl: kycFiles['kra_certificate']?.objectPath || null, fileName: kycFiles['kra_certificate']?.fileName || null })
        if (directorIdType === 'passport') {
          docs.push({ documentType: 'director_passport', fileUrl: kycFiles['director_passport']?.objectPath || null, fileName: kycFiles['director_passport']?.fileName || null })
        } else {
          docs.push({ documentType: 'director_id_front', fileUrl: kycFiles['director_id_front']?.objectPath || null, fileName: kycFiles['director_id_front']?.fileName || null })
          docs.push({ documentType: 'director_id_back', fileUrl: kycFiles['director_id_back']?.objectPath || null, fileName: kycFiles['director_id_back']?.fileName || null })
        }
        docs.push({ documentType: 'business_bank_statement', fileUrl: kycFiles['business_bank_statement']?.objectPath || null, fileName: kycFiles['business_bank_statement']?.fileName || null })
      }

      // Include business plan if uploaded in step 2
      if (businessPlanFile?.objectPath) {
        docs.push({ documentType: 'business_plan', fileUrl: businessPlanFile.objectPath, fileName: businessPlanFile.fileName || null })
      }

      await saveKycDocuments(createdAppId, docs)
      setStep(4)
    } catch {
      setFormError("Failed to save documents. Please try again.")
    } finally {
      setKycSaving(false)
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!createdAppId) return
    setFormError("")
    paymentMut.mutate({ id: createdAppId, data: { paymentCode } }, {
      onSuccess: () => setStep(5),
      onError: (err: any) => setFormError(err?.data?.error || err?.message || "Payment verification failed.")
    })
  }

  const uploadedCount = Object.values(kycFiles).filter(f => f?.objectPath && !f.uploading).length

  const stepLabels = ["Select", "Details", "Documents", "Payment", "Done"]

  return (
    <div className="min-h-screen bg-background py-16 pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Progress bar */}
        <div className="mb-14">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10 rounded-full" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
            />
            {stepLabels.map((_, i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border-2 border-border text-muted-foreground'}`}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-semibold text-muted-foreground">
            {stepLabels.map((label, i) => (
              <span key={label} className={step >= i + 1 ? "text-primary" : ""}>{label}</span>
            ))}
          </div>
        </div>

        {/* ── STEP 1: Product ── */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold">Select Your Product</h1>
              <p className="text-muted-foreground mt-2">Choose the right U.S. funding product for your Kenyan goals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.entries(PRODUCTS) as [ProductKey, typeof PRODUCTS[ProductKey]][]).map(([key, prod]) => {
                const Icon = prod.icon
                return (
                  <Card key={key} className="cursor-pointer group hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden" onClick={() => handleProductSelect(key)}>
                    {prod.type === 'loan' && (
                      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-bl-xl z-10">65% PRE-APPROVED</div>
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

        {/* ── STEP 2: Details ── */}
        {step === 2 && productDef && (
          <Card className="animate-in fade-in slide-in-from-right-8 duration-500 shadow-xl shadow-primary/5">
            <CardHeader className="border-b border-border bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{createdAppId ? 'Edit Application' : `${productDef.title} Application`}</CardTitle>
                  <CardDescription>{createdAppId ? 'Review and update your details, then continue.' : 'Provide accurate information for fast processing.'}</CardDescription>
                </div>
                {!createdAppId && (
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {formError && (
                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20 mb-6">
                  <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                </div>
              )}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Requested Amount (USD $)</label>
                  <Input type="number" min={productDef.min} max={productDef.max} required value={appData.amountRequested} onChange={e => setAppData({ ...appData, amountRequested: e.target.value })} className="text-lg font-bold h-12" />
                  <p className="text-xs text-muted-foreground">Between {formatCurrency(productDef.min)} and {formatCurrency(productDef.max)} USD</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-border">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Full Name</label>
                    <Input required value={appData.fullName || ''} onChange={e => setAppData({ ...appData, fullName: e.target.value })} placeholder="As on your ID" />
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
                    <label className="text-sm font-semibold">National ID / Passport Number</label>
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
                    required value={appData.reason || ''} onChange={e => setAppData({ ...appData, reason: e.target.value })}
                    placeholder="Describe how you plan to use these funds..."
                  />
                </div>

                {/* Business Plan Upload */}
                <div className="space-y-2 p-5 rounded-xl border border-dashed border-border bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-primary" />
                    <label className="text-sm font-semibold">Business Plan <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload a business plan, proposal, or any supporting document that explains your intended use of funds. This helps reviewers understand your project and may improve your approval outcome. Accepted: PDF, DOCX, JPG, PNG.
                  </p>
                  <FileUploadField
                    label=""
                    hint="PDF, Word document, or image — max 10 MB"
                    uploaded={businessPlanFile}
                    onChange={setBusinessPlanFile}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-12 font-bold" disabled={createMut.isPending}>
                  {createMut.isPending
                    ? <Loader2 className="h-5 w-5 animate-spin" />
                    : createdAppId
                      ? <>Save Changes & Continue <ChevronRight className="ml-2 h-5 w-5" /></>
                      : <>Continue to Document Upload <ChevronRight className="ml-2 h-5 w-5" /></>
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 3: KYC / KYB Documents ── */}
        {step === 3 && productDef && createdAppId && (
          <Card className="animate-in fade-in slide-in-from-right-8 duration-500 shadow-xl shadow-primary/5">
            <CardHeader className="border-b border-border bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    {isPersonal ? 'KYC' : 'KYB'} Document Upload
                  </CardTitle>
                  <CardDescription>
                    Upload clear, legible copies of each document. Accepted formats: JPG, PNG, PDF.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {formError && (
                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2 border border-destructive/20 mb-6">
                  <AlertCircle className="h-4 w-4 shrink-0" />{formError}
                </div>
              )}
              <form onSubmit={handleKycSubmit} className="space-y-8">

                {isPersonal ? (
                  <>
                    {/* Identity Document */}
                    <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/20">
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Identity Document</h3>
                        <p className="text-sm text-muted-foreground mb-3">Select your ID document type:</p>
                        <IdTypeSelector value={personalIdType} onChange={v => { setPersonalIdType(v); setKycFiles(prev => ({ ...prev, passport: null, national_id_front: null, national_id_back: null })) }} />
                      </div>
                      {personalIdType === 'passport' ? (
                        <FileUploadField label="Passport — Bio-Data Page" hint="The photo page of your passport (colour scan or clear photo)" uploaded={kycFiles['passport'] || null} onChange={v => setDoc('passport', v)} />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FileUploadField label="National ID — Front Side" uploaded={kycFiles['national_id_front'] || null} onChange={v => setDoc('national_id_front', v)} />
                          <FileUploadField label="National ID — Back Side" uploaded={kycFiles['national_id_back'] || null} onChange={v => setDoc('national_id_back', v)} />
                        </div>
                      )}
                    </div>

                    {/* Proof of Income */}
                    <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/20">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Proof of Income</h3>
                      <FileUploadField label="Payslip or Bank Statement (last 3 months)" hint="Your most recent payslip or last 3 months' bank statements" uploaded={kycFiles['proof_of_income'] || null} onChange={v => setDoc('proof_of_income', v)} />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Business Documents */}
                    <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/20">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Business Registration</h3>
                      <FileUploadField label="Certificate of Incorporation / Business Registration" hint="Official registration document from the Business Registration Service" uploaded={kycFiles['business_registration'] || null} onChange={v => setDoc('business_registration', v)} />
                    </div>

                    <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/20">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">KRA PIN Certificate</h3>
                      <FileUploadField label="KRA PIN Certificate for the Business" uploaded={kycFiles['kra_certificate'] || null} onChange={v => setDoc('kra_certificate', v)} />
                    </div>

                    <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/20">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Director / Owner Identity</h3>
                      <p className="text-sm text-muted-foreground">Select the principal director's ID document type:</p>
                      <IdTypeSelector value={directorIdType} onChange={v => { setDirectorIdType(v); setKycFiles(prev => ({ ...prev, director_passport: null, director_id_front: null, director_id_back: null })) }} />
                      {directorIdType === 'passport' ? (
                        <FileUploadField label="Director's Passport — Bio-Data Page" uploaded={kycFiles['director_passport'] || null} onChange={v => setDoc('director_passport', v)} />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FileUploadField label="Director's National ID — Front" uploaded={kycFiles['director_id_front'] || null} onChange={v => setDoc('director_id_front', v)} />
                          <FileUploadField label="Director's National ID — Back" uploaded={kycFiles['director_id_back'] || null} onChange={v => setDoc('director_id_back', v)} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/20">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Business Bank Statement</h3>
                      <FileUploadField label="Bank Statement — Last 3 Months" hint="Official bank statement for the business account" uploaded={kycFiles['business_bank_statement'] || null} onChange={v => setDoc('business_bank_statement', v)} />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2 border-t border-border">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    ← Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 h-12 font-bold" disabled={kycSaving || Object.values(kycFiles).some(f => f?.uploading)}>
                    {kycSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <>
                      {uploadedCount > 0 ? `Save ${uploadedCount} Document${uploadedCount > 1 ? 's' : ''} & Continue` : 'Continue to Payment'}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>}
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">Missing documents can be submitted later from your dashboard. Incomplete documents may delay processing.</p>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 4: Payment ── */}
        {step === 4 && productDef && createdAppId && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <Card className="md:col-span-3 border-primary/20 shadow-xl shadow-primary/5">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Smartphone className="h-6 w-6 text-accent" /> M-Pesa Payment Instructions
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">Pay the processing fee to activate your application review.</CardDescription>
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
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span>{s}</span>
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
                    <Input required value={paymentCode} onChange={e => setPaymentCode(e.target.value.toUpperCase())} placeholder="e.g. QKT5B9XX7L" className="font-mono text-lg uppercase tracking-widest bg-white h-12" />
                  </div>
                  <Button type="submit" size="lg" className="w-full mt-4 font-bold" disabled={paymentMut.isPending}>
                    {paymentMut.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="bg-muted/30 border-border">
                <CardHeader><CardTitle className="text-lg">Application Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Product", value: productDef.title },
                    { label: "Amount (USD)", value: formatCurrency(appData.amountRequested) },
                    { label: "Country", value: "🇰🇪 Kenya" },
                    { label: "Reference", value: `APP-${createdAppId}` },
                    { label: "Documents", value: `${uploadedCount} uploaded` },
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
                  <p className="text-muted-foreground">After payment you'll receive a <strong>65% pre-approval</strong> for{" "}
                    <strong className="text-primary">{formatCurrency(Number(appData.amountRequested) * 0.65)} USD</strong>.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5: Done ── */}
        {step === 5 && productDef && (
          <div className="animate-in zoom-in-95 duration-700 max-w-2xl mx-auto text-center mt-8">
            <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-secondary" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Application Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Reference: <strong className="text-primary font-mono">APP-{createdAppId}</strong>. Your M-Pesa payment has been received and your application is now under review.
            </p>
            {productDef.type === 'loan' && (
              <Card className="border-accent bg-accent/5 shadow-xl mb-8 overflow-hidden relative text-left">
                <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                <CardContent className="p-8">
                  <p className="text-accent-foreground font-bold text-xs uppercase tracking-widest mb-2">Instant Pre-Approval Decision</p>
                  <div className="text-4xl font-display font-extrabold text-primary mb-3">{formatCurrency(Number(appData.amountRequested) * 0.65)} USD</div>
                  <p className="text-muted-foreground">You are <strong>65% pre-approved</strong> based on automated criteria. Final approval pending full review.</p>
                </CardContent>
              </Card>
            )}
            <div className="bg-muted p-6 rounded-2xl mb-8 text-left">
              <h4 className="font-bold mb-4">What happens next?</h4>
              <ul className="space-y-4">
                {[
                  "Our U.S.-based underwriting team will review your complete profile and documents within <strong>2–3 business days</strong>.",
                  "You'll receive a dashboard notification with your final approval decision.",
                  "Upon final approval, USD funds are disbursed within <strong>14 days</strong>.",
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
