"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  RotateCw,
  DoorOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import ListingCard, { ListingCardProps } from "@/components/ListingCard";
import WelcomeGateway from "@/components/WelcomeGateway";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const [listings, setListings] = useState<ListingCardProps[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [rooms, setRooms] = useState<any[]>([]);

  const fetchListings = async (categorySlug = selectedCategory, search = searchQuery) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug && categorySlug !== "all") params.append("category", categorySlug);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      if (data.listings) {
        setListings(data.listings);
        setTotalCount(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.rooms) {
        setRooms(data.rooms.slice(0, 2));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setAuthChecked(true);
      });

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error(err));

    fetchListings();
    fetchRooms();
  }, []);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    fetchListings(slug, searchQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings(selectedCategory, searchQuery);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchListings(selectedCategory, searchQuery);
  };

  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E4E4E7] border-t-[#F97316]" />
      </div>
    );
  }

  if (!currentUser && !isGuest) {
    return <WelcomeGateway onBrowseAsGuest={() => setIsGuest(true)} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full min-w-0">
      {/* Calm, Direct Hero Section */}
      <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#18181B] tracking-tight">
          Buy & sell essentials near you.
        </h1>
        <p className="text-sm sm:text-base text-[#71717A] mt-2">
          Books, notes, furniture, electronics and rooms for UPSC aspirants.
        </p>

        {/* Clean Search Input */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search books, notes, furniture, rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E4E4E7] bg-white py-3 pl-11 pr-24 text-sm text-[#18181B] placeholder-[#A1A1AA] shadow-2xs focus:border-[#F97316] focus:outline-hidden transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 rounded-lg bg-[#F97316] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#EA580C] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-[#18181B] text-white"
                : "bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            All
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-[#18181B] text-white"
                    : "bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          <Link
            href="/rooms"
            className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]"
          >
            Rooms
          </Link>

          <Link
            href="/services"
            className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]"
          >
            Services
          </Link>
        </div>
      </div>

      {/* Clean Listings Toolbar */}
      <div className="flex items-center justify-between py-3 border-b border-[#E4E4E7] mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#18181B]">
            {totalCount} listings
          </h2>
          {selectedCategory !== "all" && (
            <span className="text-xs text-[#71717A]">
              in {categories.find((c) => c.slug === selectedCategory)?.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/marketplace${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#71717A]" />
            <span>Filters</span>
          </Link>

          <button
            onClick={handleRefresh}
            aria-label="Refresh listings"
            className="rounded-lg border border-[#E4E4E7] bg-white p-1.5 text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#F97316]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Listings Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#E4E4E7] bg-white p-3 space-y-3">
              <div className="aspect-square w-full rounded-lg bg-[#F4F4F5]"></div>
              <div className="h-4 w-3/4 rounded bg-[#F4F4F5]"></div>
              <div className="h-3 w-1/2 rounded bg-[#F4F4F5]"></div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E4E4E7] bg-white py-16 text-center p-6">
          <h3 className="font-semibold text-base text-[#18181B]">No listings found</h3>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm">
            Try adjusting your search keyword or clearing category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              fetchListings("all", "");
            }}
            className="mt-4 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#27272A] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {listings.map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      )}

      {/* Rooms Section (Airbnb-style clean information density) */}
      {rooms.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#E4E4E7]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-[#18181B]">
                Study Rooms & PGs near Coaching Hubs
              </h2>
              <p className="text-xs text-[#71717A] mt-0.5">Direct student & landlord listings with zero brokerage</p>
            </div>
            <Link
              href="/rooms"
              className="text-xs font-semibold text-[#F97316] hover:underline flex items-center gap-1 shrink-0"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => {
              const photos = JSON.parse(room.images || "[]");
              return (
                <Link
                  key={room.id}
                  href={`/rooms/${room.slug}`}
                  className="flex flex-col sm:flex-row rounded-xl border border-[#E4E4E7] bg-white overflow-hidden hover:border-[#D4D4D8] transition-colors group"
                >
                  <div className="relative h-44 sm:h-auto sm:w-48 bg-[#F4F4F5] shrink-0">
                    <Image
                      src={photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80"}
                      alt={room.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className="text-base font-semibold text-[#18181B]">
                          ₹{room.rent.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#71717A]">/ month</span>
                      </div>
                      <h3 className="font-medium text-sm text-[#18181B] group-hover:text-[#F97316] transition-colors line-clamp-1">
                        {room.title}
                      </h3>
                      <p className="text-xs text-[#71717A] mt-1 line-clamp-1">
                        📍 {room.location?.name} · {room.distanceToCoaching}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <span className="text-[11px] font-medium text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded">
                          {room.roomType}
                        </span>
                        <span className="text-[11px] font-medium text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded">
                          {room.furnishing}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#F4F4F5] flex items-center justify-between text-xs text-[#71717A]">
                      <span className="text-emerald-600 font-medium">Available {room.availableFrom}</span>
                      <span className="font-medium text-[#18181B] group-hover:text-[#F97316]">Details →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* How It Works & Trust (Clean typography with dividers) */}
      <div className="mt-14 pt-10 border-t border-[#E4E4E7]">
        <div className="max-w-2xl mb-8">
          <h2 className="text-lg font-semibold text-[#18181B]">
            How UPSC Cart works
          </h2>
          <p className="text-xs text-[#71717A] mt-1">
            A peer-to-peer community built for civil services aspirants in Old Rajinder Nagar, Mukherjee Nagar, and Karol Bagh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <span className="text-xs font-semibold text-[#F97316]">01</span>
            <h3 className="text-sm font-semibold text-[#18181B] mt-1">Discover nearby</h3>
            <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
              Find reference books, Vision IAS materials, notes, or room furniture posted by fellow aspirants in your coaching hub.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#F97316]">02</span>
            <h3 className="text-sm font-semibold text-[#18181B] mt-1">Chat & negotiate</h3>
            <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
              Message the seller directly, inspect condition photos, make counter offers, and agree on a fair price without brokers.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#F97316]">03</span>
            <h3 className="text-sm font-semibold text-[#18181B] mt-1">Meet safely & transact</h3>
            <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
              Meet in a public hub (library, coaching center, or metro station) to check the item and complete the transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
