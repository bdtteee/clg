import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { useGetMe, useLogout } from "@workspace/api-client-react"
import { Building2, Menu, X, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getGetMeQueryKey } from "@workspace/api-client-react"

export function Navbar() {
  const [location, setLocation] = useLocation()
  const { data: user, isLoading } = useGetMe()
  const logoutMutation = useLogout()
  const queryClient = useQueryClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isHome = location === "/"

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        setLocation("/")
      }
    })
  }

  const closeMenu = () => setIsMobileMenuOpen(false)

  const navClass = isHome && !scrolled
    ? "bg-primary/0 border-white/10"
    : "bg-background/95 backdrop-blur-md border-border/50 shadow-sm"

  const linkClass = isHome && !scrolled
    ? "text-white/80 hover:text-white"
    : "text-muted-foreground hover:text-primary"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${navClass}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex shrink-0 items-center">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg group-hover:scale-105 transition-transform ${isHome && !scrolled ? "bg-white/15 text-white" : "bg-primary text-white"}`}>
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={`font-display text-[13px] font-extrabold tracking-widest uppercase ${isHome && !scrolled ? "text-white" : "text-primary"}`}>
                  Cardone
                </span>
                <span className={`font-display text-[10px] font-semibold tracking-widest uppercase ${isHome && !scrolled ? "text-accent" : "text-accent-foreground"}`}>
                  Loans & Grants
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-7">
            <Link href="/about" className={`text-sm font-medium transition-colors ${linkClass}`}>About</Link>

            {/* Products Dropdown */}
            <div className="relative" ref={productsRef}>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${linkClass}`}
              >
                Products <ChevronDown className={`h-3.5 w-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white border border-border rounded-2xl shadow-xl p-2 z-50">
                  <Link href="/loans" onClick={() => setProductsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium text-foreground transition-colors">
                    💼 Loans
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">$10K – $100K USD</span>
                  </Link>
                  <Link href="/grants" onClick={() => setProductsOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium text-foreground transition-colors">
                    🎁 Grants
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">$2K – $30K USD · Non-repayable</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/how-it-works" className={`text-sm font-medium transition-colors ${linkClass}`}>How It Works</Link>
            <Link href="/faq" className={`text-sm font-medium transition-colors ${linkClass}`}>FAQ</Link>
            <Link href="/contact" className={`text-sm font-medium transition-colors ${linkClass}`}>Contact</Link>

            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === 'admin' ? "/admin" : "/dashboard"}
                  className={`text-sm font-semibold transition-colors ${isHome && !scrolled ? "text-accent hover:text-accent/80" : "text-primary hover:text-primary/80"}`}
                >
                  {user.role === 'admin' ? "Admin Panel" : "My Dashboard"}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className={isHome && !scrolled ? "border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent" : ""}
                >
                  Log out
                </Button>
                <Link href="/apply">
                  <Button size="sm" variant="accent" className="text-primary font-bold">
                    Apply Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${linkClass}`}
                >
                  Log in
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className={isHome && !scrolled
                      ? "bg-accent text-primary hover:bg-accent/90 font-bold shadow-lg shadow-accent/20"
                      : "font-bold"
                    }
                  >
                    Get Started <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex items-center justify-center rounded-lg p-2 md:hidden ${isHome && !scrolled ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border shadow-xl">
          <div className="space-y-1 px-4 pb-6 pt-4">
            <Link href="/about" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">About Us</Link>
            <Link href="/loans" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">Loans ($10K–$100K)</Link>
            <Link href="/grants" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">Grants ($2K–$30K)</Link>
            <Link href="/how-it-works" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">How It Works</Link>
            <Link href="/faq" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">FAQ</Link>
            <Link href="/contact" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">Contact</Link>

            <div className="mt-4 pt-4 border-t border-border space-y-3">
              {user ? (
                <>
                  <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-semibold text-primary hover:bg-muted">
                    {user.role === 'admin' ? "Admin Panel" : "My Dashboard"}
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => { handleLogout(); closeMenu() }}>Log out</Button>
                  <Link href="/apply" onClick={closeMenu}>
                    <Button variant="accent" className="w-full text-primary font-bold">Apply Now</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={closeMenu}>
                    <Button className="w-full font-bold">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
