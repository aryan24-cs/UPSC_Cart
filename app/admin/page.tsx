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
  Ban,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "reports" | "users">("overview");

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
        <p className="text-xs text-[#71717A]">Loading admin metrics & moderation queue...</p>
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E4E4E7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#F4F4F5] px-2 py-0.5 text-[10px] font-medium text-[#71717A] flex items-center gap-1">
              <Shield className="h-3 w-3 text-[#71717A]" /> Moderation Console
            </span>
            <span className="text-xs text-[#71717A]">Platform Safety</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#18181B] tracking-tight mt-1">Admin Dashboard</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-[#F4F4F5] p-1 w-full sm:w-auto">
          {(["overview", "listings", "reports", "users"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white text-[#18181B] shadow-2xs"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Total Aspirants</span>
            <Users className="h-4 w-4 text-[#A1A1AA]" />
          </div>
          <div className="text-2xl font-semibold text-[#18181B] tracking-tight">{m.totalUsers || 0}</div>
          <span className="text-[11px] text-[#71717A] block mt-0.5 truncate">Active Community</span>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Active Listings</span>
            <Package className="h-4 w-4 text-[#A1A1AA]" />
          </div>
          <div className="text-2xl font-semibold text-[#18181B] tracking-tight">{m.activeListings || 0}</div>
          <span className="text-[11px] text-[#71717A] block mt-0.5 truncate">{m.soldListings || 0} deals completed</span>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Room Listings</span>
            <DoorOpen className="h-4 w-4 text-[#A1A1AA]" />
          </div>
          <div className="text-2xl font-semibold text-[#18181B] tracking-tight">{m.totalRooms || 0}</div>
          <span className="text-[11px] text-[#71717A] block mt-0.5 truncate">Zero Brokerage</span>
        </div>

        <div className="rounded-xl border border-[#E4E4E7] bg-white p-4">
          <div className="flex items-center justify-between text-[#71717A] mb-1">
            <span className="text-xs font-medium">Flagged Reports</span>
            <Flag className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-semibold text-red-600 tracking-tight">{m.pendingReports || 0}</div>
          <span className="text-[11px] text-red-600 block mt-0.5 truncate">Needs Review</span>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moderation Queue */}
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#18181B] flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-500 shrink-0" /> Flagged Reports Queue
              </h2>
              <span className="text-xs text-[#71717A]">{data?.recentReports?.length || 0} reports</span>
            </div>

            <div className="divide-y divide-[#E4E4E7]">
              {data?.recentReports?.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#71717A]">
                  No pending community reports. All clear.
                </p>
              ) : (
                data?.recentReports?.map((r: any) => (
                  <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-[10px] font-medium uppercase">
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

          {/* Recent Listings */}
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#18181B] flex items-center gap-2">
              <Package className="h-4 w-4 text-[#F97316] shrink-0" /> Recent Marketplace Submissions
            </h2>

            <div className="divide-y divide-[#E4E4E7]">
              {data?.recentListings?.map((l: any) => (
                <div key={l.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <h3 className="font-medium text-xs sm:text-sm text-[#18181B] truncate">{l.title}</h3>
                    <p className="text-xs font-semibold text-[#18181B]">₹{l.price}</p>
                    <span className="text-[11px] text-[#71717A] truncate block">
                      Seller: {l.seller?.name} · Hub: {l.location?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        l.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {l.status}
                    </span>

                    {l.status === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={() => handleAdminAction("UPDATE_LISTING_STATUS", l.id, "UNDER_REVIEW")}
                        className="rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9] transition-colors"
                      >
                        Hold
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdminAction("UPDATE_LISTING_STATUS", l.id, "ACTIVE")}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#18181B] mb-4">Aspirant User Directory</h2>
          <div className="divide-y divide-[#E4E4E7]">
            {data?.users?.map((u: any) => (
              <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-xs sm:text-sm text-[#18181B] truncate">{u.name}</span>
                    {u.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />}
                    <span className="rounded-full bg-[#F4F4F5] px-2 py-0.2 text-[10px] font-medium text-[#71717A] shrink-0">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#71717A] truncate">{u.email}</p>
                  <p className="text-[11px] text-[#71717A] truncate">Hub: {u.coachingHub || "Delhi NCR"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdminAction("TOGGLE_USER_VERIFIED", u.id)}
                  className={`w-full sm:w-auto rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    u.isVerified
                      ? "border border-[#E4E4E7] text-[#71717A] hover:bg-[#FAFAF9]"
                      : "bg-[#18181B] text-white hover:bg-black"
                  }`}
                >
                  {u.isVerified ? "Revoke Badge" : "Grant Verified"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === "listings" && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#18181B] mb-4">All Active & Flagged Listings</h2>
          <div className="divide-y divide-[#E4E4E7]">
            {data?.recentListings?.map((l: any) => (
              <div key={l.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium text-xs sm:text-sm text-[#18181B] truncate">{l.title}</h3>
                  <p className="text-xs font-semibold text-[#18181B]">₹{l.price}</p>
                  <p className="text-xs text-[#71717A] truncate">Category: {l.category?.name} · Hub: {l.location?.name}</p>
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
                    onClick={() => handleAdminAction("UPDATE_LISTING_STATUS", l.id, "UNDER_REVIEW")}
                    className="rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdminAction("UPDATE_LISTING_STATUS", l.id, "ACTIVE")}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    Active
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === "reports" && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-[#18181B] mb-4">Community Flagged Reports</h2>
          <div className="divide-y divide-[#E4E4E7]">
            {data?.recentReports?.map((r: any) => (
              <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-[10px] font-medium">
                    {r.reason}
                  </span>
                  <p className="text-xs text-[#18181B] mt-1 font-medium">{r.details}</p>
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
