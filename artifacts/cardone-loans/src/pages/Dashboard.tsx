import { useState } from "react"
import { useGetApplications, useGetNotifications, useMarkNotificationRead, useLogout, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { apiUrl } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { Link, useLocation } from "wouter"
import { format } from "date-fns"
import { Bell, FileText, PlusCircle, ArrowRight, Loader2, Info, AlertCircle, PlayCircle, LogOut, Wallet, Banknote } from "lucide-react"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { getGetNotificationsQueryKey } from "@workspace/api-client-react"

function StatusBadge({ status, paymentCode }: { status: string; paymentCode?: string | null }) {
  if (status === 'pending' && !paymentCode) {
    return <Badge className="bg-orange-100 text-orange-700 border border-orange-200">Incomplete</Badge>
  }
  switch (status) {
    case 'approved': return <Badge variant="success">Approved</Badge>
    case 'rejected': return <Badge variant="destructive">Rejected</Badge>
    case 'under_review': return <Badge variant="secondary">Under Review</Badge>
    default: return <Badge variant="warning">Pending</Badge>
  }
}

function WithdrawStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'approved': return <Badge variant="secondary">Approved</Badge>
    case 'paid': return <Badge variant="success">Paid</Badge>
    case 'rejected': return <Badge variant="destructive">Rejected</Badge>
    default: return <Badge variant="warning">Pending</Badge>
  }
}

function WithdrawalsPanel({ apps }: { apps: any[] }) {
  const { toast } = useToast()

  const { data: accounts = [], refetch: refetchAccounts } = useQuery<any[]>({
    queryKey: ["payout-accounts"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/payout-accounts"), { credentials: "include" })
      if (!res.ok) return []
      return res.json()
    },
  })
  const { data: withdrawals = [], refetch: refetchWithdrawals } = useQuery<any[]>({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/withdrawals"), { credentials: "include" })
      if (!res.ok) return []
      return res.json()
    },
  })

  const [showAdd, setShowAdd] = useState(false)
  const [acct, setAcct] = useState({ accountHolderName: "", bankName: "", accountNumber: "", branch: "" })
  const [savingAcct, setSavingAcct] = useState(false)

  const [amount, setAmount] = useState("")
  const [accountId, setAccountId] = useState("")
  const [appId, setAppId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const eligibleApps = apps.filter(a => a.status !== 'rejected' && a.paymentCode)
  const available = eligibleApps.reduce((sum, a) => sum + (a.preapprovedAmount ?? a.amountRequested * 0.85), 0)

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!acct.accountHolderName.trim() || !acct.bankName.trim() || !acct.accountNumber.trim()) {
      setError("Account holder name, bank name, and account number are required."); return
    }
    setSavingAcct(true)
    try {
      const res = await fetch(apiUrl("/api/payout-accounts"), {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(acct),
      })
      if (!res.ok) { const b = await res.json().catch(() => ({})); setError(b.error || "Failed to add account"); return }
      setAcct({ accountHolderName: "", bankName: "", accountNumber: "", branch: "" })
      setShowAdd(false)
      refetchAccounts()
      toast({ title: "Bank account added" })
    } catch { setError("Failed to add account") }
    finally { setSavingAcct(false) }
  }

  const submitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!accountId) { setError("Select a payout account."); return }
    const amt = Number(amount)
    if (!amt || amt <= 0) { setError("Enter a valid amount."); return }
    setSubmitting(true)
    try {
      const res = await fetch(apiUrl("/api/withdrawals"), {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, payoutAccountId: Number(accountId), applicationId: appId || null }),
      })
      if (!res.ok) { const b = await res.json().catch(() => ({})); setError(b.error || "Failed to submit withdrawal"); return }
      setAmount(""); setAppId("")
      refetchWithdrawals()
      toast({ title: "Withdrawal request submitted" })
    } catch { setError("Failed to submit withdrawal") }
    finally { setSubmitting(false) }
  }

  return (
    <Card id="withdrawals" className="mt-8">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /> Payouts &amp; Withdrawals</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Payout Accounts</h3>
              {!showAdd && <Button size="sm" variant="outline" onClick={() => { setShowAdd(true); setError("") }}>+ Add bank account</Button>}
            </div>
            {accounts.length === 0 && !showAdd && (
              <p className="text-sm text-muted-foreground">No payout accounts yet. Add a bank account to request a withdrawal.</p>
            )}
            <div className="space-y-2">
              {accounts.map((a: any) => (
                <div key={a.id} className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-semibold">{a.bankName}</p>
                  <p className="text-muted-foreground">{a.accountHolderName} · ****{String(a.accountNumber).slice(-4)}{a.branch ? ` · ${a.branch}` : ""}</p>
                </div>
              ))}
            </div>
            {showAdd && (
              <form onSubmit={addAccount} className="mt-3 space-y-3 p-4 rounded-xl border border-dashed border-border bg-muted/20">
                <Input required placeholder="Account holder name" value={acct.accountHolderName} onChange={e => setAcct(s => ({ ...s, accountHolderName: e.target.value }))} />
                <Input required placeholder="Bank name" value={acct.bankName} onChange={e => setAcct(s => ({ ...s, bankName: e.target.value }))} />
                <Input required placeholder="Account number" value={acct.accountNumber} onChange={e => setAcct(s => ({ ...s, accountNumber: e.target.value }))} />
                <Input placeholder="Branch (optional)" value={acct.branch} onChange={e => setAcct(s => ({ ...s, branch: e.target.value }))} />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setShowAdd(false); setError("") }}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={savingAcct}>{savingAcct ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
                </div>
              </form>
            )}
          </div>

          <form onSubmit={submitWithdrawal} className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Request a Withdrawal</h3>
            <p className="text-xs text-muted-foreground">Available pre-approved balance: <strong className="text-primary">{formatCurrency(available)}</strong></p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount (USD)</label>
              <Input type="number" min={1} value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payout account</label>
              <select className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm" value={accountId} onChange={e => setAccountId(e.target.value)}>
                <option value="">Select account…</option>
                {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.bankName} · ****{String(a.accountNumber).slice(-4)}</option>)}
              </select>
            </div>
            {eligibleApps.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">For application (optional)</label>
                <select className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm" value={appId} onChange={e => setAppId(e.target.value)}>
                  <option value="">— None —</option>
                  {eligibleApps.map((a: any) => <option key={a.id} value={a.id}>APP-{a.id} · {a.category} {a.type}</option>)}
                </select>
              </div>
            )}
            {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting || accounts.length === 0}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Banknote className="h-4 w-4 mr-2" /> Submit Withdrawal Request</>}
            </Button>
            {accounts.length === 0 && <p className="text-xs text-muted-foreground text-center">Add a payout account first.</p>}
          </form>
        </div>

        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Withdrawal Requests</h3>
          {withdrawals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No withdrawal requests yet.</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w: any) => (
                <div key={w.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{w.currency} {Number(w.amount).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{w.payoutAccount ? `${w.payoutAccount.bankName} · ****${String(w.payoutAccount.accountNumber).slice(-4)}` : "—"}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(w.createdAt), 'MMM d, yyyy')}</p>
                    {w.adminComment && <p className="text-xs text-muted-foreground mt-1 italic">{w.adminComment}</p>}
                  </div>
                  <WithdrawStatusBadge status={w.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function UserDashboard() {
  const { data: apps, isLoading: appsLoading } = useGetApplications()
  const { data: notifications, isLoading: notifsLoading } = useGetNotifications()
  const { data: user } = useGetMe()
  const markReadMut = useMarkNotificationRead()
  const logoutMut = useLogout()
  const queryClient = useQueryClient()
  const [, setLocation] = useLocation()

  const unreadCount = notifications?.filter(n => !n.read).length || 0
  const incompleteCount = apps?.filter(a => a.status === 'pending' && !a.paymentCode).length || 0

  const handleRead = (id: number) => {
    markReadMut.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetNotificationsQueryKey() })
    })
  }

  const handleLogout = () => {
    logoutMut.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear()
        window.location.href = "/"
      }
    })
  }

  if (appsLoading || notifsLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Client Dashboard</h1>
          <p className="text-muted-foreground">
            {user?.email ? `Logged in as ${user.email}` : "Manage your applications and notifications"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => document.getElementById("withdrawals")?.scrollIntoView({ behavior: "smooth" })}>
            <Wallet className="mr-2 h-4 w-4" /> Withdraw
          </Button>
          <Link href="/apply">
            <Button variant="accent">
              <PlusCircle className="mr-2 h-4 w-4" /> New Application
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMut.isPending}
            className="text-muted-foreground hover:text-destructive hover:border-destructive/40"
          >
            {logoutMut.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <><LogOut className="mr-2 h-4 w-4" /> Log out</>
            }
          </Button>
        </div>
      </div>

      {incompleteCount > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
          <p className="text-sm text-orange-800 font-medium">
            You have <strong>{incompleteCount}</strong> incomplete application{incompleteCount > 1 ? 's' : ''}.
            Complete them below to submit for review.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Applications */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> My Applications
          </h2>

          {!apps || apps.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">Start your first application to get access to our targeted financial products.</p>
                <Link href="/apply">
                  <Button>Start Application</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {apps.map(app => {
                const isIncomplete = app.status === 'pending' && !app.paymentCode
                return (
                  <Card key={app.id} className={`overflow-hidden hover:shadow-md transition-shadow ${isIncomplete ? 'border-orange-200' : ''}`}>
                    {isIncomplete && (
                      <div className="bg-orange-50 px-6 py-2 border-b border-orange-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-orange-700 tracking-wider uppercase flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Action Required — Incomplete Application
                        </span>
                      </div>
                    )}
                    {!isIncomplete && app.status !== 'rejected' && (
                      <div className="bg-accent/10 px-6 py-2 border-b border-accent/20 flex justify-between items-center">
                        <span className="text-xs font-bold text-accent-foreground tracking-wider uppercase">Pre-approval Status Active</span>
                        <span className="text-sm font-bold text-primary">{formatCurrency(app.preapprovedAmount ?? app.amountRequested * 0.85)} Guarantee</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">APP-{app.id}</span>
                          <StatusBadge status={app.status} paymentCode={app.paymentCode} />
                        </div>
                        <h3 className="text-lg font-bold capitalize">{app.category} {app.type}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          Started on {format(new Date(app.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="text-2xl font-display font-bold text-foreground">
                          {formatCurrency(app.amountRequested)}
                        </div>
                        {isIncomplete ? (
                          <Link href={`/apply?resume=${app.id}`}>
                            <Button size="sm" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                              <PlayCircle className="mr-2 h-4 w-4" /> Edit & Submit
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/applications/${app.id}`}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Notifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2">{unreadCount} new</Badge>
            )}
          </div>

          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {!notifications || notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">You're all caught up!</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-4 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}`}
                    onClick={() => !n.read && handleRead(n.id)}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 shrink-0">
                        {n.read ? (
                          <Info className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <div className="relative">
                            <Bell className="h-5 w-5 text-primary" />
                            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-destructive"></span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <WithdrawalsPanel apps={apps || []} />
    </div>
  )
}
