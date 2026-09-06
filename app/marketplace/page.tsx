"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  X,
  Check,
} from "lucide-react";
import ListingCard, { ListingCardProps } from "@/components/ListingCard";

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialLocation = searchParams.get("location") || "all";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";
  const initialCondition = searchParams.get("condition") || "all";
  const initialSort = searchParams.get("sort") || "newest";

  const [listings, setListings] = useState<ListingCardProps[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [condition, setCondition] = useState(initialCondition);
  const [sort, setSort] = useState(initialSort);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      });

    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        if (data.locations) setLocations(data.locations);
      });
  }, []);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (category && category !== "all") params.append("category", category);
      if (location && location !== "all") params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (condition && condition !== "all") params.append("condition", condition);
      if (sort) params.append("sort", sort);

      router.replace(`/marketplace?${params.toString()}`);

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
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, location, condition, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setMinPrice("");
    setMaxPrice("");
    setCondition("all");
    setSort("newest");
    router.replace("/marketplace");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E4E7] mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
            Marketplace
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            {totalCount} items in {location === "all" ? "All Hubs" : locations.find(l => l.slug === location)?.name || "hub"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Filter listings"
            className="lg:hidden flex items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-medium text-[#18181B]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#71717A]" />
            <span>Filters</span>
            {category !== "all" || location !== "all" || condition !== "all" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]"></span>
            ) : null}
          </button>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-medium text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="views">Most viewed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar (Restrained, using dividers instead of heavy cards) */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
            <span className="text-xs font-semibold text-[#18181B] uppercase tracking-wider">Filters</span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          {/* Category Filter */}
          <div className="pb-5 border-b border-[#E4E4E7]">
            <label className="block text-xs font-semibold text-[#18181B] mb-2.5">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setCategory("all")}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                  category === "all"
                    ? "font-semibold text-[#18181B] bg-[#F4F4F5]"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                <span>All Categories</span>
                {category === "all" && <Check className="h-3 w-3 text-[#F97316]" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    category === cat.slug
                      ? "font-semibold text-[#18181B] bg-[#F4F4F5]"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {category === cat.slug && <Check className="h-3 w-3 text-[#F97316]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Location / Hub Filter */}
          <div className="pb-5 border-b border-[#E4E4E7]">
            <label className="block text-xs font-semibold text-[#18181B] mb-2">
              Coaching Hub
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
            >
              <option value="all">All Hubs (Delhi NCR & Beyond)</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="pb-5 border-b border-[#E4E4E7]">
            <label className="block text-xs font-semibold text-[#18181B] mb-2">
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] px-2.5 py-1.5 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
              />
              <span className="text-[#A1A1AA] text-xs">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] px-2.5 py-1.5 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
              />
            </div>
            <button
              onClick={fetchListings}
              className="mt-2 w-full rounded-lg border border-[#E4E4E7] bg-white py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-2">
              Condition
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "All", value: "all" },
                { label: "Like New", value: "like_new" },
                { label: "Good", value: "good" },
                { label: "Brand New", value: "new" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors text-center cursor-pointer ${
                    condition === c.value
                      ? "border-[#18181B] bg-[#18181B] text-white"
                      : "border-[#E4E4E7] text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAF9]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="lg:col-span-3 space-y-4 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-[#E4E4E7] bg-white p-3 space-y-2.5">
                  <div className="aspect-square w-full rounded-lg bg-[#F4F4F5]"></div>
                  <div className="h-4 w-3/4 rounded bg-[#F4F4F5]"></div>
                  <div className="h-3 w-1/2 rounded bg-[#F4F4F5]"></div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-white p-12 text-center">
              <h3 className="text-base font-semibold text-[#18181B]">No listings match your filters</h3>
              <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                Try widening your price range, choosing another location, or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-medium text-white hover:bg-[#27272A] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {listings.map((item) => (
                <ListingCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Bottom Sheet Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-xs p-0 lg:hidden animate-in fade-in duration-150">
          <div className="w-full max-h-[85dvh] flex flex-col rounded-t-2xl bg-white shadow-xl animate-in slide-in-from-bottom duration-150 pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex justify-center pt-2.5 pb-1 shrink-0">
              <div className="h-1 w-10 rounded-full bg-[#E4E4E7]"></div>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E4E4E7] shrink-0">
              <h3 className="font-semibold text-base text-[#18181B]">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#71717A] hover:text-[#18181B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-2">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCategory("all")}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                      category === "all"
                        ? "bg-[#18181B] text-white font-medium"
                        : "bg-[#F4F4F5] text-[#71717A]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.slug)}
                      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                        category === c.slug
                          ? "bg-[#18181B] text-white font-medium"
                          : "bg-[#F4F4F5] text-[#71717A]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-[#E4E4E7] p-2.5 text-xs text-[#18181B] bg-white"
                >
                  <option value="all">All Hubs</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.slug}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Price (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E7] p-2 text-xs text-[#18181B]"
                  />
                  <span className="text-[#A1A1AA] text-xs">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg border border-[#E4E4E7] p-2 text-xs text-[#18181B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Condition</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "All", val: "all" },
                    { label: "Like New", val: "like_new" },
                    { label: "Good", val: "good" },
                    { label: "Brand New", val: "new" },
                  ].map((c) => (
                    <button
                      key={c.val}
                      onClick={() => setCondition(c.val)}
                      className={`rounded-lg border p-2 text-xs font-medium transition-colors ${
                        condition === c.val
                          ? "border-[#18181B] bg-[#18181B] text-white"
                          : "border-[#E4E4E7] text-[#71717A]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t border-[#E4E4E7] bg-white shrink-0">
              <button
                onClick={handleResetFilters}
                className="flex-1 rounded-lg border border-[#E4E4E7] py-2.5 text-xs font-medium text-[#18181B]"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  fetchListings();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-2 rounded-lg bg-[#F97316] py-2.5 text-xs font-semibold text-white hover:bg-[#EA580C]"
              >
                Show {listings.length} items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#71717A]">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
