import { useGetApplication, getGetApplicationQueryKey } from "@workspace/api-client-react"
import { useRoute } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { Loader2, ArrowLeft, Building2, User, FileText, Calendar, Zap, MessageSquare, ExternalLink, CheckCircle2, Clock, XCircle, Upload } from "lucide-react"
import { Link } from "wouter"

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || ""

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved': return <Badge variant="success" className="text-sm px-3 py-1">Approved</Badge>
    case 'rejected': return <Badge variant="destructive" className="text-sm px-3 py-1">Rejected</Badge>
    case 'under_review': return <Badge variant="secondary" className="text-sm px-3 py-1">Under Review</Badge>
    default: return <Badge variant="warning" className="text-sm px-3 py-1">Pending Review</Badge>
  }
}

function DocStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Approved':
      return <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full"><CheckCircle2 className="h-3 w-3" />Approved</span>
    case 'Rejected':
      return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><XCircle className="h-3 w-3" />Rejected</span>
    case 'Not Uploaded':
      return <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"><Upload className="h-3 w-3" />Not Uploaded</span>
    default:
      return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3" />Pending Review</span>
  }
}

function useKycDocuments(appId: number) {
  return useQuery({
    queryKey: ["kyc-documents", appId],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/applications/${appId}/kyc-documents`, { credentials: "include" })
      if (!res.ok) return []
      return res.json()
    },
    enabled: !!appId,
  })
}

export function ApplicationDetail() {
  const [, params] = useRoute("/applications/:id")
  const id = Number(params?.id)
  
  const { data: app, isLoading } = useGetApplication(id, { query: { queryKey: getGetApplicationQueryKey(id), enabled: !!id } })
  const { data: kycDocs = [] } = useKycDocuments(id)

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  if (!app) return <div className="p-12 text-center">Application not found</div>

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono bg-muted px-2 py-1 rounded text-sm text-muted-foreground font-semibold">APP-{app.id}</span>
            <StatusBadge status={app.status} />
          </div>
          <h1 className="text-4xl font-display font-bold capitalize">{app.category} {app.type}</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Submitted on {format(new Date(app.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg text-right min-w-[200px]">
          <p className="text-primary-foreground/70 text-sm font-medium mb-1">Requested Amount</p>
          <p className="text-3xl font-display font-bold">{formatCurrency(app.amountRequested)}</p>
        </div>
      </div>

      {app.adminComment && (
        <Card className="mb-8 border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6 flex gap-4">
            <MessageSquare className="h-6 w-6 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-foreground mb-1">Message from Underwriting Team</h4>
              <p className="text-muted-foreground">{app.adminComment}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {app.type === 'loan' && (
        <Card className="mb-8 border-accent bg-accent/5">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-accent-foreground flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-accent" /> 65% Pre-Approval Active
              </h3>
              <p className="text-muted-foreground text-sm max-w-lg">
                Based on our preliminary automated underwriting, this loan has secured a 65% pre-approval guarantee pending final verification.
              </p>
            </div>
            <div className="text-3xl font-display font-black text-primary bg-white px-6 py-3 rounded-xl shadow-sm border border-accent/20">
              {formatCurrency(app.amountRequested * 0.65)}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg">
              {app.category === 'personal' ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
              {app.category === 'personal' ? 'Applicant Details' : 'Business Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border">
            <div className="grid grid-cols-3 p-4">
              <span className="text-muted-foreground text-sm col-span-1">Name</span>
              <span className="font-medium col-span-2 text-right">{app.fullName || app.businessName}</span>
            </div>
            <div className="grid grid-cols-3 p-4">
              <span className="text-muted-foreground text-sm col-span-1">ID / Reg No.</span>
              <span className="font-medium col-span-2 text-right">{app.nationalId || app.registrationNumber}</span>
            </div>
            <div className="grid grid-cols-3 p-4">
              <span className="text-muted-foreground text-sm col-span-1">Contact</span>
              <span className="font-medium col-span-2 text-right">{app.phoneNumber}</span>
            </div>
            {app.category === 'personal' ? (
              <>
                <div className="grid grid-cols-3 p-4">
                  <span className="text-muted-foreground text-sm col-span-1">Employment</span>
                  <span className="font-medium col-span-2 text-right">{app.employmentStatus}</span>
                </div>
                <div className="grid grid-cols-3 p-4">
                  <span className="text-muted-foreground text-sm col-span-1">Income</span>
                  <span className="font-medium col-span-2 text-right">{app.monthlyIncome ? formatCurrency(app.monthlyIncome) : '-'} / mo</span>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 p-4">
                <span className="text-muted-foreground text-sm col-span-1">Annual Rev.</span>
                <span className="font-medium col-span-2 text-right">{app.annualRevenue ? formatCurrency(app.annualRevenue) : '-'}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" /> Processing & Purpose
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Payment Reference</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-lg tracking-widest text-center border border-border">
                  {app.paymentCode || 'PENDING'}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Declared Purpose</h4>
                <p className="text-foreground leading-relaxed p-4 bg-background rounded-lg border border-border">
                  {app.purposeOfFunds || app.reason}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KYC/KYB Documents Section */}
      <Card>
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {app.category === 'business' ? 'KYB' : 'KYC'} Documents
          </CardTitle>
          <CardDescription>
            Documents submitted for identity and verification. Our team reviews these within 2–3 business days.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {kycDocs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No documents submitted yet.</p>
              <p className="text-sm mt-1">Documents are submitted during the application process.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {kycDocs.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm capitalize">{doc.documentType.replace(/_/g, ' ')}</p>
                      {doc.rejectionReason && (
                        <p className="text-xs text-destructive mt-0.5">Reason: {doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DocStatusBadge status={doc.status} />
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
