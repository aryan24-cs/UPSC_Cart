"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DoorOpen,
  Users,
  Filter,
  CheckCircle2,
  MapPin,
  ArrowRight,
  X,
  RotateCcw,
} from "lucide-react";

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState<"rooms" | "flatmates">("rooms");
  const [rooms, setRooms] = useState<any[]>([]);
  const [flatmates, setFlatmates] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter state
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [selectedFurnishing, setSelectedFurnishing] = useState("all");
  const [maxRent, setMaxRent] = useState<number>(15000);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLocation !== "all") params.append("location", selectedLocation);
      if (selectedRoomType !== "all") params.append("roomType", selectedRoomType);
      if (selectedFurnishing !== "all") params.append("furnishing", selectedFurnishing);
      if (maxRent) params.append("maxRent", maxRent.toString());

      const res = await fetch(`/api/rooms?${params.toString()}`);
      const data = await res.json();
      if (data.rooms) setRooms(data.rooms);
      if (data.flatmates) setFlatmates(data.flatmates);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        if (data.locations) setLocations(data.locations);
      });
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [selectedLocation, selectedRoomType, selectedFurnishing, maxRent]);

  const resetFilters = () => {
    setSelectedLocation("all");
    setSelectedRoomType("all");
    setSelectedFurnishing("all");
    setMaxRent(15000);
  };

  const hasActiveFilters =
    selectedLocation !== "all" ||
    selectedRoomType !== "all" ||
    selectedFurnishing !== "all" ||
    maxRent !== 15000;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E4E7] mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
            Study Rooms & Flatmates
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Single rooms, PGs with mess, and serious UPSC co-aspirants near coaching hubs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg border border-[#E4E4E7] bg-white p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "rooms"
                ? "bg-[#18181B] text-white font-semibold"
                : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            <DoorOpen className="h-3.5 w-3.5" /> Rooms & PGs
          </button>
          <button
            onClick={() => setActiveTab("flatmates")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "flatmates"
                ? "bg-[#18181B] text-white font-semibold"
                : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            <Users className="h-3.5 w-3.5" /> Find Flatmate
          </button>
        </div>
      </div>

      {activeTab === "rooms" ? (
        <div className="space-y-6">
          {/* Mobile Filter Toggle */}
          <div className="sm:hidden flex items-center justify-between gap-2">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-white py-2 px-3 text-xs font-medium text-[#18181B]"
            >
              <Filter className="h-3.5 w-3.5 text-[#71717A]" />
              <span>Filter Rooms</span>
              {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />}
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#71717A] px-2 py-1 hover:text-[#18181B]"
              >
                Reset
              </button>
            )}
          </div>

          {/* Desktop Filter Bar */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b border-[#E4E4E7]">
            {/* Hub Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Coaching Hub</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] bg-white p-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
              >
                <option value="all">All Hubs (ORN, Mukherjee Nagar, Karol Bagh)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.slug}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Room Type</label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] bg-white p-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
              >
                <option value="all">Any Type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Sharing</option>
                <option value="pg">PG with Food</option>
                <option value="flat">Full Flat</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Furnishing</label>
              <select
                value={selectedFurnishing}
                onChange={(e) => setSelectedFurnishing(e.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] bg-white p-2 text-xs text-[#18181B] focus:border-[#F97316] focus:outline-hidden"
              >
                <option value="all">Any Furnishing</option>
                <option value="furnished">Fully Furnished</option>
                <option value="semi_furnished">Semi-Furnished</option>
              </select>
            </div>

            {/* Max Rent */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#18181B] mb-1.5">
                <span>Max Rent</span>
                <span>₹{maxRent.toLocaleString("en-IN")}/mo</span>
              </div>
              <input
                type="range"
                min="5000"
                max="25000"
                step="500"
                value={maxRent}
                onChange={(e) => setMaxRent(parseInt(e.target.value))}
                className="w-full accent-[#F97316] cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Rooms Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-[#E4E4E7] bg-white p-4 h-56"></div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-white p-12 text-center">
              <h3 className="font-semibold text-base text-[#18181B]">No rooms match your filters</h3>
              <p className="text-xs text-[#71717A] mt-1">Try raising the rent limit or selecting All Hubs.</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-3 rounded-lg bg-[#18181B] px-4 py-2 text-xs font-medium text-white hover:bg-[#27272A]"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => {
                const photos = JSON.parse(room.images || "[]");
                return (
                  <Link
                    key={room.id}
                    href={`/rooms/${room.slug}`}
                    className="flex flex-col sm:flex-row rounded-xl border border-[#E4E4E7] bg-white overflow-hidden hover:border-[#D4D4D8] transition-colors group"
                  >
                    {/* Room Photo */}
                    <div className="relative h-44 sm:h-auto sm:w-52 bg-[#F4F4F5] shrink-0">
                      <Image
                        src={photos[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"}
                        alt={room.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                        unoptimized
                      />
                    </div>

                    {/* Room Info */}
                    <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-base sm:text-lg font-semibold text-[#18181B]">
                            ₹{room.rent.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-[#71717A]">/ month</span>
                          <span className="text-[10px] text-emerald-600 font-medium ml-auto">Zero Brokerage</span>
                        </div>

                        <h3 className="font-medium text-sm text-[#18181B] line-clamp-1 group-hover:text-[#F97316] transition-colors">
                          {room.title}
                        </h3>

                        <p className="text-xs text-[#71717A] mt-1 truncate">
                          📍 {room.location?.name} · {room.distanceToCoaching}
                        </p>

                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          <span className="rounded bg-[#F4F4F5] text-[#71717A] px-2 py-0.5 text-[11px] font-medium">
                            {room.roomType}
                          </span>
                          <span className="rounded bg-[#F4F4F5] text-[#71717A] px-2 py-0.5 text-[11px] font-medium">
                            {room.furnishing}
                          </span>
                          {room.amenities.split(",").slice(0, 2).map((amenity: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded bg-[#F4F4F5] text-[#71717A] px-2 py-0.5 text-[11px] font-medium truncate"
                            >
                              {amenity.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-[#F4F4F5] flex items-center justify-between text-xs text-[#71717A]">
                        <span>Available {room.availableFrom}</span>
                        <span className="font-medium text-[#18181B] group-hover:text-[#F97316]">View room →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mobile Filter Modal */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs p-0 sm:hidden animate-in fade-in duration-150">
              <div className="w-full max-h-[85dvh] flex flex-col rounded-t-2xl bg-white shadow-xl overflow-hidden pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between">
                  <h3 className="font-semibold text-base text-[#18181B]">Filter Rooms</h3>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 text-[#71717A] hover:text-[#18181B]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Coaching Hub</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full rounded-lg border border-[#E4E4E7] p-2 text-xs text-[#18181B]"
                    >
                      <option value="all">All Hubs</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.slug}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1.5">Max Rent</label>
                    <div className="flex justify-between text-xs font-semibold text-[#18181B] mb-1">
                      <span>Budget limit</span>
                      <span>₹{maxRent.toLocaleString("en-IN")}/mo</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="25000"
                      step="500"
                      value={maxRent}
                      onChange={(e) => setMaxRent(parseInt(e.target.value))}
                      className="w-full accent-[#F97316] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-[#E4E4E7] flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 rounded-lg border border-[#E4E4E7] py-2.5 text-xs font-medium text-[#18181B]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="flex-1 rounded-lg bg-[#F97316] py-2.5 text-xs font-semibold text-white hover:bg-[#EA580C]"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FLATMATE FINDER SECTION */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flatmates.map((f) => (
              <div
                key={f.id}
                className="rounded-xl border border-[#E4E4E7] bg-white p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]">
                    <Image
                      src={f.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                      alt={f.user?.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-sm text-[#18181B] truncate">{f.user?.name}</h3>
                      {f.user?.isVerified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#71717A] truncate">
                      Optional: <strong>{f.user?.optionalSubject || "PSIR"}</strong> · Target 2026
                    </p>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <p className="font-medium text-xs text-[#18181B]">{f.title}</p>
                  <p className="text-[#71717A] line-clamp-2">{f.bio}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#F4F4F5] text-[11px]">
                    <div>
                      <span className="text-[#A1A1AA] block">Budget</span>
                      <span className="font-medium text-[#18181B]">Up to ₹{f.budget}/mo</span>
                    </div>
                    <div>
                      <span className="text-[#A1A1AA] block">Area</span>
                      <span className="font-medium text-[#18181B] truncate block">{f.preferredArea}</span>
                    </div>
                    <div>
                      <span className="text-[#A1A1AA] block">Study Schedule</span>
                      <span className="font-medium text-[#18181B] truncate block">{f.studySchedule}</span>
                    </div>
                    <div>
                      <span className="text-[#A1A1AA] block">Diet</span>
                      <span className="font-medium text-[#18181B] truncate block">{f.foodPreference}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/chat"
                  className="w-full flex items-center justify-center rounded-lg bg-[#18181B] py-2 text-xs font-semibold text-white hover:bg-[#27272A] transition-colors"
                >
                  <span>Connect with Aspirant</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
