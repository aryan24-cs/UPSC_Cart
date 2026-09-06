"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Heart,
  ListOrdered,
  Gavel,
  ShieldCheck,
  Flag,
  Lock,
  DoorOpen,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  LogOut,
  X,
  Plus,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mobile Verification Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // My Listings Modal/State
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        if (data.user.phone) setMobileNumber(data.user.phone.replace("+91 ", ""));
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/welcome";
    } catch (err) {
      console.error(err);
      window.location.href = "/welcome";
    }
  };

  const handleSendOtp = () => {
    if (mobileNumber.length >= 10) {
      setOtpSent(true);
      setOtpCode("123456");
    } else {
      alert("Please enter a 10-digit mobile number");
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobileNumber, otp: otpCode }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Mobile number verified successfully!");
        setIsVerifyModalOpen(false);
        fetchProfile();
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchMyListings = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/listings?sellerId=${currentUser.id}&status=ALL`);
      const data = await res.json();
      if (data.listings) {
        setMyListings(data.listings);
        setIsMyListingsOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#71717A]">Loading profile...</p>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "ADMIN";

  const profileMenuItems = [
    {
      label: "Mobile Verification",
      sublabel: "Required to post & chat",
      icon: Smartphone,
      isVerified: currentUser?.isMobileVerified,
      onClick: () => setIsVerifyModalOpen(true),
    },
    {
      label: "Saved Items",
      icon: Heart,
      href: "/saved",
    },
    {
      label: "My Listings",
      icon: ListOrdered,
      onClick: fetchMyListings,
    },
    {
      label: "Auction & Offers Dashboard",
      sublabel: "Review buyer offers & negotiation threads",
      icon: Gavel,
      href: "/chat",
    },
    {
      label: "Auction Permissions",
      sublabel: "Full auction & negotiation access enabled",
      icon: ShieldCheck,
      isSpecial: true,
    },
    {
      label: "My Reports",
      icon: Flag,
      onClick: () => alert("Reports dashboard: You have 0 pending community flags."),
    },
    {
      label: "Privacy & Security",
      icon: Lock,
      onClick: () => alert("Privacy Settings: Phone numbers are masked by default to protect UPSC aspirants."),
    },
    {
      label: "Room Leads",
      icon: DoorOpen,
      href: "/rooms",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      onClick: () => alert("UPSC Cart Community Help: Contact support@upsccart.in or check community guidelines."),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7] mb-6">
        <div className="flex items-center gap-2.5">
          <Link href="/" aria-label="Go back" className="p-1 -ml-1 text-[#71717A] hover:text-[#18181B] transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl font-semibold text-[#18181B] tracking-tight">Profile</h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Responsive Layout: Single column on mobile, 2-column on desktop (>=1024px) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (User Card & Quick Stats) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center gap-4">
              <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]">
                <Image
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                  alt={currentUser?.name || "User"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center justify-center sm:justify-start lg:justify-center gap-1.5">
                  <h2 className="text-base font-semibold text-[#18181B] truncate">{currentUser?.name}</h2>
                  {currentUser?.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#71717A] mt-0.5 truncate">{currentUser?.email}</p>
                <div className="flex items-center justify-center sm:justify-start lg:justify-center gap-1.5 mt-2.5 flex-wrap">
                  <span className="rounded-full bg-[#FFF7ED] text-[#EA580C] px-2 py-0.5 text-[10px] font-semibold">
                    {isAdmin ? "Administrator" : "Verified Aspirant"}
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    📍 {currentUser?.coachingHub || "Old Rajinder Nagar"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Summary Chips */}
            <div className="mt-5 pt-4 border-t border-[#E4E4E7] grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] p-2.5">
                <span className="text-[10px] text-[#71717A] block font-medium">Status</span>
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
              <div className="rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] p-2.5">
                <span className="text-[10px] text-[#71717A] block font-medium">Mobile</span>
                <span className={`text-xs font-medium ${currentUser?.isMobileVerified ? "text-emerald-600" : "text-amber-600"}`}>
                  {currentUser?.isMobileVerified ? "Verified ✓" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Menu Items */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-[#E4E4E7] rounded-xl border border-[#E4E4E7] bg-white overflow-hidden">
            {profileMenuItems.map((item, idx) => {
              const Icon = item.icon;

              const content = (
                <div className="flex items-center justify-between p-4 hover:bg-[#FAFAF9] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${item.isSpecial ? "text-emerald-600" : "text-[#71717A]"}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium text-xs sm:text-sm truncate ${item.isSpecial ? "text-emerald-700" : "text-[#18181B]"}`}>
                          {item.label}
                        </p>
                        {item.isVerified && (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-1.5 py-0.2 text-[9px] font-medium shrink-0">
                            Verified ✓
                          </span>
                        )}
                      </div>
                      {item.sublabel && (
                        <p className="text-[11px] text-[#71717A] truncate mt-0.5">{item.sublabel}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
                </div>
              );

              if (item.href) {
                return (
                  <Link key={idx} href={item.href} className="block">
                    {content}
                  </Link>
                );
              }

              return (
                <div key={idx} onClick={item.onClick}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Verification Modal */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-xl bg-white p-5 sm:p-6 border border-[#E4E4E7] shadow-xl pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-semibold text-sm sm:text-base text-[#18181B]">Mobile Verification</h3>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-[#FAFAF9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  10-Digit Mobile Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-[10px] bg-[#FAFAF9] border border-[#E4E4E7] px-3 text-xs font-medium text-[#71717A] shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] focus:border-[#F97316] focus:outline-none"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full rounded-lg bg-[#F97316] py-2.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
                >
                  Send OTP
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full rounded-[10px] border border-[#E4E4E7] py-2 text-center text-lg font-semibold tracking-widest text-[#18181B] focus:border-[#F97316] focus:outline-none"
                    />
                    <p className="text-[11px] text-emerald-600 mt-1">✓ Demo OTP 123456 prefilled</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    {isVerifying ? "Verifying..." : "Confirm & Verify"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* My Listings Modal */}
      {isMyListingsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full sm:max-w-lg max-h-[85dvh] sm:max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-xl bg-white p-5 sm:p-6 border border-[#E4E4E7] shadow-xl pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-semibold text-sm sm:text-base text-[#18181B]">My Posted Listings</h3>
              <button
                type="button"
                onClick={() => setIsMyListingsOpen(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-[#FAFAF9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E4E4E7] my-4">
              {myListings.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#71717A]">
                  You have not posted any items yet under this account.
                </div>
              ) : (
                myListings.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-xs sm:text-sm text-[#18181B] truncate">{item.title}</h4>
                      <p className="text-xs font-semibold text-[#18181B]">₹{item.price}</p>
                      <span className="text-[10px] text-[#71717A]">Status: {item.status}</span>
                    </div>

                    <Link
                      href={`/listing/${item.slug}`}
                      className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/sell"
              onClick={() => setIsMyListingsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] py-2.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
            >
              <Plus className="h-4 w-4" /> Post Another Item
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
