import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  useAdminGetStats,
  useApproveApplication,
  useRejectApplication,
  getAdminGetStatsQueryKey,
} from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Link } from "wouter"
import { format } from "date-fns"
import {
  Loader2, Users, FileText, CheckCircle, Clock, XCircle,
  CreditCard, Search, Filter, Eye, ThumbsUp, ThumbsDown,
  BarChart2, User, ShieldCheck, AlertCircle, X,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useToast } from "@/hooks/use-toast"

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || ""

type Tab = "overview" | "users" | "applications" | "payments"

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending": return <Badge variant="warning">Pending</Badge>
    case "under_review": return <Badge variant="secondary">Under Review</Badge>
    case "approved": return <Badge variant="success">Approved</Badge>
    case "rejected": return <Badge variant="destructive">Rejected</Badge>
    default: return <Badge>{status}</Badge>
  }
}

function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/admin/users`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch users")
      return res.json() as Promise<Array<{
        id: number; email: string; fullName: string; role: string;
        createdAt: string; applicationCount: number
      }>>
    },
  })
}

function useAdminApplications() {
  return useQuery({
    queryKey: ["admin-all-applications"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/admin/applications`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch applications")
      return res.json() as Promise<Array<{
        id: number; category: string; type: string; status: string;
        amountRequested: number; createdAt: string; updatedAt: string;
        userEmail: string; userFullName: string; paymentCode: string | null;
        adminComment: string | null; fullName: string | null; businessName: string | null;
      }>>
    },
  })
}

function useAdminPaymentsData() {
  return useQuery({
    queryKey: ["admin-payments-dashboard"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/admin/payments`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch payments")
      return res.json() as Promise<Array<{
        id: number; mpesaConfirmationCode: string; amountKes: number;
        isVerified: boolean; createdAt: string; userName: string;
        phoneNumber: string; applicationId: number | null;
      }>>
    },
  })
}

// ─── Inline Approve/Reject Modal ────────────────────────────────────────────
function ActionModal({
  appId, action, onClose, onDone,
}: { appId: number; action: "approve" | "reject"; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("")
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const approveMut = useApproveApplication()
  const rejectMut = useRejectApplication()
  const isPending = approveMut.isPending || rejectMut.isPending

  const handleSubmit = () => {
    const mutation = action === "approve" ? approveMut : rejectMut
    mutation.mutate({ id: appId, data: { reason: reason.trim() || (action === "approve" ? "Application meets all criteria." : "Does not meet underwriting requirements.") } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() })
        queryClient.invalidateQueries({ queryKey: ["admin-all-applications"] })
        toast({ title: `Application ${action === "approve" ? "approved" : "rejected"} successfully` })
        onDone()
      },
      onError: () => toast({ title: "Action failed", variant: "destructive" }),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className={`w-full max-w-md rounded-2xl bg-white shadow-2xl border-2 ${action === "approve" ? "border-green-200" : "border-red-200"}`}>
        <div className={`px-6 py-4 rounded-t-2xl ${action === "approve" ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-lg ${action === "approve" ? "text-green-700" : "text-red-700"}`}>
              {action === "approve" ? "Approve Application" : "Reject Application"} — APP-{appId}
            </h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Reason / Note to Applicant</label>
            <textarea
              className="w-full min-h-[100px] rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={action === "approve" ? "e.g. Application meets all underwriting criteria..." : "e.g. Insufficient documentation provided..."}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className={action === "approve" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm {action === "approve" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Overview Tab ────────────────────────────────────────────────────────────
function OverviewTab() {
  const { data: stats, isLoading } = useAdminGetStats()

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  if (!stats) return null

  const chartData = [
    { name: "Pending", count: stats.pendingApplications },
    { name: "Review", count: stats.underReviewApplications },
    { name: "Approved", count: stats.approvedApplications },
    { name: "Rejected", count: stats.rejectedApplications },
  ]

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-foreground/70 text-sm font-medium mb-1">Total Applications</p>
                <h3 className="text-3xl font-display font-bold">{stats.totalApplications}</h3>
              </div>
              <div className="p-2 bg-white/10 rounded-lg"><FileText className="h-5 w-5" /></div>
            </div>
            <div className="mt-4 flex gap-4 text-sm text-primary-foreground/80 border-t border-white/10 pt-4">
              <span>{stats.totalLoans} Loans</span>
              <span>{stats.totalGrants} Grants</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Needs Review</p>
                <h3 className="text-3xl font-display font-bold text-amber-600">{stats.pendingApplications + stats.underReviewApplications}</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg"><Clock className="h-5 w-5 text-amber-600" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Approved</p>
                <h3 className="text-3xl font-display font-bold text-green-600">{stats.approvedApplications}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Rejected</p>
                <h3 className="text-3xl font-display font-bold text-red-600">{stats.rejectedApplications}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg"><XCircle className="h-5 w-5 text-red-600" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Status Breakdown</CardTitle></CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                  <tr>
                    <th className="px-4 py-3">ID / Date</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono font-medium text-xs">APP-{app.id}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(app.createdAt), "MMM d, yy")}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{app.userFullName}</div>
                        <div className="text-xs text-muted-foreground">{app.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 capitalize text-sm font-medium">{app.category} {app.type}</td>
                      <td className="px-4 py-3 font-bold text-sm">{formatCurrency(app.amountRequested)}</td>
                      <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/applications/${app.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <Eye className="h-3 w-3" /> Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {stats.recentApplications.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No applications yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Users Tab ───────────────────────────────────────────────────────────────
function UsersTab() {
  const { data: users, isLoading } = useAdminUsers()
  const [search, setSearch] = useState("")

  const filtered = (users ?? []).filter(u =>
    !search ||
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Applications</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.fullName}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                          <ShieldCheck className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                          <User className="h-3 w-3" /> Applicant
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">{user.applicationCount}</span>
                      <span className="text-muted-foreground ml-1">application{user.applicationCount !== 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      {search ? `No users found matching "${search}"` : "No users registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Applications Tab ────────────────────────────────────────────────────────
function ApplicationsTab() {
  const { data: apps, isLoading } = useAdminApplications()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [actionModal, setActionModal] = useState<{ appId: number; action: "approve" | "reject" } | null>(null)

  const filtered = (apps ?? []).filter((a) => {
    const matchSearch = !search ||
      a.userFullName.toLowerCase().includes(search.toLowerCase()) ||
      a.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      String(a.id).includes(search)
    const matchStatus = statusFilter === "all" || a.status === statusFilter
    const matchType = typeFilter === "all" || a.type === typeFilter
    return matchSearch && matchStatus && matchType
  })

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <>
      {actionModal && (
        <ActionModal
          appId={actionModal.appId}
          action={actionModal.action}
          onClose={() => setActionModal(null)}
          onDone={() => setActionModal(null)}
        />
      )}

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Types</option>
              <option value="loan">Loans</option>
              <option value="grant">Grants</option>
            </select>
          </div>
          <span className="text-sm text-muted-foreground shrink-0">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                  <tr>
                    <th className="px-4 py-3">ID / Date</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-xs">APP-{app.id}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(app.createdAt), "MMM d, yy")}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{app.userFullName}</div>
                        <div className="text-xs text-muted-foreground">{app.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 capitalize font-medium">{app.category} {app.type}</td>
                      <td className="px-4 py-3 font-bold">{formatCurrency(app.amountRequested)}</td>
                      <td className="px-4 py-3">
                        {app.paymentCode ? (
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded border border-border">{app.paymentCode}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {(app.status === "pending" || app.status === "under_review") && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50 gap-1"
                                onClick={() => setActionModal({ appId: app.id, action: "approve" })}
                              >
                                <ThumbsUp className="h-3 w-3" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 gap-1"
                                onClick={() => setActionModal({ appId: app.id, action: "reject" })}
                              >
                                <ThumbsDown className="h-3 w-3" /> Reject
                              </Button>
                            </>
                          )}
                          <Link href={`/admin/applications/${app.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                              <Eye className="h-3 w-3" /> View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        {search || statusFilter !== "all" || typeFilter !== "all"
                          ? "No applications match your filters."
                          : "No applications submitted yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// ─── Payments Tab ────────────────────────────────────────────────────────────
function PaymentsTab() {
  const { data: payments, isLoading } = useAdminPaymentsData()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const handleVerify = async (id: number) => {
    try {
      const res = await fetch(`${BASE}/api/admin/payments/${id}/verify`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error()
      queryClient.invalidateQueries({ queryKey: ["admin-payments-dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["admin-all-applications"] })
      queryClient.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() })
      toast({ title: "Payment verified. Application moved to Under Review." })
    } catch {
      toast({ title: "Failed to verify payment", variant: "destructive" })
    }
  }

  if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  const pending = (payments ?? []).filter((p) => !p.isVerified)
  const verified = (payments ?? []).filter((p) => p.isVerified)
  const totalKes = (payments ?? []).reduce((s, p) => s + p.amountKes, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl"><CreditCard className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Total Received</p>
            <p className="text-xl font-bold">KES {totalKes.toLocaleString()}</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl"><Clock className="h-5 w-5 text-amber-600" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Awaiting Verification</p>
            <p className="text-xl font-bold text-amber-600">{pending.length}</p>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl"><ShieldCheck className="h-5 w-5 text-green-600" /></div>
          <div>
            <p className="text-xs text-muted-foreground">Verified</p>
            <p className="text-xl font-bold text-green-600">{verified.length}</p>
          </div>
        </CardContent></Card>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
              <Clock className="h-4 w-4" /> Pending Verification ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">M-Pesa Code</th>
                    <th className="px-4 py-3">Amount (KES)</th>
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pending.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(p.createdAt), "MMM d, yyyy HH:mm")}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{p.userName}</div>
                        <div className="text-xs text-muted-foreground">{p.phoneNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold bg-muted px-2 py-1 rounded text-xs tracking-wider">{p.mpesaConfirmationCode}</span>
                      </td>
                      <td className="px-4 py-3 font-bold">{p.amountKes.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {p.applicationId ? (
                          <Link href={`/admin/applications/${p.applicationId}`}>
                            <span className="text-primary hover:underline font-mono text-xs">APP-{p.applicationId}</span>
                          </Link>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs gap-1" onClick={() => handleVerify(p.id)}>
                          <CheckCircle className="h-3 w-3" /> Verify
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

      {/* Verified */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-600" /> Verified Payments ({verified.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {verified.length === 0 ? (
            <div className="px-6 py-10 text-center text-muted-foreground text-sm">No verified payments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-y border-border">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">M-Pesa Code</th>
                    <th className="px-4 py-3">Amount (KES)</th>
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {verified.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(p.createdAt), "MMM d, yyyy HH:mm")}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{p.userName}</div>
                        <div className="text-xs text-muted-foreground">{p.phoneNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold bg-muted px-2 py-1 rounded text-xs tracking-wider">{p.mpesaConfirmationCode}</span>
                      </td>
                      <td className="px-4 py-3 font-bold">{p.amountKes.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {p.applicationId ? (
                          <Link href={`/admin/applications/${p.applicationId}`}>
                            <span className="text-primary hover:underline font-mono text-xs">APP-{p.applicationId}</span>
                          </Link>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success" className="gap-1 text-xs">
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

// ─── Main Admin Dashboard ────────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const { data: stats } = useAdminGetStats()
  const { data: users } = useAdminUsers()
  const { data: apps } = useAdminApplications()
  const { data: payments } = useAdminPaymentsData()

  const pendingPayments = (payments ?? []).filter((p) => !p.isVerified).length
  const pendingApps = (apps ?? []).filter((a) => a.status === "pending" || a.status === "under_review").length

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: <BarChart2 className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" />, badge: users?.length },
    { id: "applications", label: "Applications", icon: <FileText className="h-4 w-4" />, badge: pendingApps || undefined },
    { id: "payments", label: "Payments", icon: <CreditCard className="h-4 w-4" />, badge: pendingPayments || undefined },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
        <p className="text-muted-foreground mt-1">Manage users, applications, payments, and platform activity.</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                activeTab === tab.id ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "applications" && <ApplicationsTab />}
      {activeTab === "payments" && <PaymentsTab />}
    </div>
  )
}
