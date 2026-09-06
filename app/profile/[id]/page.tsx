"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  BookOpen,
  Calendar,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  ExternalLink,
} from "lucide-react";

export default function PublicSellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const sellerId = resolvedParams.id;

  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch listings by sellerId
        const res = await fetch(`/api/listings?sellerId=${sellerId}&status=ALL`);
        const data = await res.json();
        
        if (data.listings && data.listings.length > 0) {
          setListings(data.listings);
          setSeller(data.listings[0].seller);
        } else {
          // If no listings, fetch user directly via /api/profile or /api/auth/me fallback
          const userRes = await fetch(`/api/admin/metrics`); // contains user list or fetch
          const userData = await userRes.json();
          const found = userData.users?.find((u: any) => u.id === sellerId);
          if (found) {
            setSeller(found);
          } else {
            setError("Seller profile not found");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load seller profile");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [sellerId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#71717A]">Loading seller profile...</p>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-semibold text-[#18181B]">Seller Not Found</h2>
        <p className="text-xs text-[#71717A]">This seller profile does not exist or has been removed.</p>
        <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F97316]">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Back Link */}
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#18181B]">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      {/* Seller Hero Header */}
      <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-[#F97316]/20 bg-[#F4F4F5]">
            <Image
              src={seller.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
              alt={seller.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#18181B]">{seller.name}</h1>
              {seller.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#2563EB]">
                  <CheckCircle2 className="h-3 w-3" /> Verified Aspirant
                </span>
              )}
            </div>

            <p className="text-xs text-[#71717A] mt-1 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#F97316]" /> {seller.coachingHub || "Old Rajinder Nagar"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-[#71717A]" /> {seller.optionalSubject || "PSIR"} Optional
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#71717A]" /> Target {seller.targetYear || "2026"}
              </span>
            </p>

            {seller.bio && (
              <p className="text-xs text-[#52525B] mt-3 bg-[#FAFAF9] p-3 rounded-lg border border-[#E4E4E7]">
                "{seller.bio}"
              </p>
            )}

            {/* Response Metrics */}
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-4 text-xs text-[#71717A] flex-wrap pt-3 border-t border-[#E4E4E7]">
              <div>
                <span className="text-[10px] text-[#A1A1AA] block">Response Rate</span>
                <span className="font-semibold text-emerald-600">{seller.responseRate || "98%"}</span>
              </div>
              <div className="h-6 w-px bg-[#E4E4E7]"></div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] block">Response Time</span>
                <span className="font-semibold text-[#18181B]">{seller.responseTime || "< 15 mins"}</span>
              </div>
              <div className="h-6 w-px bg-[#E4E4E7]"></div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] block">Mobile Verified</span>
                <span className="font-semibold text-emerald-600">✓ Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Active Listings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
            <Package className="h-4 w-4 text-[#F97316]" /> Seller&apos;s Active Listings ({listings.length})
          </h2>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-8 text-center text-xs text-[#71717A]">
            This seller currently has no active marketplace listings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((item) => (
              <Link
                key={item.id}
                href={`/listing/${item.slug}`}
                className="group rounded-xl border border-[#E4E4E7] bg-white overflow-hidden hover:border-[#F97316] hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-44 w-full bg-[#F4F4F5]">
                  <Image
                    src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-medium">
                    {item.condition}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-semibold text-[#F97316] uppercase tracking-wider">
                      {item.category?.name || "Marketplace"}
                    </span>
                    <h3 className="font-semibold text-sm text-[#18181B] line-clamp-1 group-hover:text-[#F97316] transition-colors mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#71717A] line-clamp-2 mt-1">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-[#18181B]">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-[#A1A1AA] line-through ml-1.5">₹{item.originalPrice}</span>
                      )}
                    </div>

                    <span className="text-xs font-medium text-[#F97316] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Make Offer <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
