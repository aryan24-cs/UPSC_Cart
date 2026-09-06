"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = resolvedParams.id;

  const [room, setRoom] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.room) {
          setRoom(data.room);
          if (data.room.images && data.room.images.length > 0) {
            setSelectedImage(data.room.images[0]);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#18181B] border-t-transparent mx-auto mb-4"></div>
        <p className="text-xs text-[#71717A]">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h2 className="text-base font-semibold text-[#18181B]">Room Not Found</h2>
        <Link href="/rooms" className="mt-4 inline-block text-xs font-semibold text-[#F97316] underline">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#18181B] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Photos & Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo */}
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5]">
            <Image
              src={selectedImage || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80"}
              alt={room.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Thumbnails */}
          {room.images && room.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {room.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border transition-all ${
                    selectedImage === img ? "border-[#18181B] ring-1 ring-[#18181B]" : "border-[#E4E4E7] opacity-70"
                  }`}
                >
                  <Image src={img} alt={`Room ${idx}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-base font-semibold text-[#18181B] mb-2">About the Room</h2>
            <p className="text-sm text-[#404040] leading-relaxed whitespace-pre-line">
              {room.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="pt-4 border-t border-[#E4E4E7]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-3">
              Amenities & Study Setup
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {room.amenitiesList.map((amenity: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg bg-[#FAFAF9] border border-[#E4E4E7] px-3 py-2 text-xs font-medium text-[#18181B]"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          {room.houseRules && (
            <div className="pt-4 border-t border-[#E4E4E7]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-2">
                House Rules
              </h3>
              <p className="text-xs text-[#71717A] bg-[#FAFAF9] p-3 rounded-lg border border-[#E4E4E7]">
                {room.houseRules}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Contact (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded bg-[#F4F4F5] text-[#71717A] px-2 py-0.5 text-xs font-medium">
                {room.roomType} · {room.furnishing}
              </span>
              <span className="text-xs text-emerald-600 font-medium">Available {room.availableFrom}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">{room.title}</h1>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold text-[#18181B]">₹{room.rent.toLocaleString("en-IN")}</span>
              <span className="text-xs text-[#71717A]">/ month</span>
            </div>

            {/* Financial Breakdown */}
            <div className="rounded-lg border border-[#E4E4E7] p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#71717A]">Security Deposit</span>
                <span className="font-medium text-[#18181B]">₹{room.deposit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Maintenance</span>
                <span className="font-medium text-[#18181B]">
                  {room.maintenance ? `₹${room.maintenance}/mo` : "Included"}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#F4F4F5] pt-2">
                <span className="text-[#71717A]">Brokerage / Commission</span>
                <span className="font-semibold text-emerald-600">₹0 (Zero Brokerage)</span>
              </div>
            </div>

            {/* Proximity */}
            <p className="text-xs text-[#71717A] pt-1">
              📍 {room.nearbyInstitutes} · {room.distanceToCoaching}
            </p>

            {/* Contact Owner CTA (Desktop) */}
            <Link
              href="/chat"
              className="hidden sm:flex w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] py-3 text-sm font-semibold text-white hover:bg-[#EA580C] transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Contact Landlord / Student</span>
            </Link>
          </div>

          {/* Owner Details */}
          <div className="pt-4 border-t border-[#E4E4E7] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
              Listed By
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5] shrink-0">
                <Image
                  src={room.owner?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"}
                  alt={room.owner?.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#18181B] truncate">{room.owner?.name}</span>
                  {room.owner?.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#71717A]">📍 {room.owner?.coachingHub || "Old Rajinder Nagar"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4E4E7] bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:hidden flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#71717A] block">Rent (Zero Brokerage)</span>
          <span className="text-base font-semibold text-[#18181B]">₹{room.rent.toLocaleString("en-IN")}/mo</span>
        </div>

        <Link
          href="/chat"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] py-2.5 px-4 text-xs font-semibold text-white hover:bg-[#EA580C] touch-target"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Contact Landlord</span>
        </Link>
      </div>
    </div>
  );
}
