"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coachingHub, setCoachingHub] = useState("Old Rajinder Nagar");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          coachingHub,
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/";
      } else {
        setError(data.error || "Failed to create account.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <p className="text-sm font-semibold text-[#18181B]">Create an Aspirant Account</p>
            <p className="text-xs text-[#71717A]">
              Connect with fellow aspirants to buy, sell, and share rooms
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1">
                Full Name <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aryan Kumar"
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1">
                Email Address <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">
                  Mobile (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1">
                  Coaching Hub
                </label>
                <select
                  value={coachingHub}
                  onChange={(e) => setCoachingHub(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-2.5 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                >
                  <option value="Old Rajinder Nagar">Old Rajinder Nagar</option>
                  <option value="Mukherjee Nagar">Mukherjee Nagar</option>
                  <option value="Karol Bagh">Karol Bagh</option>
                  <option value="Patel Nagar">Patel Nagar</option>
                  <option value="Laxmi Nagar">Laxmi Nagar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1">
                Password (min 8 characters) <span className="text-[#F97316]">*</span>
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

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1">
                Confirm Password <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] transition-colors disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[#71717A]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F97316] font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
