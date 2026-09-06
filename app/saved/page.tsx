"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import ListingCard, { ListingCardProps } from "@/components/ListingCard";

export default function SavedItemsPage() {
  const [favorites, setFavorites] = useState<ListingCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      if (data.favorites) setFavorites(data.favorites);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (id: string, state: boolean) => {
    if (!state) {
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0">
      <div className="pb-4 border-b border-[#E4E4E7] mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">Saved Items</h1>
        <p className="text-xs text-[#71717A] mt-0.5">
          Books, notes, and furniture bookmarked for later review
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#E4E4E7] bg-white p-3 h-60"></div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-white p-12 text-center max-w-md mx-auto">
          <Heart className="h-6 w-6 text-[#A1A1AA] mx-auto mb-2" />
          <h2 className="text-base font-semibold text-[#18181B]">No saved items yet</h2>
          <p className="text-xs text-[#71717A] mt-1">
            Tap the heart icon on any listing in the marketplace to bookmark it here.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#27272A] transition-colors"
          >
            <span>Explore Marketplace</span> <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {favorites.map((item) => (
            <ListingCard
              key={item.id}
              {...item}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
