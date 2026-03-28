import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { useGetMe, useLogout } from "@workspace/api-client-react"
import { Building2, Menu, X, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getGetMeQueryKey } from "@workspace/api-client-react"

export function Navbar() {
  const [location, setLocation] = useLocation()
  const { data: user, isLoading } = useGetMe()
  const logoutMutation = useLogout()
  const queryClient = useQueryClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isHome = location === "/"

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear()
        window.location.href = "/"
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

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/loans", label: "Loans" },
    { href: "/grants", label: "Grants" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${navClass}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
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

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${linkClass} ${
                  (location === link.href || location.startsWith(link.href + "/"))
                    ? isHome && !scrolled ? "text-white font-semibold" : "text-primary font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

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
                <Link href="/login" className={`text-sm font-medium transition-colors ${linkClass}`}>
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex items-center justify-center rounded-lg p-2 md:hidden ${isHome && !scrolled ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border shadow-xl">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}

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
