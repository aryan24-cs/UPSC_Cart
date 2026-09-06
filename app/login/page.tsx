"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
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
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, expectedRole: "USER" }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/";
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoUser = async () => {
    setIsDemoLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "USER" }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/";
      } else {
        setError(data.error || "Failed to log in as demo user.");
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
            <h1 className="text-xl font-bold tracking-tight text-[#18181B]">
              UPSC<span className="text-[#F97316]">Cart</span>
            </h1>
            <p className="text-sm font-semibold text-[#18181B]">Welcome back</p>
            <p className="text-xs text-[#71717A]">
              Sign in to manage your listings, chat, and offers
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
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aryan.nda.2163@gmail.com"
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
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
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? "Signing in..." : "Log In"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={handleDemoUser}
              disabled={isDemoLoading}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors disabled:opacity-50"
            >
              <span>{isDemoLoading ? "Entering demo..." : "Continue as Demo User"}</span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-[#71717A] space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#F97316] font-medium hover:underline">
                Create account
              </Link>
            </p>
            <p>
              <Link href="/admin/login" className="text-gray-500 hover:text-[#18181B] text-[11px]">
                Looking for Administrator portal?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
