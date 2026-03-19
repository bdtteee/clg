import { useAdminGetPayments, useAdminVerifyPayment, getAdminGetPaymentsQueryKey } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { format } from "date-fns"
import { Loader2, ArrowLeft, CheckCircle, Clock, CreditCard, ShieldCheck } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export function AdminPayments() {
  const { data: payments, isLoading } = useAdminGetPayments()
  const verifyMut = useAdminVerifyPayment()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const handleVerify = (id: number) => {
    verifyMut.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetPaymentsQueryKey() })
        toast({ title: "Payment verified successfully. Application moved to Under Review." })
      },
      onError: () => {
        toast({ title: "Failed to verify payment", variant: "destructive" })
      }
    })
  }

  const verified = payments?.filter(p => p.isVerified) ?? []
  const pending = payments?.filter(p => !p.isVerified) ?? []
  const totalKes = payments?.reduce((sum, p) => sum + p.amountKes, 0) ?? 0

  if (isLoading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Payment Verification</h1>
        <p className="text-muted-foreground">Review and verify M-Pesa manual payments submitted by applicants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-2xl font-display font-bold">KES {totalKes.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-warning/20 rounded-xl">
              <Clock className="h-6 w-6 text-warning-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Awaiting Verification</p>
              <p className="text-2xl font-display font-bold text-warning-foreground">{pending.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-success/20 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-display font-bold text-success">{verified.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {pending.length > 0 && (
        <Card className="mb-8 border-warning/30">
          <CardHeader className="bg-warning/10 border-b border-warning/20">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning-foreground" />
              Pending Verification ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Applicant</th>
                    <th className="px-6 py-3">M-Pesa Code</th>
                    <th className="px-6 py-3">Amount (KES)</th>
                    <th className="px-6 py-3">Application</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pending.map(p => (
                    <tr key={p.id} className="hover:bg-warning/5 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {format(new Date(p.createdAt), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{p.userName}</div>
                        <div className="text-xs text-muted-foreground">{p.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold bg-muted px-2 py-1 rounded text-sm tracking-wider">
                          {p.mpesaConfirmationCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {p.amountKes.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {p.applicationId ? (
                          <Link href={`/admin/applications/${p.applicationId}`}>
                            <span className="text-primary hover:underline font-mono text-sm">APP-{p.applicationId}</span>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          className="bg-success text-white hover:bg-success/90"
                          onClick={() => handleVerify(p.id)}
                          disabled={verifyMut.isPending}
                        >
                          {verifyMut.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Verify
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            Verified Payments ({verified.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {verified.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">No verified payments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Applicant</th>
                    <th className="px-6 py-3">M-Pesa Code</th>
                    <th className="px-6 py-3">Amount (KES)</th>
                    <th className="px-6 py-3">Application</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {verified.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {format(new Date(p.createdAt), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{p.userName}</div>
                        <div className="text-xs text-muted-foreground">{p.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold bg-muted px-2 py-1 rounded text-sm tracking-wider">
                          {p.mpesaConfirmationCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {p.amountKes.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {p.applicationId ? (
                          <Link href={`/admin/applications/${p.applicationId}`}>
                            <span className="text-primary hover:underline font-mono text-sm">APP-{p.applicationId}</span>
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success" className="gap-1">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
