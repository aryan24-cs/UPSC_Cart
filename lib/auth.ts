import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

export const SESSION_COOKIE_NAME = "upsc_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "upsc-cart-secret-key-prod-secure-32ch";

// Password Hashing using standard scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Session Token Signing & Verification
export function signSession(userId: string): string {
  const timestamp = Date.now();
  const payload = `${userId}:${timestamp}`;
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${payload}:${signature}`;
}

export function verifySession(token: string): string | null {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;
    const [userId, timestampStr, signature] = parts;
    const payload = `${userId}:${timestampStr}`;
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const timestamp = parseInt(timestampStr, 10);
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > THIRTY_DAYS) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

// Cookie Session Management
export async function createSession(userId: string) {
  const cookieStore = await cookies();
  const token = signSession(userId);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// User Retrieval (No fake fallback: returns null if unauthenticated)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const userId = verifySession(token);
    if (!userId) return null;

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error("Error retrieving current user:", error);
    return null;
  }
}

// Server-side Authorization Guards
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN_ADMIN_REQUIRED");
  }
  return user;
}

export function hasRole(user: { role: string } | null, role: string): boolean {
  return user?.role === role;
}
