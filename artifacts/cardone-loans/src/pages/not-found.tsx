import { useEffect } from "react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | Cardone Loans & Grants";
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="inline-flex items-center justify-center rounded-xl bg-primary text-white font-semibold px-6 py-3 hover:bg-primary/90 transition-colors w-full sm:w-auto">
              Go to Homepage
            </button>
          </Link>
          <Link href="/loans">
            <button className="inline-flex items-center justify-center rounded-xl border border-border text-foreground font-semibold px-6 py-3 hover:bg-muted transition-colors w-full sm:w-auto">
              View Loans & Grants
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
