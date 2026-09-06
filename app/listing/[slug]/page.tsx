"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Flag,
  MessageSquare,
  DollarSign,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/images";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const slug = resolvedParams.slug;

  const [listing, setListing] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);
  const [offerAmount, setOfferAmount] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState<string>("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("SCAM");
  const [reportDetails, setReportDetails] = useState<string>("");
  const [isStartingChat, setIsStartingChat] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${slug}`);
      const data = await res.json();
      if (data.listing) {
        setListing(data.listing);
        setIsFavorited(data.listing.isFavorited);
        if (data.listing.images && data.listing.images.length > 0) {
          setSelectedImage(data.listing.images[0].url);
        }
        const suggested = Math.round(data.listing.price * 0.85);
        setOfferAmount(suggested.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [slug]);

  const handleToggleFavorite = async () => {
    if (!listing) return;
    const next = !isFavorited;
    setIsFavorited(next);
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
    } catch (err) {
      setIsFavorited(!next);
    }
  };

  const handleStartChat = async () => {
    if (!listing) return;
    setIsStartingChat(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          initialMessage: `Hi, I am interested in "${listing.title}". Is it still available?`,
        }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.conversationId) {
        router.push(`/chat/${data.conversationId}`);
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !offerAmount) return;
    setIsSubmittingOffer(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          amount: offerAmount,
          message: offerMessage,
        }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        setIsOfferModalOpen(false);
        router.push(`/chat/${data.conversationId}`);
      } else {
        alert(data.error || "Failed to make offer");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "LISTING",
          targetId: listing.id,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      alert("Thank you! Report submitted to moderators.");
      setIsReportModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#18181B] border-t-transparent mx-auto mb-4"></div>
        <p className="text-xs text-[#71717A]">Loading listing details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h2 className="text-base font-semibold text-[#18181B]">Listing Not Found</h2>
        <p className="text-xs text-[#71717A] mt-1">This item may have been sold or removed by the seller.</p>
        <Link
          href="/marketplace"
          className="mt-5 inline-block rounded-lg bg-[#18181B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#27272A] transition-colors"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const conditionBadge =
    listing.condition === "LIKE_NEW"
      ? "Like New"
      : listing.condition === "NEW"
      ? "Brand New"
      : "Good condition";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 w-full min-w-0">
      {/* Back Button */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#18181B] mb-5 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery & Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {/* Main Image */}
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-[#E4E4E7] bg-[#F4F4F5]">
            <Image
              src={selectedImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80"}
              alt={listing.title}
              fill
              priority
              className="object-cover"
              onError={() => setSelectedImage(DEFAULT_FALLBACK_IMAGE)}
              unoptimized
            />

            {/* Status Overlay if Reserved / Sold */}
            {listing.status !== "ACTIVE" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 text-center">
                <span className="rounded px-3 py-1.5 text-xs font-semibold tracking-wide uppercase text-white bg-black/80">
                  {listing.status}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {listing.images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border transition-all ${
                    selectedImage === img.url
                      ? "border-[#18181B] ring-1 ring-[#18181B]"
                      : "border-[#E4E4E7] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={`Photo ${idx + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="pt-2">
            <h2 className="text-base font-semibold text-[#18181B] mb-2">Description</h2>
            <p className="text-sm text-[#404040] leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Specs List */}
          <div className="pt-4 border-t border-[#E4E4E7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-3">Item Details</h3>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <div>
                <span className="text-[#71717A] block">Category</span>
                <span className="font-medium text-[#18181B]">{listing.category?.name}</span>
              </div>

              {listing.subcategory && (
                <div>
                  <span className="text-[#71717A] block">Subject / Type</span>
                  <span className="font-medium text-[#18181B]">{listing.subcategory}</span>
                </div>
              )}

              {listing.edition && (
                <div>
                  <span className="text-[#71717A] block">Edition</span>
                  <span className="font-medium text-[#18181B]">{listing.edition}</span>
                </div>
              )}

              {listing.brand && (
                <div>
                  <span className="text-[#71717A] block">Publisher / Brand</span>
                  <span className="font-medium text-[#18181B]">{listing.brand}</span>
                </div>
              )}

              {listing.reasonForSelling && (
                <div className="col-span-2">
                  <span className="text-[#71717A] block">Reason for Selling</span>
                  <span className="font-medium text-[#18181B]">{listing.reasonForSelling}</span>
                </div>
              )}
            </div>
          </div>

          {/* Safe Meetup Guidelines */}
          <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] p-4 text-xs">
            <h4 className="font-semibold text-[#18181B] flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="h-4 w-4 text-[#16A34A] shrink-0" /> Safe Meetup in Coaching Hub
            </h4>
            <ul className="space-y-1 text-[#71717A] list-disc list-inside">
              <li>Meet in public spots (ORN Bada Bazar, Batra Cinema, or Metro gate).</li>
              <li>Inspect pages, bindings, or electronics carefully before paying.</li>
              <li>Direct student-to-student exchange with zero broker commission.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Listing Information & CTAs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 min-w-0">
          <div className="space-y-4">
            {/* Condition badge & Location */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block text-xs font-medium text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded">
                {conditionBadge}
              </span>
              <button
                onClick={handleToggleFavorite}
                aria-label="Save to favorites"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#71717A] hover:text-[#DC2626] transition-colors"
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-600 text-red-600" : ""}`} />
              </button>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] leading-snug">
              {listing.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#18181B]">
                ₹{listing.price.toLocaleString("en-IN")}
              </span>
              {listing.isNegotiable && (
                <span className="text-xs text-[#71717A]">
                  · Negotiable
                </span>
              )}
              {listing.originalPrice && (
                <span className="text-sm text-[#A1A1AA] line-through ml-2">
                  ₹{listing.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Location & Relative Time */}
            <p className="text-xs text-[#71717A] flex items-center gap-1.5 pt-1 border-t border-[#E4E4E7]">
              <span>📍 {listing.location?.name || "Old Rajinder Nagar"}</span>
              <span>·</span>
              <span>{listing.distanceStr || "Coaching Hub"}</span>
              <span>·</span>
              <span>{listing.views} views</span>
            </p>

            {/* Primary & Secondary Action Buttons (Desktop) */}
            <div className="hidden lg:block space-y-2.5 pt-4">
              <button
                onClick={handleStartChat}
                disabled={isStartingChat}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#F97316] py-3 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{isStartingChat ? "Opening Chat..." : "Chat with Seller"}</span>
              </button>

              {listing.isNegotiable && listing.status === "ACTIVE" && (
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#E4E4E7] bg-white py-2.5 text-sm font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors cursor-pointer"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Make an Offer</span>
                </button>
              )}
            </div>

            {/* Share & Report links */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E7] text-xs text-[#71717A]">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-[#18181B] transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copied ? "Link Copied! ✓" : "Share"}</span>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1 hover:text-[#DC2626] transition-colors cursor-pointer"
              >
                <Flag className="h-3.5 w-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>

          {/* Clean Seller Info Block */}
          <div className="pt-5 border-t border-[#E4E4E7] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
              Seller
            </h3>

            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]">
                <Image
                  src={listing.seller?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                  alt={listing.seller?.name || "Seller"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#18181B] truncate">{listing.seller?.name}</span>
                  {listing.seller?.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#71717A]">📍 {listing.seller?.coachingHub || "Old Rajinder Nagar"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#71717A] pt-1">
              <span>Response: <strong className="text-[#18181B] font-medium">{listing.seller?.responseTime || "< 15 mins"}</strong></span>
              <span>·</span>
              <span>Rate: <strong className="text-[#18181B] font-medium">{listing.seller?.responseRate || "98%"}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Make Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full sm:max-w-md flex flex-col rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-xl border border-[#E4E4E7] animate-in slide-in-from-bottom sm:zoom-in-95 duration-150 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-semibold text-base text-[#18181B]">Make an Offer</h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-[#71717A] hover:text-[#18181B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMakeOffer} className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-[#71717A]">
                  Listed price: <strong className="text-[#18181B]">₹{listing.price}</strong>
                </p>
                <label className="block text-xs font-semibold text-[#18181B] mt-2 mb-1">
                  Your Offer Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E7] p-2.5 text-base font-semibold text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
                  placeholder="e.g. 250"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                {[0.9, 0.85, 0.75].map((factor) => {
                  const val = Math.round(listing.price * factor);
                  return (
                    <button
                      key={factor}
                      type="button"
                      onClick={() => setOfferAmount(val.toString())}
                      className="flex-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] py-1.5 text-xs font-medium hover:bg-[#F4F4F5] text-[#18181B]"
                    >
                      ₹{val} ({-Math.round((1 - factor) * 100)}%)
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1">
                  Note to Seller (Optional)
                </label>
                <input
                  type="text"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="e.g. Can pick up today outside Vajiram"
                  className="w-full rounded-lg border border-[#E4E4E7] p-2.5 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="flex-1 rounded-lg border border-[#E4E4E7] py-2.5 text-xs font-medium text-[#18181B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="flex-1 rounded-lg bg-[#F97316] py-2.5 text-xs font-semibold text-white hover:bg-[#EA580C]"
                >
                  {isSubmittingOffer ? "Sending..." : "Send Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full sm:max-w-md flex flex-col rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-xl border border-[#E4E4E7] animate-in slide-in-from-bottom sm:zoom-in-95 duration-150 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
              <h3 className="font-semibold text-base text-[#18181B] flex items-center gap-1.5">
                <Flag className="h-4 w-4 text-[#DC2626]" /> Report Listing
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 text-[#71717A] hover:text-[#18181B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReport} className="space-y-3.5 mt-3">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E7] p-2 text-xs text-[#18181B]"
                >
                  <option value="SCAM">Suspicious / Potential Scam</option>
                  <option value="FAKE_LISTING">Misrepresented Condition / Fake</option>
                  <option value="WRONG_CATEGORY">Wrong Category / Commercial Spam</option>
                  <option value="DUPLICATE">Repeated Duplicate Posting</option>
                  <option value="OTHER">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1">Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this listing violates community standards..."
                  className="w-full rounded-lg border border-[#E4E4E7] p-2.5 text-xs text-[#18181B]"
                ></textarea>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="flex-1 rounded-lg border border-[#E4E4E7] py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#DC2626] py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E4E4E7] bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] lg:hidden flex items-center gap-2">
        <button
          onClick={handleStartChat}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] py-2.5 text-xs font-semibold text-white hover:bg-[#EA580C] touch-target"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat with Seller</span>
        </button>

        {listing.isNegotiable && listing.status === "ACTIVE" && (
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="flex-1 rounded-lg border border-[#E4E4E7] bg-white py-2.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] touch-target"
          >
            Make Offer
          </button>
        )}
      </div>
    </div>
  );
}
