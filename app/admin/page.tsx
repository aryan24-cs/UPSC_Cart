"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Package,
  DoorOpen,
  MessageSquare,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  TrendingUp,
  DollarSign,
  IndianRupee,
  MapPin,
  BookOpen,
  Gavel,
  Check,
  X,
  ExternalLink,
  Edit3,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "reports" | "users" | "analytics">("overview");

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.status === 403) {
        setAuthError("Admin access required. You don't have permission to access the admin dashboard.");
        setTimeout(() => {
          router.push("/marketplace");
        }, 1800);
        return;
      }
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdminAction = async (action: string, targetId: string, value?: string) => {
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetId, value }),
      });
      const result = await res.json();
      if (result.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListingDirect = async (id: string) => {
    if (!confirm("Admin Action: Delete this listing permanently?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authError) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-base font-semibold text-[#18181B]">Admin Access Required</h2>
        <p className="text-xs text-[#71717A]">{authError}</p>
        <p className="text-[11px] text-[#A1A1AA]">Redirecting to marketplace...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#18181B] border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#71717A]">Loading live admin metrics & marketplace stats...</p>
      </div>
    );
  }

  const m = data?.metrics || {};
  const categories = data?.categoryBreakdown || [];
  const locations = data?.locationBreakdown || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-[10px] font-medium text-[#71717A] flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-600" /> Platform Admin Console
            </span>
            <span className="text-xs text-emerald-600 font-semibold">● Database Live (Supabase/Prisma)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight mt-1">
            UPSC Cart Admin Dashboard
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-[#F4F4F5] p-1 w-full sm:w-auto overflow-x-auto">
          {(["overview", "analytics", "listings", "reports", "users"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white text-[#18181B] shadow-2xs font-semibold"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Financial & Operational Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Active Market Value</span>
            <IndianRupee className="h-4 w-4 text-[#F97316]" />
          </div>
          <div className="text-2xl font-bold text-[#18181B] tracking-tight">
            ₹{m.activeInventoryValue?.toLocaleString("en-IN") || 0}
          </div>
          <span className="text-[11px] text-[#71717A] block mt-0.5 truncate">
            {m.activeListings || 0} active listings live
          </span>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Completed Deals Value</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 tracking-tight">
            ₹{m.completedSalesValue?.toLocaleString("en-IN") || 0}
          </div>
          <span className="text-[11px] text-[#71717A] block mt-0.5 truncate">
            {m.soldListings || 0} items successfully traded
          </span>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Total Aspirants</span>
            <Users className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-[#18181B] tracking-tight">{m.totalUsers || 0}</div>
          <span className="text-[11px] text-[#71717A] block mt-0.5 truncate">
            {m.totalMessages || 0} chat messages exchanged
          </span>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Flagged Reports</span>
            <Flag className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 tracking-tight">{m.pendingReports || 0}</div>
          <span className="text-[11px] text-red-600 block mt-0.5 truncate">Needs Review</span>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF9] p-4 rounded-xl border border-[#E4E4E7] text-xs">
            <div>
              <span className="text-[#71717A] block">Average Item Price</span>
              <span className="font-bold text-[#18181B] text-sm">₹{m.avgActivePrice || 0}</span>
            </div>
            <div>
              <span className="text-[#71717A] block">Room Listings</span>
              <span className="font-bold text-[#18181B] text-sm">{m.totalRooms || 0} Rooms</span>
            </div>
            <div>
              <span className="text-[#71717A] block">Buyer Offers</span>
              <span className="font-bold text-[#18181B] text-sm">{m.totalOffers || 0} Offers</span>
            </div>
            <div>
              <span className="text-[#71717A] block">Student Services</span>
              <span className="font-bold text-[#18181B] text-sm">{m.totalServices || 0} Services</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moderation Queue */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
                  <Flag className="h-4 w-4 text-red-500 shrink-0" /> Flagged Community Reports Queue
                </h2>
                <span className="text-xs text-[#71717A]">{data?.recentReports?.length || 0} reports</span>
              </div>

              <div className="divide-y divide-[#E4E4E7]">
                {data?.recentReports?.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[#71717A]">
                    No pending community reports. All clear!
                  </p>
                ) : (
                  data?.recentReports?.map((r: any) => (
                    <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-[10px] font-semibold uppercase">
                            {r.reason}
                          </span>
                          <span className="text-xs font-medium text-[#18181B]">Target: {r.targetType}</span>
                        </div>
                        <p className="text-xs text-[#71717A] mt-1 line-clamp-2">{r.details || "No details provided"}</p>
                        <span className="text-[10px] text-[#A1A1AA]">By: {r.reporter?.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleAdminAction("RESOLVE_REPORT", r.id, "RESOLVED")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminAction("RESOLVE_REPORT", r.id, "DISMISSED")}
                          className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9] transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Marketplace Submissions */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
                <Package className="h-4 w-4 text-[#F97316] shrink-0" /> Recent Marketplace Submissions
              </h2>

              <div className="divide-y divide-[#E4E4E7]">
                {data?.recentListings?.slice(0, 6).map((l: any) => (
                  <div key={l.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-[#18181B] truncate">{l.title}</h3>
                      <p className="text-xs font-bold text-[#18181B]">₹{l.price}</p>
                      <span className="text-[11px] text-[#71717A] truncate block">
                        Seller: {l.seller?.name} · Hub: {l.location?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          l.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {l.status}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleAdminAction(
                            "UPDATE_LISTING_STATUS",
                            l.id,
                            l.status === "ACTIVE" ? "UNDER_REVIEW" : "ACTIVE"
                          )
                        }
                        className="rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9] transition-colors"
                      >
                        {l.status === "ACTIVE" ? "Hold" : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteListingDirect(l.id)}
                        className="rounded-lg border border-red-200 p-1 text-red-600 hover:bg-red-50"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB: Category & Location Distribution */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#F97316]" /> Listings Distribution by Category
            </h2>
            <div className="space-y-3">
              {categories.map((cat: any) => {
                const percentage = m.totalListings > 0 ? Math.round((cat.count / m.totalListings) * 100) : 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-[#18181B]">{cat.name}</span>
                      <span className="text-[#71717A]">{cat.count} items ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F4F4F5] overflow-hidden">
                      <div
                        className="h-full bg-[#F97316] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coaching Hub Distribution */}
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[#18181B] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#2563EB]" /> Activity by Coaching Hub Location
            </h2>
            <div className="space-y-3">
              {locations.map((loc: any) => (
                <div key={loc.id} className="p-3 bg-[#FAFAF9] rounded-lg border border-[#E4E4E7] flex items-center justify-between text-xs">
                  <div>
                    <h3 className="font-semibold text-[#18181B]">{loc.name}</h3>
                    <p className="text-[11px] text-[#71717A]">Delhi NCR Region</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#18181B] block">{loc.listingsCount} Listings</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{loc.roomsCount} Rooms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-4">Aspirant User & Seller Directory</h2>
          <div className="divide-y divide-[#E4E4E7]">
            {data?.users?.map((u: any) => (
              <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm text-[#18181B] truncate">{u.name}</span>
                    {u.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />}
                    <span className="rounded-full bg-[#F4F4F5] px-2 py-0.2 text-[10px] font-semibold text-[#71717A] shrink-0">
                      {u.role}
                    </span>
                    <span className="text-[10px] text-[#71717A]">({u._count?.listings || 0} listings)</span>
                  </div>
                  <p className="text-xs text-[#71717A] truncate">{u.email}</p>
                  <p className="text-[11px] text-[#71717A] truncate">Hub: {u.coachingHub || "Delhi NCR"}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/profile/${u.id}`}
                    className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9]"
                  >
                    View Card
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAdminAction("TOGGLE_USER_VERIFIED", u.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      u.isVerified
                        ? "border border-[#E4E4E7] text-[#71717A] hover:bg-[#FAFAF9]"
                        : "bg-[#18181B] text-white hover:bg-black"
                    }`}
                  >
                    {u.isVerified ? "Revoke Badge" : "Grant Verified"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === "listings" && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-4">All Active & Moderated Listings</h2>
          <div className="divide-y divide-[#E4E4E7]">
            {data?.recentListings?.map((l: any) => (
              <div key={l.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-[#18181B] truncate">{l.title}</h3>
                  <p className="text-xs font-bold text-[#18181B]">₹{l.price}</p>
                  <p className="text-xs text-[#71717A] truncate">
                    Seller: {l.seller?.name} · Category: {l.category?.name} · Hub: {l.location?.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/listing/${l.slug}`}
                    className="rounded-lg border border-[#E4E4E7] px-3 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      handleAdminAction(
                        "UPDATE_LISTING_STATUS",
                        l.id,
                        l.status === "ACTIVE" ? "UNDER_REVIEW" : "ACTIVE"
                      )
                    }
                    className="rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    {l.status === "ACTIVE" ? "Hold" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteListingDirect(l.id)}
                    className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === "reports" && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-bold text-[#18181B] mb-4">Community Flagged Reports</h2>
          <div className="divide-y divide-[#E4E4E7]">
            {data?.recentReports?.map((r: any) => (
              <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-[10px] font-semibold">
                    {r.reason}
                  </span>
                  <p className="text-xs text-[#18181B] mt-1 font-medium">{r.details || "No details"}</p>
                  <p className="text-[11px] text-[#71717A]">Reporter: {r.reporter?.name}</p>
                </div>

                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleAdminAction("RESOLVE_REPORT", r.id, "RESOLVED")}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdminAction("RESOLVE_REPORT", r.id, "DISMISSED")}
                    className="rounded-lg border border-[#E4E4E7] px-3.5 py-1.5 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
