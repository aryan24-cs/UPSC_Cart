"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  DollarSign,
  MapPin,
  ExternalLink,
  Check,
  X,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import ChatSidebar from "@/components/ChatSidebar";

export default function ChatThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const conversationId = resolvedParams.id;

  const [conversation, setConversation] = useState<any>(null);
  const [conversationsList, setConversationsList] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [counterModalOffer, setCounterModalOffer] = useState<any>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchThread = async () => {
    try {
      const res = await fetch(`/api/chat/${conversationId}`);
      const data = await res.json();
      if (data.conversation) {
        setConversation(data.conversation);
        setMessages(data.conversation.messages || []);
        setOffers(data.conversation.offers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch conversation list for desktop split-pane
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        if (data.conversations) setConversationsList(data.conversations);
      })
      .catch(() => {});

    fetchThread();
    const interval = setInterval(fetchThread, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setInputText("");

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: text.trim(),
          type: "TEXT",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);

        if (conversation && conversation.isBuyer) {
          setTimeout(async () => {
            const replies = [
              "Sounds good! We can meet near Bada Bazar Mother Dairy in ORN.",
              "Yes, everything is in prime condition. You can check the binding and notes carefully.",
              "I'm usually available after 5 PM outside Vajiram & Ravi.",
            ];
            const autoReply = replies[Math.floor(Math.random() * replies.length)];
            fetchThread();
          }, 2500);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateOffer = async (offerId: string, status: string, customCounter?: string) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          counterAmount: customCounter,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (status === "ACCEPTED") {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
        setCounterModalOffer(null);
        fetchThread();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const quickChips = [
    "Is this available?",
    "Can you negotiate?",
    "Where can we meet in ORN?",
    "Can I inspect the condition first?",
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent mx-auto mb-3"></div>
        <p className="text-xs text-[#71717A]">Loading conversation...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm font-semibold text-[#18181B]">Conversation not found</p>
        <Link href="/chat" className="mt-3 inline-block text-xs font-medium text-[#F97316] hover:underline">
          Back to Messages
        </Link>
      </div>
    );
  }

  const otherUser = conversation.otherUser;
  const listing = conversation.listing;
  const activeOffer = offers[0];

  const threadContent = (
    <div className="flex flex-col h-full bg-[#FAFAF9] min-w-0">
      {/* Top Header with User Info */}
      <div className="flex items-center justify-between border-b border-[#E4E4E7] bg-white px-3 sm:px-4 py-2.5 sm:py-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/chat"
            aria-label="Back to messages list"
            className="md:hidden p-1 -ml-1 text-[#71717A] hover:text-[#18181B] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]">
            <Image
              src={otherUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
              alt={otherUser?.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-[#18181B] truncate">{otherUser?.name}</span>
              {otherUser?.isVerified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-[#71717A] truncate block">
              {conversation.isBuyer ? "Verified Seller" : "Aspirant"} · {otherUser?.coachingHub || "Old Rajinder Nagar"}
            </span>
          </div>
        </div>

        {listing && (
          <Link
            href={`/listing/${listing?.slug}`}
            className="text-xs font-medium text-[#71717A] hover:text-[#18181B] flex items-center gap-1 shrink-0 ml-2 transition-colors"
          >
            <span className="hidden xs:inline">View Listing</span> <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Listing Context Banner */}
      {listing && (
        <div className="flex items-center justify-between border-b border-[#E4E4E7] bg-white px-3 sm:px-4 py-2 shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] shrink-0">
              <Image
                src={listing?.images?.[0]?.url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80"}
                alt={listing?.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs text-[#18181B] truncate">{listing?.title}</p>
              <p className="text-xs font-semibold text-[#18181B]">₹{listing?.price}</p>
            </div>
          </div>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider shrink-0 ${
              listing?.status === "RESERVED"
                ? "bg-amber-100 text-amber-800"
                : listing?.status === "SOLD"
                ? "bg-red-100 text-red-800"
                : "bg-[#F4F4F5] text-[#18181B]"
            }`}
          >
            {listing?.status}
          </span>
        </div>
      )}

      {/* Offer Action Banner */}
      {activeOffer && (
        <div className="bg-white border-b border-[#E4E4E7] px-3 sm:px-4 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF7ED] text-[#EA580C]">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#18181B] truncate">
                Offer: <span className="font-semibold text-[#18181B]">₹{activeOffer.amount}</span>
                <span className="ml-1.5 rounded-full bg-[#F4F4F5] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A]">
                  {activeOffer.status}
                </span>
              </p>
              {activeOffer.status === "COUNTERED" && (
                <p className="text-[11px] text-[#71717A]">
                  Countered at ₹{activeOffer.counterAmount}
                </p>
              )}
            </div>
          </div>

          {/* Seller Action Controls if Offer is PENDING */}
          {!conversation.isBuyer && activeOffer.status === "PENDING" && (
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => handleUpdateOffer(activeOffer.id, "ACCEPTED")}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <Check className="h-3 w-3" /> Accept
              </button>

              <button
                type="button"
                onClick={() => {
                  setCounterModalOffer(activeOffer);
                  setCounterAmount(activeOffer.amount.toString());
                }}
                className="rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1 text-xs font-medium text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
              >
                Counter
              </button>

              <button
                type="button"
                onClick={() => handleUpdateOffer(activeOffer.id, "REJECTED")}
                className="rounded-lg border border-[#E4E4E7] p-1 text-[#71717A] hover:text-red-600 transition-colors"
                title="Decline Offer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Buyer Action Controls if Countered */}
          {conversation.isBuyer && activeOffer.status === "COUNTERED" && (
            <button
              type="button"
              onClick={() => handleUpdateOffer(activeOffer.id, "ACCEPTED")}
              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shrink-0 ml-auto"
            >
              Accept Counter (₹{activeOffer.counterAmount})
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
        <div className="text-center my-1">
          <span className="rounded-full bg-white border border-[#E4E4E7] px-2.5 py-0.5 text-[10px] font-medium text-[#71717A]">
            Direct P2P Chat · Hub Meetup
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId !== otherUser.id;
          const isOfferUpdate = msg.type === "OFFER_UPDATE";

          if (isOfferUpdate) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 max-w-sm text-center">
                  <p className="text-xs font-medium text-[#18181B]">{msg.content}</p>
                  <span className="text-[10px] text-[#A1A1AA] mt-0.5 block">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-3.5 py-2 text-xs sm:text-sm leading-relaxed ${
                  isMe
                    ? "bg-[#18181B] text-white rounded-br-xs"
                    : "bg-white border border-[#E4E4E7] text-[#18181B] rounded-bl-xs"
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <span
                  className={`block text-[10px] mt-0.5 text-right ${
                    isMe ? "text-[#A1A1AA]" : "text-[#A1A1AA]"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-3 sm:px-4 py-2 bg-white border-t border-[#E4E4E7] scrollbar-none shrink-0">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(chip)}
            className="shrink-0 rounded-full border border-[#E4E4E7] bg-[#FAFAF9] px-2.5 py-1 text-xs text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B] transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box Footer */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-[#E4E4E7] shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAF9] py-2 px-3 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            aria-label="Send message"
            className="inline-flex h-9 w-9 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-[#F97316] text-white hover:bg-[#EA580C] disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-xl bg-white p-5 border border-[#E4E4E7] shadow-xl pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
            <h3 className="font-semibold text-sm sm:text-base text-[#18181B] mb-1">Send Counter Offer</h3>
            <p className="text-xs text-[#71717A] mb-3">
              Buyer proposed ₹{counterModalOffer.amount}. Enter your counter price:
            </p>
            <div className="relative mb-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#71717A]">₹</span>
              <input
                type="number"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-[10px] border border-[#E4E4E7] text-base font-semibold text-[#18181B] focus:border-[#F97316] focus:outline-none"
                placeholder="e.g. 280"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCounterModalOffer(null)}
                className="flex-1 rounded-lg border border-[#E4E4E7] py-2 text-xs font-medium text-[#71717A] hover:bg-[#FAFAF9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateOffer(counterModalOffer.id, "COUNTERED", counterAmount)}
                className="flex-1 rounded-lg bg-[#F97316] py-2 text-xs font-medium text-white hover:bg-[#EA580C] transition-colors"
              >
                Send Counter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl sm:px-6 sm:py-4 md:py-6">
      {/* Mobile (<768px): Full Screen Chat Thread */}
      <div className="md:hidden h-[calc(100dvh-3.5rem)] -mb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
        {threadContent}
      </div>

      {/* Desktop / Tablet Split View (>=768px) */}
      <div className="hidden md:flex rounded-xl border border-[#E4E4E7] bg-white overflow-hidden h-[calc(100dvh-9rem)] max-h-[800px]">
        {/* Left Column: Conversations Sidebar with Active Selection */}
        <div className="w-80 lg:w-96 shrink-0 h-full">
          <ChatSidebar
            conversations={conversationsList}
            activeId={conversationId}
            isLoading={false}
          />
        </div>

        {/* Right Column: Active Thread */}
        <div className="flex-1 h-full min-w-0 border-l border-[#E4E4E7]">
          {threadContent}
        </div>
      </div>
    </div>
  );
}
