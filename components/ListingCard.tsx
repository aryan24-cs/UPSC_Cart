"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";

import { getListingImageUrl, DEFAULT_FALLBACK_IMAGE } from "@/lib/images";

export interface ListingCardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  condition: string;
  status: string;
  isNegotiable?: boolean;
  distanceStr?: string | null;
  images: { url: string }[];
  category: { name: string; slug: string };
  location: { name: string };
  seller?: {
    name: string;
    isVerified: boolean;
  };
  createdAt: string | Date;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string, state: boolean) => void;
}

export default function ListingCard({
  id,
  slug,
  title,
  price,
  originalPrice,
  condition,
  status,
  isNegotiable = true,
  images,
  location,
  createdAt,
  isFavorited = false,
  onFavoriteToggle,
}: ListingCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [animating, setAnimating] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getListingImageUrl(images));

  const formatTimeAgo = (dateStr: string | Date) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !favorited;
    setFavorited(nextState);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 200);

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      if (onFavoriteToggle) onFavoriteToggle(id, nextState);
    } catch (err) {
      console.error(err);
      setFavorited(!nextState);
    }
  };

  const conditionLabel =
    condition === "LIKE_NEW" ? "Like New" : condition === "NEW" ? "Brand New" : condition === "FAIR" ? "Fair" : "Good";

  return (
    <div className="group relative flex flex-col rounded-xl border border-[#E4E4E7] bg-white transition-all duration-150 hover:border-[#D4D4D8] hover:-translate-y-0.5 w-full min-w-0 overflow-hidden">
      <Link href={`/listing/${slug}`} className="flex flex-col h-full w-full min-w-0">
        {/* Image Container */}
        <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-[#F4F4F5] shrink-0">
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
            unoptimized
          />

          {/* Reserved / Sold Badge overlay if not active */}
          {status !== "ACTIVE" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-2 text-center">
              <span className="rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-white bg-black/80">
                {status}
              </span>
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label="Save to favorites"
            className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 transition-transform ${
              animating ? "scale-125" : "hover:scale-105 active:scale-95"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 transition-colors ${
                favorited
                  ? "fill-[#DC2626] text-[#DC2626]"
                  : "text-[#71717A] hover:text-[#DC2626]"
              }`}
            />
          </button>
        </div>

        {/* Content Details */}
        <div className="flex flex-1 flex-col p-3 sm:p-3.5 min-w-0">
          {/* Condition Tag */}
          <div className="mb-1">
            <span className="inline-block text-[11px] font-medium text-[#71717A] bg-[#F4F4F5] px-1.5 py-0.5 rounded">
              {conditionLabel}
            </span>
          </div>

          {/* Title */}
          <h3 className="line-clamp-1 text-sm sm:text-[15px] font-medium text-[#18181B] group-hover:text-[#F97316] transition-colors mb-1 truncate">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-base sm:text-lg font-semibold text-[#18181B]">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {isNegotiable && (
              <span className="text-xs text-[#71717A]">
                · Negotiable
              </span>
            )}
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-[#A1A1AA] line-through ml-auto">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Location & Time */}
          <div className="mt-auto pt-2 border-t border-[#F4F4F5] flex items-center justify-between text-xs text-[#71717A] min-w-0">
            <span className="truncate pr-1">
              📍 {location?.name || "Old Rajinder Nagar"}
            </span>
            <span className="shrink-0 text-[#A1A1AA]">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
