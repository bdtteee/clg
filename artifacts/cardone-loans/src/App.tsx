import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Layout
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Loans from "@/pages/Loans";
import Grants from "@/pages/Grants";
import HowItWorks from "@/pages/HowItWorks";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import { Login, Register } from "@/pages/Auth";
import { AdminLogin } from "@/pages/AdminLogin";
import { ConfirmEmail } from "@/pages/ConfirmEmail";
import { ResetPassword } from "@/pages/ResetPassword";
import { Apply } from "@/pages/Apply";
import { UserDashboard } from "@/pages/Dashboard";
import { ApplicationDetail } from "@/pages/ApplicationDetail";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminApplicationDetail } from "@/pages/AdminApplicationDetail";
import { AdminPayments } from "@/pages/AdminPayments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Pages that use their own full-screen layout (no Navbar/Footer)
const FULL_SCREEN_PATHS = ["/login", "/register", "/admin-login", "/confirm-email", "/reset-password"];

function Router() {
  return (
    <Switch>
      {/* Full-screen auth/info pages (no Navbar/Footer) */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/confirm-email" component={ConfirmEmail} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Standard pages with Navbar + Footer */}
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/loans" component={Loans} />
                <Route path="/grants" component={Grants} />
                <Route path="/how-it-works" component={HowItWorks} />
                <Route path="/contact" component={Contact} />
                <Route path="/faq" component={FAQ} />
                <Route path="/terms" component={Terms} />
                <Route path="/privacy" component={Privacy} />

                {/* Protected User Routes */}
                <Route path="/apply">
                  {() => (
                    <ProtectedRoute>
                      <Apply />
                    </ProtectedRoute>
                  )}
                </Route>
                <Route path="/dashboard">
                  {() => (
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  )}
                </Route>
                <Route path="/applications/:id">
                  {() => (
                    <ProtectedRoute>
                      <ApplicationDetail />
                    </ProtectedRoute>
                  )}
                </Route>

                {/* Protected Admin Routes */}
                <Route path="/admin">
                  {() => (
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  )}
                </Route>
                <Route path="/admin/applications/:id">
                  {() => (
                    <ProtectedRoute requireAdmin>
                      <AdminApplicationDetail />
                    </ProtectedRoute>
                  )}
                </Route>
                <Route path="/admin/payments">
                  {() => (
                    <ProtectedRoute requireAdmin>
                      <AdminPayments />
                    </ProtectedRoute>
                  )}
                </Route>

                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
