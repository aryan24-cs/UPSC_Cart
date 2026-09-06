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
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  BookOpen,
  Check,
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

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCoachingHub, setEditCoachingHub] = useState("");
  const [editOptionalSubject, setEditOptionalSubject] = useState("");
  const [editTargetYear, setEditTargetYear] = useState("2026");
  const [editAvatar, setEditAvatar] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // My Listings Modal/State
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);

  // Edit Listing State inside My Listings
  const [editingListing, setEditingListing] = useState<any>(null);
  const [editListTitle, setEditListTitle] = useState("");
  const [editListPrice, setEditListPrice] = useState("");
  const [editListDesc, setEditListDesc] = useState("");
  const [editListCondition, setEditListCondition] = useState("GOOD");
  const [isSavingListing, setIsSavingListing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setEditName(data.user.name || "");
        setEditBio(data.user.bio || "");
        setEditPhone(data.user.phone || "");
        setEditCoachingHub(data.user.coachingHub || "Old Rajinder Nagar");
        setEditOptionalSubject(data.user.optionalSubject || "PSIR");
        setEditTargetYear(data.user.targetYear ? String(data.user.targetYear) : "2026");
        setEditAvatar(data.user.avatar || "");
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          bio: editBio,
          coachingHub: editCoachingHub,
          optionalSubject: editOptionalSubject,
          targetYear: editTargetYear,
          avatar: editAvatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setIsEditProfileOpen(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setIsSavingProfile(false);
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

  const handleUpdateListingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMyListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMyListings((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEditListing = (listing: any) => {
    setEditingListing(listing);
    setEditListTitle(listing.title);
    setEditListPrice(String(listing.price));
    setEditListDesc(listing.description);
    setEditListCondition(listing.condition || "GOOD");
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    setIsSavingListing(true);
    try {
      const res = await fetch(`/api/listings/${editingListing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editListTitle,
          price: editListPrice,
          description: editListDesc,
          condition: editListCondition,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMyListings((prev) =>
          prev.map((l) => (l.id === editingListing.id ? { ...l, ...data.listing } : l))
        );
        setEditingListing(null);
      } else {
        alert(data.error || "Failed to update listing");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingListing(false);
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
      label: "Edit Profile Info",
      sublabel: "Bio, Coaching Hub, Optional Subject & Target Year",
      icon: Edit3,
      onClick: () => setIsEditProfileOpen(true),
    },
    {
      label: "Mobile Verification",
      sublabel: "Required to post & chat",
      icon: Smartphone,
      isVerified: currentUser?.isMobileVerified,
      onClick: () => setIsVerifyModalOpen(true),
    },
    {
      label: "My Posted Listings",
      sublabel: "Manage, edit, or mark items as sold",
      icon: ListOrdered,
      onClick: fetchMyListings,
    },
    {
      label: "View Public Seller Card",
      sublabel: "Preview how other buyers view your profile",
      icon: ExternalLink,
      href: `/profile/${currentUser?.id}`,
    },
    {
      label: "Saved Items",
      icon: Heart,
      href: "/saved",
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
      label: "Room Leads",
      icon: DoorOpen,
      href: "/rooms",
    },
    {
      label: "Privacy & Security",
      icon: Lock,
      onClick: () => alert("Privacy Settings: Phone numbers are masked by default to protect UPSC aspirants."),
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
          <h1 className="text-xl font-semibold text-[#18181B] tracking-tight">Profile & Seller Dashboard</h1>
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

      {/* Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (User Profile Card) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#F97316]/20 bg-[#F4F4F5]">
                <Image
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                  alt={currentUser?.name || "User"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0 w-full">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-base font-semibold text-[#18181B] truncate">{currentUser?.name}</h2>
                  {currentUser?.isVerified && (
                    <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#71717A] mt-0.5 truncate">{currentUser?.email}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                  <span className="rounded-full bg-[#FFF7ED] text-[#EA580C] px-2 py-0.5 text-[10px] font-semibold">
                    {isAdmin ? "Administrator" : "Verified Aspirant"}
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    📍 {currentUser?.coachingHub || "Old Rajinder Nagar"}
                  </span>
                </div>

                {currentUser?.bio && (
                  <p className="text-xs text-[#52525B] mt-3 line-clamp-3 bg-[#FAFAF9] p-2.5 rounded-lg border border-[#E4E4E7] text-left">
                    "{currentUser.bio}"
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#18181B] py-2 text-xs font-medium text-white hover:bg-black transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </button>
            </div>

            {/* Aspirant Meta Badges */}
            <div className="mt-5 pt-4 border-t border-[#E4E4E7] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#71717A]">
                <span>Optional Subject:</span>
                <span className="font-semibold text-[#18181B]">{currentUser?.optionalSubject || "PSIR"}</span>
              </div>
              <div className="flex items-center justify-between text-[#71717A]">
                <span>Target CSE Year:</span>
                <span className="font-semibold text-[#18181B]">{currentUser?.targetYear || "2026"}</span>
              </div>
              <div className="flex items-center justify-between text-[#71717A]">
                <span>Response Rate:</span>
                <span className="font-semibold text-emerald-600">{currentUser?.responseRate || "98%"}</span>
              </div>
            </div>

            {/* Quick Summary Chips */}
            <div className="mt-4 pt-4 border-t border-[#E4E4E7] grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] p-2.5">
                <span className="text-[10px] text-[#71717A] block font-medium">Listings</span>
                <span className="text-xs font-bold text-[#18181B]">{currentUser?._count?.listings || 0} Posted</span>
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

        {/* Right Column: Menu Options */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-[#E4E4E7] rounded-xl border border-[#E4E4E7] bg-white overflow-hidden shadow-xs">
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

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 border border-[#E4E4E7] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-semibold text-base text-[#18181B] flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#F97316]" /> Edit Aspirant Profile
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-[#FAFAF9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-medium text-[#18181B] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] focus:border-[#F97316] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#18181B] mb-1">Avatar Image URL (Unsplash or direct)</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#18181B] mb-1">Coaching Hub</label>
                  <select
                    value={editCoachingHub}
                    onChange={(e) => setEditCoachingHub(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E7] px-2.5 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                  >
                    <option value="Old Rajinder Nagar">Old Rajinder Nagar</option>
                    <option value="Mukherjee Nagar">Mukherjee Nagar</option>
                    <option value="Karol Bagh">Karol Bagh</option>
                    <option value="Patel Nagar">Patel Nagar</option>
                    <option value="Laxmi Nagar">Laxmi Nagar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#18181B] mb-1">Target Year</label>
                  <select
                    value={editTargetYear}
                    onChange={(e) => setEditTargetYear(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E7] px-2.5 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                  >
                    <option value="2025">CSE 2025</option>
                    <option value="2026">CSE 2026</option>
                    <option value="2027">CSE 2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#18181B] mb-1">Optional Subject</label>
                <input
                  type="text"
                  value={editOptionalSubject}
                  onChange={(e) => setEditOptionalSubject(e.target.value)}
                  placeholder="e.g. PSIR, Sociology, Geography, History"
                  className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#18181B] mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#18181B] mb-1">Aspirant Bio & Preparation Note</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell co-aspirants about your preparation focus and items you trade..."
                  className="w-full rounded-lg border border-[#E4E4E7] p-3 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 rounded-lg border border-[#E4E4E7] py-2.5 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 rounded-lg bg-[#F97316] py-2.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE VERIFICATION MODAL */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 sm:p-6 border border-[#E4E4E7] shadow-xl">
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
                  <span className="flex items-center rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] px-3 text-xs font-medium text-[#71717A] shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] focus:border-[#F97316] focus:outline-none"
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
                      className="w-full rounded-lg border border-[#E4E4E7] py-2 text-center text-lg font-semibold tracking-widest text-[#18181B] focus:border-[#F97316] focus:outline-none"
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

      {/* MY LISTINGS & SELLER MANAGEMENT MODAL */}
      {isMyListingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-white p-5 sm:p-6 border border-[#E4E4E7] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-semibold text-base text-[#18181B] flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-[#F97316]" /> My Posted Listings ({myListings.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsMyListingsOpen(false);
                  setEditingListing(null);
                }}
                className="rounded-lg p-1 text-[#71717A] hover:bg-[#FAFAF9]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Listing Edit View */}
            {editingListing ? (
              <form onSubmit={handleSaveListing} className="flex-1 overflow-y-auto space-y-4 my-4 text-xs pr-1">
                <div className="flex items-center justify-between bg-[#FAFAF9] p-3 rounded-lg border border-[#E4E4E7]">
                  <span className="font-semibold text-sm text-[#18181B]">Editing Listing</span>
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    className="text-xs text-[#F97316] font-medium hover:underline"
                  >
                    Back to List
                  </button>
                </div>

                <div>
                  <label className="block font-medium text-[#18181B] mb-1">Title</label>
                  <input
                    type="text"
                    value={editListTitle}
                    onChange={(e) => setEditListTitle(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] focus:border-[#F97316] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#18181B] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editListPrice}
                      onChange={(e) => setEditListPrice(e.target.value)}
                      className="w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-sm text-[#18181B] focus:border-[#F97316] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#18181B] mb-1">Condition</label>
                    <select
                      value={editListCondition}
                      onChange={(e) => setEditListCondition(e.target.value)}
                      className="w-full rounded-lg border border-[#E4E4E7] px-2.5 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                    >
                      <option value="NEW">Brand New</option>
                      <option value="LIKE_NEW">Like New</option>
                      <option value="GOOD">Good Condition</option>
                      <option value="FAIR">Fair Condition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#18181B] mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={editListDesc}
                    onChange={(e) => setEditListDesc(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E7] p-3 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    className="flex-1 rounded-lg border border-[#E4E4E7] py-2.5 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingListing}
                    className="flex-1 rounded-lg bg-[#F97316] py-2.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
                  >
                    {isSavingListing ? "Saving..." : "Save Listing Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-[#E4E4E7] my-4 pr-1">
                {myListings.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#71717A]">
                    You have not posted any marketplace items yet.
                  </div>
                ) : (
                  myListings.map((item) => (
                    <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5]">
                          <Image
                            src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80"}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-[#18181B] truncate">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#18181B]">₹{item.price}</span>
                            <span
                              className={`rounded-full px-2 py-0.2 text-[10px] font-medium ${
                                item.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : item.status === "SOLD"
                                  ? "bg-gray-100 text-gray-700 line-through"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {item.status}
                            </span>
                            <span className="text-[10px] text-[#71717A] flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {item.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateListingStatus(
                              item.id,
                              item.status === "ACTIVE" ? "SOLD" : "ACTIVE"
                            )
                          }
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "Mark Sold" : "Re-activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditListing(item)}
                          className="rounded-lg border border-[#E4E4E7] p-1.5 text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
                          title="Edit Listing"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteListing(item.id)}
                          className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <Link
                          href={`/listing/${item.slug}`}
                          className="rounded-lg border border-[#E4E4E7] px-2.5 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <Link
              href="/sell"
              onClick={() => setIsMyListingsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] py-2.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
            >
              <Plus className="h-4 w-4" /> Post New Listing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
