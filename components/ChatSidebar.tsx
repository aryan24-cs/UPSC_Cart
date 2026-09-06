"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, CheckCircle2, Search } from "lucide-react";

interface ChatSidebarProps {
  conversations: any[];
  activeId?: string;
  isLoading?: boolean;
}

export default function ChatSidebar({
  conversations,
  activeId,
  isLoading = false,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const userName = c.otherUser?.name?.toLowerCase() || "";
    const itemTitle = c.listing?.title?.toLowerCase() || "";
    const lastMsg = c.lastMessage?.toLowerCase() || "";
    return userName.includes(q) || itemTitle.includes(q) || lastMsg.includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#E4E4E7] min-w-0">
      {/* Header */}
      <div className="p-4 border-b border-[#E4E4E7] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#18181B]">Messages</h2>
          <span className="text-[11px] font-medium text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-full">
            {conversations.length} {conversations.length === 1 ? "chat" : "chats"}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-[10px] border border-[#E4E4E7] bg-[#FAFAF9] text-[#18181B] placeholder-[#A1A1AA] focus:bg-white focus:border-[#F97316] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* List Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E4E4E7]">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-[#F4F4F5] shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-3 w-1/3 rounded bg-[#F4F4F5]"></div>
                  <div className="h-2.5 w-1/2 rounded bg-[#F4F4F5]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F5] text-[#71717A] mb-2">
              <MessageSquare className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-[#18181B]">
              {searchQuery ? "No matching conversations" : "No chats yet"}
            </p>
            <p className="text-[11px] text-[#71717A] mt-0.5">
              {searchQuery ? "Try searching for a different name or item" : "Messages will appear here once you chat with sellers"}
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className={`flex items-start gap-3 p-3.5 transition-colors group relative ${
                  isActive
                    ? "bg-[#FAFAF9] border-l-2 border-l-[#F97316]"
                    : "hover:bg-[#FAFAF9]"
                }`}
              >
                {/* Avatar */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5] mt-0.5">
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
                      <span className="font-medium text-xs text-[#18181B] truncate">
                        {conv.otherUser?.name}
                      </span>
                      {conv.otherUser?.isVerified && (
                        <CheckCircle2 className="h-3 w-3 text-[#2563EB] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-[#A1A1AA] shrink-0">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  {/* Context pill */}
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[11px] font-medium text-[#71717A] truncate">
                      {conv.listing?.title}
                    </span>
                    <span className="text-[11px] font-semibold text-[#18181B] shrink-0">
                      ₹{conv.listing?.price}
                    </span>
                  </div>

                  {/* Message snippet */}
                  <p className="text-[11px] text-[#71717A] line-clamp-1">
                    {conv.lastMessage || "Started a conversation"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
