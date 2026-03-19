import { useState } from "react"
import { useRoute, Link, useLocation } from "wouter"
import {
  useGetApplication,
  useApproveApplication,
  useRejectApplication,
  useAdminUpdateApplication,
  getAdminGetStatsQueryKey,
  getGetApplicationQueryKey,
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { Loader2, ArrowLeft, CheckCircle2, XCircle, Save, Edit2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export function AdminApplicationDetail() {
  const [, params] = useRoute("/admin/applications/:id")
  const id = Number(params?.id)
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [reason, setReason] = useState("")
  const [showActionForm, setShowActionForm] = useState<'approve' | 'reject' | null>(null)

  const [editMode, setEditMode] = useState(false)
  const [editFields, setEditFields] = useState({
    assignedPartner: "",
    approvedAmount: "",
    disbursementDate: "",
    adminComment: "",
  })

  const { data: app, isLoading, refetch } = useGetApplication(id, {
    query: {
      queryKey: getGetApplicationQueryKey(id),
      enabled: !!id,
      onSuccess: (data: any) => {
        setEditFields({
          assignedPartner: data.assignedPartner || "",
          approvedAmount: data.approvedAmount ? String(data.approvedAmount) : "",
          disbursementDate: data.disbursementDate || "",
          adminComment: data.adminComment || "",
        })
      },
    }
  })

  const approveMut = useApproveApplication()
  const rejectMut = useRejectApplication()
  const updateMut = useAdminUpdateApplication()

  if (isLoading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
  if (!app) return <div className="p-12 text-center">Application not found</div>

  const handleAction = (type: 'approve' | 'reject') => {
    const mutation = type === 'approve' ? approveMut : rejectMut
    mutation.mutate({
      id,
      data: { reason: reason || (type === 'approve' ? 'Application meets all criteria.' : 'Does not meet underwriting requirements.') }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() })
        refetch()
        setShowActionForm(null)
        toast({ title: `Application ${type === 'approve' ? 'approved' : 'rejected'} successfully` })
      }
    })
  }

  const handleUpdate = () => {
    const payload: Record<string, unknown> = {}
    if (editFields.assignedPartner !== (app.assignedPartner || "")) payload.assignedPartner = editFields.assignedPartner || null
    if (editFields.approvedAmount !== (app.approvedAmount ? String(app.approvedAmount) : ""))
      payload.approvedAmount = editFields.approvedAmount ? parseFloat(editFields.approvedAmount) : null
    if (editFields.disbursementDate !== (app.disbursementDate || "")) payload.disbursementDate = editFields.disbursementDate || null
    if (editFields.adminComment !== (app.adminComment || "")) payload.adminComment = editFields.adminComment || null

    if (Object.keys(payload).length === 0) {
      setEditMode(false)
      return
    }

    updateMut.mutate({ id, data: payload as any }, {
      onSuccess: () => {
        refetch()
        setEditMode(false)
        toast({ title: "Application updated successfully" })
      },
      onError: () => {
        toast({ title: "Update failed", variant: "destructive" })
      }
    })
  }

  const isPending = approveMut.isPending || rejectMut.isPending

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold">APP-{app.id}</h1>
            <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'destructive' : 'warning'} className="text-sm">
              {app.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">Submitted {format(new Date(app.createdAt), 'PPpp')}</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {(app.status === 'pending' || app.status === 'under_review') && !showActionForm && (
            <>
              <Button variant="destructive" onClick={() => setShowActionForm('reject')}>
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button onClick={() => setShowActionForm('approve')} className="bg-success text-white hover:bg-success/90">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => {
            setEditFields({
              assignedPartner: (app as any).assignedPartner || "",
              approvedAmount: app.approvedAmount ? String(app.approvedAmount) : "",
              disbursementDate: (app as any).disbursementDate || "",
              adminComment: app.adminComment || "",
            })
            setEditMode(true)
          }}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit Details
          </Button>
        </div>
      </div>

      {showActionForm && (
        <Card className={`mb-8 border-2 ${showActionForm === 'approve' ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}`}>
          <CardContent className="p-6">
            <h3 className={`text-lg font-bold mb-4 ${showActionForm === 'approve' ? 'text-success' : 'text-destructive'}`}>
              {showActionForm === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Reason / Note to Client (Required)</label>
                <textarea
                  className="w-full min-h-[100px] rounded-xl border border-border bg-white px-4 py-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter details that will be visible to the applicant..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowActionForm(null)}>Cancel</Button>
                <Button
                  variant={showActionForm === 'approve' ? 'default' : 'destructive'}
                  className={showActionForm === 'approve' ? 'bg-success hover:bg-success/90' : ''}
                  onClick={() => handleAction(showActionForm)}
                  disabled={isPending || !reason.trim()}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Confirm {showActionForm === 'approve' ? 'Approval' : 'Rejection'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {editMode && (
        <Card className="mb-8 border-2 border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Edit Application Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-1">Assigned Partner / Lender</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm"
                  value={editFields.assignedPartner}
                  onChange={(e) => setEditFields(f => ({ ...f, assignedPartner: e.target.value }))}
                  placeholder="e.g. KCB Bank, Equity Bank"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Approved Amount (USD)</label>
                <input
                  type="number"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm"
                  value={editFields.approvedAmount}
                  onChange={(e) => setEditFields(f => ({ ...f, approvedAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Disbursement Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm"
                  value={editFields.disbursementDate}
                  onChange={(e) => setEditFields(f => ({ ...f, disbursementDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Admin Comment (visible to user)</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm"
                  value={editFields.adminComment}
                  onChange={(e) => setEditFields(f => ({ ...f, adminComment: e.target.value }))}
                  placeholder="Notes visible to the applicant..."
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button onClick={handleUpdate} disabled={updateMut.isPending}>
                {updateMut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle>Application Data</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr className="bg-background"><td className="px-6 py-4 font-medium text-muted-foreground w-1/3">Type</td><td className="px-6 py-4 font-bold capitalize">{app.category} {app.type}</td></tr>
                <tr className="bg-muted/10"><td className="px-6 py-4 font-medium text-muted-foreground">Requested Amount</td><td className="px-6 py-4 font-display font-bold text-xl text-primary">{formatCurrency(app.amountRequested)}</td></tr>
                {app.approvedAmount && (
                  <tr className="bg-success/5"><td className="px-6 py-4 font-medium text-muted-foreground">Approved Amount</td><td className="px-6 py-4 font-display font-bold text-xl text-success">{formatCurrency(app.approvedAmount)}</td></tr>
                )}
                <tr className="bg-background"><td className="px-6 py-4 font-medium text-muted-foreground">Name/Business</td><td className="px-6 py-4">{app.fullName || app.businessName}</td></tr>
                <tr className="bg-muted/10"><td className="px-6 py-4 font-medium text-muted-foreground">ID/Registration</td><td className="px-6 py-4">{(app as any).nationalId || app.registrationNumber}</td></tr>
                <tr className="bg-background"><td className="px-6 py-4 font-medium text-muted-foreground">Phone</td><td className="px-6 py-4">{app.phoneNumber}</td></tr>

                {app.category === 'personal' ? (
                  <>
                    <tr className="bg-muted/10"><td className="px-6 py-4 font-medium text-muted-foreground">Employment</td><td className="px-6 py-4">{app.employmentStatus}</td></tr>
                    <tr className="bg-background"><td className="px-6 py-4 font-medium text-muted-foreground">Monthly Income</td><td className="px-6 py-4">{app.monthlyIncome ? formatCurrency(app.monthlyIncome) : '-'}</td></tr>
                  </>
                ) : (
                  <tr className="bg-muted/10"><td className="px-6 py-4 font-medium text-muted-foreground">Annual Revenue</td><td className="px-6 py-4">{app.annualRevenue ? formatCurrency(app.annualRevenue) : '-'}</td></tr>
                )}

                {(app as any).assignedPartner && (
                  <tr className="bg-accent/5"><td className="px-6 py-4 font-medium text-muted-foreground">Assigned Partner</td><td className="px-6 py-4 font-semibold text-accent-foreground">{(app as any).assignedPartner}</td></tr>
                )}
                {(app as any).disbursementDate && (
                  <tr className="bg-muted/10"><td className="px-6 py-4 font-medium text-muted-foreground">Disbursement Date</td><td className="px-6 py-4">{(app as any).disbursementDate}</td></tr>
                )}

                <tr className="bg-background">
                  <td className="px-6 py-4 font-medium text-muted-foreground align-top">Purpose</td>
                  <td className="px-6 py-4 leading-relaxed">{app.purposeOfFunds}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-lg">Payment Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">M-Pesa Transaction Code</p>
              <div className="font-mono text-xl font-bold bg-muted p-3 rounded-lg text-center tracking-widest border border-border">
                {app.paymentCode || 'NOT SUBMITTED'}
              </div>
            </CardContent>
          </Card>

          {app.type === 'loan' && (
            <Card className="border-accent">
              <CardContent className="p-6">
                <p className="text-sm font-bold text-accent-foreground uppercase tracking-wider mb-2">System Calculation</p>
                <p className="text-muted-foreground text-sm mb-4">The system presented a 65% pre-approval to the user upon submission.</p>
                <div className="text-3xl font-display font-black text-primary">
                  {formatCurrency(app.amountRequested * 0.65)}
                </div>
              </CardContent>
            </Card>
          )}

          {app.adminComment && (
            <Card className="border-border">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-sm">Admin Note (Visible to User)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                {app.adminComment}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
