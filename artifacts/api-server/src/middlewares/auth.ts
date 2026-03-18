import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

const jwtSecret = process.env.SESSION_SECRET;

export function signToken(userId: number, userRole: string): string {
  if (!jwtSecret) throw new Error("SESSION_SECRET is required");
  return jwt.sign({ userId, userRole }, jwtSecret, { expiresIn: "7d" });
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!jwtSecret) {
    res.status(500).json({ error: "Server misconfiguration: SESSION_SECRET missing" });
    return;
  }

  const token = req.cookies?.auth_token;
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      userRole: string;
    };
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  requireAuth(req, res, () => {
    if (req.userRole !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}
