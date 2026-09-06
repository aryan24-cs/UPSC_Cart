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
  Smartphone,
  ExternalLink,
  BookOpen,
  Home,
  MessageSquare,
  Zap,
  MapPin,
  Sparkles,
  User,
  Shield,
  HelpCircle,
  ChevronDown,
  Mail,
  Flame,
} from "lucide-react";
import ListingCard, { ListingCardProps } from "@/components/ListingCard";

const STATIC_CATEGORIES = [
  { id: "books", name: "Books", slug: "books" },
  { id: "notes", name: "Notes", slug: "notes" },
  { id: "test-series", name: "Test Series", slug: "test-series" },
  { id: "furniture", name: "Furniture", slug: "furniture" },
  { id: "appliances", name: "Appliances", slug: "appliances" },
  { id: "electronics", name: "Electronics", slug: "electronics" },
  { id: "stationery", name: "Stationery", slug: "stationery" },
  { id: "room-essentials", name: "Room Essentials", slug: "room-essentials" },
];

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const [listings, setListings] = useState<ListingCardProps[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>(STATIC_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [rooms, setRooms] = useState<any[]>([]);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const handleDemoLogin = async (role: "USER" | "ADMIN") => {
    setDemoLoading(role);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        if (role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        alert(data.error || "Failed to log in as demo account.");
        setDemoLoading(null);
      }
    } catch (err) {
      console.error(err);
      alert("Network error logging in.");
      setDemoLoading(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* 1. HERO SECTION (Matching chatsapp-4a54d.web.app) */}
      <section className="bg-gradient-to-b from-amber-50/40 via-white to-[#FAFAF9] border-b border-[#E4E4E7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E4E4E7] px-4 py-1.5 text-xs font-semibold text-[#18181B] shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#F97316] animate-pulse"></span>
            <span>Zero Commission • Direct In-App Chat</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#18181B] tracking-tight leading-[1.15]">
            Buy & Sell UPSC Essentials. <br className="hidden sm:inline" />
            Find Rooms Near Coaching Hubs.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-[#71717A] max-w-2xl mx-auto leading-relaxed">
            UPSC Cart helps aspirants buy & sell books, notes, furniture, and electronics — and find rooms in popular student areas. Chat inside the app. Direct deals. Zero commission.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.upsccart.upsc.cart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#EA580C] shadow-sm transition-all hover:scale-[1.02]"
            >
              <Smartphone className="h-4 w-4" />
              <span>Get on Google Play</span>
            </a>

            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-[#18181B] hover:bg-[#FAFAF9] shadow-2xs transition-colors"
            >
              <span>See how it works</span>
              <ArrowRight className="h-4 w-4 text-[#71717A]" />
            </a>

            <a
              href="https://t.me/+0_sR0hPmNMA5OWM1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-[#EFF6FF] px-4 py-3 text-xs sm:text-sm font-semibold text-[#1D4ED8] hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Join Channel</span>
            </a>
          </div>

          {/* Demo Login Quick Switch Strip */}
          {!currentUser && (
            <div className="pt-4 max-w-xl mx-auto">
              <div className="rounded-xl border border-[#E4E4E7] bg-white/80 backdrop-blur-xs p-3 flex flex-wrap items-center justify-between gap-3 text-left">
                <div>
                  <p className="text-xs font-semibold text-[#18181B]">Testing the Web App?</p>
                  <p className="text-[11px] text-[#71717A]">One-click access with pre-seeded demo accounts</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("USER")}
                    disabled={demoLoading !== null}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#F97316] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors disabled:opacity-50"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>{demoLoading === "USER" ? "Logging in..." : "Demo User"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("ADMIN")}
                    disabled={demoLoading !== null}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#18181B] px-3 py-1.5 text-xs font-medium text-white hover:bg-black transition-colors disabled:opacity-50"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>{demoLoading === "ADMIN" ? "Logging in..." : "Demo Admin"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-[#A1A1AA]" />
              <input
                type="text"
                placeholder="Search books, notes, furniture, rooms near ORN, Mukherjee Nagar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E4E4E7] bg-white py-4 pl-12 pr-28 text-sm text-[#18181B] placeholder-[#A1A1AA] shadow-xs focus:border-[#F97316] focus:outline-hidden transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 rounded-xl bg-[#F97316] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#EA580C] shadow-2xs transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="mt-5 flex items-center justify-center flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#18181B] text-white shadow-xs"
                  : "bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B] hover:border-[#D4D4D8]"
              }`}
            >
              All Items
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#18181B] text-white shadow-xs"
                      : "bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B] hover:border-[#D4D4D8]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}

            <Link
              href="/rooms"
              className="rounded-full px-4 py-1.5 text-xs font-medium bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors"
            >
              🏠 Rooms & PGs
            </Link>

            <Link
              href="/services"
              className="rounded-full px-4 py-1.5 text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-colors"
            >
              🍱 Services & Tiffins
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE MARKETPLACE SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between py-3 border-b border-[#E4E4E7] mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#F97316]" />
            <h2 className="text-lg font-bold text-[#18181B]">
              {totalCount} Student Listings
            </h2>
            {selectedCategory !== "all" && (
              <span className="text-xs text-[#71717A] bg-gray-100 px-2 py-0.5 rounded-full">
                {categories.find((c) => c.slug === selectedCategory)?.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/marketplace${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
              className="flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#71717A]" />
              <span>Full Marketplace</span>
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

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {listings.map((item) => (
              <ListingCard key={item.id} {...item} />
            ))}
          </div>
        )}

        {/* Live Rooms Section Preview */}
        {rooms.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#E4E4E7]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#18181B]">
                  Study Rooms & PGs Near Coaching Hubs
                </h2>
                <p className="text-xs text-[#71717A] mt-0.5">
                  Direct student & landlord room listings with zero brokerage in Rajinder Nagar & Mukherjee Nagar
                </p>
              </div>
              <Link
                href="/rooms"
                className="text-xs font-semibold text-[#F97316] hover:underline flex items-center gap-1 shrink-0"
              >
                View All Rooms <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => {
                const photos = JSON.parse(room.images || "[]");
                return (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.slug}`}
                    className="flex flex-col sm:flex-row rounded-xl border border-[#E4E4E7] bg-white overflow-hidden hover:border-[#D4D4D8] transition-all hover:shadow-xs group"
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
                          <span className="text-[#18181B] font-bold text-base">
                            ₹{room.rent.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-[#71717A]">/ month</span>
                        </div>
                        <h3 className="font-semibold text-sm text-[#18181B] group-hover:text-[#F97316] transition-colors line-clamp-1">
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
      </section>

      {/* 3. FEATURES SECTION (#features - Matching chatsapp-4a54d.web.app) */}
      <section id="features" className="bg-white border-t border-[#E4E4E7] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl text-center mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight">
              Everything Aspirants Need — In One App
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] mt-3 leading-relaxed">
              From books and handwritten notes to study tables and coolers — plus rooms near coaching hubs. UPSC Cart keeps it simple: discover, chat, meet, and close the deal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] p-6 space-y-3 hover:border-[#D4D4D8] transition-all hover:shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#F97316]">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Buy & Sell UPSC Essentials</h3>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Books, notes, test series, magazines, stationery, electronics, furniture, and room essentials — organized specifically for civil services aspirants.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] p-6 space-y-3 hover:border-[#D4D4D8] transition-all hover:shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Rooms & Roommates</h3>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Find room listings and connect with other students for shared stays near Rajinder Nagar, Mukherjee Nagar, and nearby coaching hubs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] p-6 space-y-3 hover:border-[#D4D4D8] transition-all hover:shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Direct In-App Chat</h3>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Negotiate price and pickup safely using in-app chat. No need to share your personal mobile number until you are ready.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] p-6 space-y-3 hover:border-[#D4D4D8] transition-all hover:shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Zero Commission, Fast Posting</h3>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Create a listing in seconds. Upload photos, set your price, and start receiving direct messages from interested students quickly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] p-6 space-y-3 hover:border-[#D4D4D8] transition-all hover:shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Hyper-Local Discovery</h3>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                See listings directly around you to save time and transport expenses. Local meetups are simpler when items are in your lane.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAF9] p-6 space-y-3 hover:border-[#D4D4D8] transition-all hover:shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Student-First Experience</h3>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Built for aspirants: clear categories, fast search, condition tags, and a distraction-free experience focused on getting things done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (#how - Matching chatsapp-4a54d.web.app) */}
      <section id="how" className="bg-[#FAFAF9] border-t border-[#E4E4E7] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-[#71717A] mt-2">
              Simple steps to buy, sell, or find rooms. No complicated process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-[#F97316] font-bold text-xs">
                  A
                </span>
                <h3 className="text-xl font-bold text-[#18181B]">For Buyers</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#18181B] text-white text-xs font-bold mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Search UPSC Essentials</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Search books, notes, furniture, electronics, and study rooms.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#18181B] text-white text-xs font-bold mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Filter by Category & Area</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Filter by coaching hub (ORN, Mukherjee Nagar) for faster discovery.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#18181B] text-white text-xs font-bold mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Direct In-App Chat</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Chat inside the app to confirm condition, photos, and negotiate price.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#18181B] text-white text-xs font-bold mt-0.5">
                    4
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Meet Nearby & Close Deal</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Meet at a nearby library or coaching center and complete the transaction.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Sellers */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#E4E4E7] pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                  B
                </span>
                <h3 className="text-xl font-bold text-[#18181B]">For Sellers</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white text-xs font-bold mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Post in Seconds</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Upload photos, add a clear title and description of your item.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white text-xs font-bold mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Set Fair Price & Location</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Add condition tag (New, Like New, Good) and select your area.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white text-xs font-bold mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Receive Messages</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Get direct chat inquiries and price counter offers from local aspirants.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-white text-xs font-bold mt-0.5">
                    4
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#18181B]">Close Faster Locally</h4>
                    <p className="text-xs text-[#71717A] mt-0.5">Sell directly to nearby buyers without paying any commission or shipping fees.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DOWNLOAD APP BANNER (#download - Matching chatsapp-4a54d.web.app) */}
      <section id="download" className="bg-[#18181B] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#27272A] px-3.5 py-1 text-xs font-medium text-orange-400">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile App Available</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Download UPSC Cart
          </h2>

          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-xl mx-auto leading-relaxed">
            Join the student marketplace built for UPSC aspirants. Buy & sell essentials, chat securely, and find rooms near coaching hubs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.upsccart.upsc.cart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#F97316] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#EA580C] shadow-lg transition-all hover:scale-[1.02]"
            >
              <Smartphone className="h-5 w-5" />
              <span>Download on Google Play</span>
            </a>

            <a
              href="mailto:support@upsccart.shop"
              className="inline-flex items-center gap-2 rounded-xl border border-[#3F3F46] bg-[#27272A] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#3F3F46] transition-colors"
            >
              <Mail className="h-4 w-4 text-[#F97316]" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (#faq - Matching chatsapp-4a54d.web.app) */}
      <section id="faq" className="bg-white border-t border-[#E4E4E7] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#71717A] mt-2">
              Quick answers to common questions about UPSC Cart.
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAF9] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
              >
                <span>Is UPSC Cart free to use?</span>
                <ChevronDown className={`h-4 w-4 text-[#71717A] transition-transform ${openFaq === 0 ? "rotate-180" : ""}`} />
              </button>
              {openFaq === 0 && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-[#E4E4E7] pt-3 bg-white">
                  Yes. Browsing, posting listings, and chatting inside the app is completely free. Deals are made directly between students with zero platform commission.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAF9] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
              >
                <span>Which coaching hubs are supported?</span>
                <ChevronDown className={`h-4 w-4 text-[#71717A] transition-transform ${openFaq === 1 ? "rotate-180" : ""}`} />
              </button>
              {openFaq === 1 && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-[#E4E4E7] pt-3 bg-white">
                  UPSC Cart is built for hyper-local student areas. Old Rajinder Nagar (ORN), Mukherjee Nagar, Karol Bagh, Patel Nagar, and Laxmi Nagar are primary hubs, and coverage expands as students post in more areas.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAF9] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
              >
                <span>Can I find study rooms or flatmates on UPSC Cart?</span>
                <ChevronDown className={`h-4 w-4 text-[#71717A] transition-transform ${openFaq === 2 ? "rotate-180" : ""}`} />
              </button>
              {openFaq === 2 && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-[#E4E4E7] pt-3 bg-white">
                  Yes. You can explore verified room listings, twin-sharing PGs, and connect directly with fellow aspirants looking for flatmates near coaching institutes.
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAF9] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
              >
                <span>How do safety and meetups work?</span>
                <ChevronDown className={`h-4 w-4 text-[#71717A] transition-transform ${openFaq === 3 ? "rotate-180" : ""}`} />
              </button>
              {openFaq === 3 && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#71717A] leading-relaxed border-t border-[#E4E4E7] pt-3 bg-white">
                  Chat in-app, confirm details and photos clearly, and meet in a safe public place like a reading room, library, or coaching center. Avoid sharing sensitive personal financial credentials.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
