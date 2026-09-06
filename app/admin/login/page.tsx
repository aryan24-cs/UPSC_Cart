"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, AlertCircle, ArrowLeft, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your admin credentials.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, expectedRole: "ADMIN" }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Access denied. Administrator privileges required.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdmin = async () => {
    setIsDemoLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "ADMIN" }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin";
      } else {
        setError(data.error || "Failed to log in to demo admin.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error during demo login.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 sm:py-16 bg-[#FAFAF9]">
      <div className="w-full max-w-sm">
        {/* Back Link */}
        <Link
          href="/welcome"
          className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#18181B] mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to role selector
        </Link>

        {/* Card */}
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="text-center space-y-1">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F4F5] text-[#18181B] mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#18181B]">
              Administrator Portal
            </h1>
            <p className="text-xs text-[#71717A]">
              Secure authentication for platform moderators & admins
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@upsccart.in"
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#18181B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#18181B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#18181B] py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-black transition-colors disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Authenticating..." : "Login to Admin Dashboard"}</span>
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={isDemoLoading}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors disabled:opacity-50"
            >
              <span>{isDemoLoading ? "Entering admin..." : "Explore as Demo Admin"}</span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-[#71717A]">
            <Link href="/login" className="text-[#F97316] font-medium hover:underline">
              ← Return to Aspirant Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
