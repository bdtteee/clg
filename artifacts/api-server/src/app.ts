import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import router from "./routes/index.js";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const app: Express = express();

const isProduction = process.env.NODE_ENV === "production";

// Trust the TLS-terminating proxy in front of the app (Vercel / Render).
// Required so that `secure` cookies are issued and X-Forwarded-Proto is honored.
app.set("trust proxy", 1);

// Known production frontends. Additional origins can be supplied via the
// FRONTEND_URL env var (comma-separated). Any *.vercel.app deployment and the
// local dev servers are always permitted.
const productionOrigins = [
  "https://cardoneloansgrants.org",
  "https://www.cardoneloansgrants.org",
];

const devOrigins = ["http://localhost:5173", "http://localhost:3000"];

const configuredOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set<string>([
  ...configuredOrigins,
  ...productionOrigins,
  ...devOrigins,
]);

function isAllowedOrigin(origin: string): boolean {
  const normalized = origin.replace(/\/$/, "");
  if (allowedOrigins.has(normalized)) return true;
  try {
    const { hostname } = new URL(normalized);
    // Allow Vercel preview and production deployments.
    if (hostname === "vercel.app" || hostname.endsWith(".vercel.app")) return true;
  } catch {
    /* malformed origin — fall through to deny */
  }
  return false;
}

app.use(cors({
  origin: (origin, cb) => {
    // Requests without an Origin header (same-origin navigations, curl,
    // server-to-server) are always allowed.
    if (!origin) return cb(null, true);
    if (isAllowedOrigin(origin)) return cb(null, true);
    // Deny by withholding CORS headers rather than throwing: a thrown error
    // becomes an opaque 500 that the browser reports as "Failed to fetch".
    return cb(null, false);
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "cardone-loans-secret-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

app.use("/api", router);

export default app;
