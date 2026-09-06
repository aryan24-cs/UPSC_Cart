"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  MessageSquare,
  Heart,
  Plus,
  Shield,
  User,
  ChevronDown,
  X,
  LogOut,
  Settings,
  ListOrdered,
} from "lucide-react";
import LocationModal from "./LocationModal";

interface UserType {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  coachingHub: string | null;
  isVerified?: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedLocationName, setSelectedLocationName] = useState("All Hubs");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setUnreadNotifications(data.unreadNotifications || 0);
        setUnreadMessages(data.unreadMessages || 0);
        setFavoritesCount(data.favoritesCount || 0);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error(err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setIsProfileMenuOpen(false);
      window.location.href = "/welcome";
    } catch (err) {
      console.error(err);
      window.location.href = "/welcome";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    } else {
      router.push("/marketplace");
    }
  };

  const handleSelectLocation = (slug: string, name: string) => {
    setSelectedLocation(slug);
    setSelectedLocationName(name);
    if (pathname === "/marketplace") {
      router.push(`/marketplace?location=${slug}`);
    }
  };

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E4E4E7] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 sm:gap-6">
          {/* Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-xl font-bold tracking-tight text-[#18181B]">
                UPSC<span className="text-[#F97316]">Cart</span>
              </span>
            </Link>

            {/* Simple Location Trigger */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 py-1 px-2 text-xs font-medium text-[#71717A] hover:text-[#18181B] rounded-md transition-colors shrink-0 max-w-[120px] xs:max-w-[150px] sm:max-w-[180px]"
            >
              <MapPin className="h-3.5 w-3.5 text-[#F97316] shrink-0" />
              <span className="truncate">{selectedLocationName}</span>
              <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
            </button>
          </div>

          {/* Desktop Search Bar (shown when user is logged in or browsing) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
              <input
                type="text"
                placeholder="Search books, notes, furniture, rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-[#FAFAF9] py-2 pl-9 pr-4 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:bg-white focus:outline-hidden transition-colors"
              />
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-[#71717A]">
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className={`hover:text-[#18181B] transition-colors ${
                    pathname === "/admin" ? "text-[#18181B] font-semibold" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/marketplace"
                  className={`hover:text-[#18181B] transition-colors ${
                    pathname.startsWith("/marketplace") ? "text-[#18181B] font-semibold" : ""
                  }`}
                >
                  Marketplace
                </Link>
                <Link
                  href="/admin"
                  className="hover:text-[#18181B] transition-colors"
                >
                  Moderation
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/#features"
                  className="hover:text-[#18181B] transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/#how"
                  className="hover:text-[#18181B] transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="/#download"
                  className="hover:text-[#18181B] transition-colors"
                >
                  Download
                </Link>
                <a
                  href="https://t.me/+0_sR0hPmNMA5OWM1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1"
                >
                  <span>Community</span>
                </a>
                <Link
                  href="/marketplace"
                  className={`hover:text-[#18181B] transition-colors font-semibold text-[#F97316] ${
                    pathname.startsWith("/marketplace") ? "underline underline-offset-4" : ""
                  }`}
                >
                  🔥 Best Deals
                </Link>
                <Link
                  href="/rooms"
                  className={`hover:text-[#18181B] transition-colors ${
                    pathname.startsWith("/rooms") ? "text-[#18181B] font-semibold" : ""
                  }`}
                >
                  Rooms
                </Link>
                <Link
                  href="/services"
                  className={`hover:text-[#18181B] transition-colors ${
                    pathname.startsWith("/services") ? "text-[#18181B] font-semibold" : ""
                  }`}
                >
                  Services
                </Link>
              </>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle mobile search"
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
            >
              <Search className="h-4 w-4" />
            </button>

            {currentUser ? (
              <>
                {/* Saved Items Link */}
                <Link
                  href="/saved"
                  aria-label="Saved items"
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  {favoritesCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F97316] text-[9px] font-semibold text-white">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                {/* Chat Link */}
                <Link
                  href="/chat"
                  aria-label="Messages"
                  className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F97316] text-[9px] font-semibold text-white">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                {/* Post Item CTA Button */}
                <Link
                  href="/sell"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#EA580C] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Sell</span>
                </Link>

                {/* User Avatar Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    aria-label="Profile menu"
                    className="flex items-center gap-1 rounded-full p-0.5 hover:ring-2 hover:ring-[#E4E4E7] transition-all"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#E4E4E7] bg-gray-100">
                      {currentUser.avatar ? (
                        <Image
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E4E4E7] bg-white py-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="px-3.5 py-2.5 border-b border-[#E4E4E7]">
                        <p className="font-semibold text-xs text-[#18181B] truncate">{currentUser.name}</p>
                        <p className="text-[11px] font-medium text-[#F97316]">
                          {isAdmin ? "Administrator" : "Verified Aspirant"}
                        </p>
                        <p className="text-[11px] text-[#71717A] truncate mt-0.5">{currentUser.email}</p>
                      </div>

                      {isAdmin ? (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#18181B] hover:bg-[#FAFAF9]"
                          >
                            <Shield className="h-3.5 w-3.5 text-red-600" />
                            <span>Admin Dashboard</span>
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#18181B] hover:bg-[#FAFAF9]"
                          >
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            <span>Profile</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/profile"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#18181B] hover:bg-[#FAFAF9]"
                          >
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            href="/saved"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#18181B] hover:bg-[#FAFAF9]"
                          >
                            <Heart className="h-3.5 w-3.5 text-gray-500" />
                            <span>Saved Items</span>
                          </Link>
                          <Link
                            href="/chat"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#18181B] hover:bg-[#FAFAF9]"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                            <span>Messages</span>
                          </Link>
                          <Link
                            href="/sell"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#F97316] font-medium hover:bg-orange-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Post Listing</span>
                          </Link>
                        </>
                      )}

                      <div className="my-1 border-t border-[#E4E4E7]"></div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Unauthenticated Visitors */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/welcome"
                  className="rounded-lg bg-[#F97316] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#E4E4E7] bg-white">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[#A1A1AA]" />
              <input
                type="text"
                autoFocus
                placeholder="Search books, notes, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[10px] border border-[#E4E4E7] bg-[#FAFAF9] py-2 pl-9 pr-8 text-xs text-[#18181B] focus:border-[#F97316] focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
}
