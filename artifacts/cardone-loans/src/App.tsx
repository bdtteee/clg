import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
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

// Routes that render with NO chrome (no Navbar/Footer)
const NO_CHROME_PATHS = [
  "/login", "/register", "/admin-login", "/confirm-email", "/reset-password",
  "/dashboard", "/apply", "/applications",
];

function useShouldHideChrome() {
  const [location] = useLocation()
  return NO_CHROME_PATHS.some(p => location === p || location.startsWith(p + "/"))
}

function Router() {
  const hideChrome = useShouldHideChrome()

  return (
    <Switch>
      {/* Full-screen auth pages */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/confirm-email" component={ConfirmEmail} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Logged-in client pages (no Navbar/Footer) */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/apply">
        {() => (
          <ProtectedRoute>
            <Apply />
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

      {/* All other pages with Navbar + Footer */}
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
