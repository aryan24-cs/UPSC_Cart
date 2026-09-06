"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, ArrowRight, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";

export default function WelcomeGatewayPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDemoLogin = async (role: "USER" | "ADMIN") => {
    setIsLoading(role);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.redirect || (role === "ADMIN" ? "/admin" : "/");
      } else {
        alert(data.error || "Failed to log in to demo account.");
        setIsLoading(null);
      }
    } catch (err) {
      console.error(err);
      alert("Network error during demo login.");
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 sm:py-16 bg-[#FAFAF9]">
      <div className="w-full max-w-2xl text-center space-y-6">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E4E4E7] px-3 py-1 text-xs font-medium text-[#71717A] mb-2 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#F97316]" />
            <span>Hyper-Local Civil Services Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
            UPSC<span className="text-[#F97316]">Cart</span>
          </h1>
          <p className="text-sm sm:text-base text-[#71717A] max-w-md mx-auto">
            Buy, sell, and discover UPSC books, notes, furniture & rooms in Old Rajinder Nagar, Mukherjee Nagar, and beyond.
          </p>
        </div>

        {/* Question Header */}
        <div className="pt-2">
          <h2 className="text-base sm:text-lg font-semibold text-[#18181B]">
            Choose how you want to continue
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Select your role or use demo accounts to evaluate the platform
          </p>
        </div>

        {/* 2-Card Role Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          {/* Aspirant Card */}
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#D4D4D8] transition-all hover:shadow-xs">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F97316] mb-4">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#18181B]">Aspirant</h3>
              <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
                Buy & sell standard textbooks, coaching notes, study furniture, find rooms, and bargain with peers.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] transition-colors"
              >
                <span>Continue as Aspirant</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => handleDemoLogin("USER")}
                disabled={isLoading !== null}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] px-4 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors disabled:opacity-50"
              >
                <span>{isLoading === "USER" ? "Entering..." : "Explore as Demo User"}</span>
              </button>
            </div>
          </div>

          {/* Admin Card */}
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#D4D4D8] transition-all hover:shadow-xs">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F4F4F5] text-[#18181B] mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[#18181B]">Administrator</h3>
              <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
                Oversee platform metrics, manage user verification, review flagged reports, and moderate listings.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <Link
                href="/admin/login"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#18181B] px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-black transition-colors"
              >
                <span>Admin Login</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => handleDemoLogin("ADMIN")}
                disabled={isLoading !== null}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] px-4 py-2 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors disabled:opacity-50"
              >
                <span>{isLoading === "ADMIN" ? "Entering..." : "Explore as Demo Admin"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Server-enforced role-based access control</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-[#18181B] underline underline-offset-2">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-[#18181B] underline underline-offset-2">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
