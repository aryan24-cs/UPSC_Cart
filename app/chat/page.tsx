"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Clock, MapPin, CheckCircle2, ChevronRight, ShieldCheck, ArrowRight } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";

export default function ChatListPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.conversations) setConversations(data.conversations);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / (1000 * 60 * 60 * 24));
    return `${days}d`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Mobile view (<768px) */}
      <div className="md:hidden">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-[#18181B] tracking-tight">Messages</h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Direct chat & negotiation with aspirants in your hub
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[#E4E4E7] bg-white p-3.5 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-[#F4F4F5] shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-3.5 w-1/3 rounded bg-[#F4F4F5]"></div>
                  <div className="h-3 w-1/2 rounded bg-[#F4F4F5]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-[#E4E4E7] bg-white p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F4F5] text-[#71717A] mb-3">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-[#18181B]">No conversations yet</h2>
            <p className="text-xs text-[#71717A] mt-1 max-w-xs mx-auto">
              When you contact a seller or a buyer makes an offer on your items, messages will appear here.
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-4 py-2 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
            >
              Browse Marketplace <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E4E7] rounded-xl border border-[#E4E4E7] bg-white overflow-hidden">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="flex items-center gap-3 p-3.5 hover:bg-[#FAFAF9] transition-colors group"
              >
                {/* Avatar */}
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]">
                  <Image
                    src={conv.otherUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                    alt={conv.otherUser?.name || "User"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-medium text-xs sm:text-sm text-[#18181B] truncate">{conv.otherUser?.name}</span>
                      {conv.otherUser?.isVerified && (
                        <CheckCircle2 className="h-3 w-3 text-[#2563EB] shrink-0" />
                      )}
                      <span className="rounded-full bg-[#F4F4F5] px-1.5 py-0.5 text-[9px] font-medium text-[#71717A] shrink-0">
                        {conv.isBuyer ? "Seller" : "Buyer"}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A1A1AA] shrink-0">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  {/* Listing context */}
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-xs font-medium text-[#71717A] truncate">
                      Re: {conv.listing?.title}
                    </span>
                    <span className="text-xs font-semibold text-[#18181B] shrink-0">
                      ₹{conv.listing?.price}
                    </span>
                  </div>

                  <p className="text-xs text-[#71717A] truncate mt-0.5">
                    {conv.lastMessage || "Click to open chat"}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-[#A1A1AA] group-hover:text-[#18181B] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop / Tablet Split View (>=768px) */}
      <div className="hidden md:flex rounded-xl border border-[#E4E4E7] bg-white overflow-hidden h-[calc(100dvh-9rem)] max-h-[800px]">
        {/* Left Column: Conversation List */}
        <div className="w-80 lg:w-96 shrink-0 h-full">
          <ChatSidebar conversations={conversations} isLoading={isLoading} />
        </div>

        {/* Right Column: Empty State / Select Prompt */}
        <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-[#FAFAF9] text-center border-l border-[#E4E4E7]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E4E4E7] text-[#71717A] mb-3">
            <MessageSquare className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-semibold text-[#18181B] tracking-tight">Your Messages</h2>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm">
            Select a conversation on the left to review offers, counter prices, or chat with verified peers in your coaching hub.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-md">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E4E7] text-xs text-[#71717A]">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Zero Commission</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4E4E7] text-xs text-[#71717A]">
              <MapPin className="h-3.5 w-3.5 text-[#71717A]" />
              <span>ORN · Mukherjee Nagar · Karol Bagh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
