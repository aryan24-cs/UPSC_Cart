"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DoorOpen, Plus, MessageSquare, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.unreadMessages) setUnreadCount(data.unreadMessages);
      })
      .catch(() => {});
  }, [pathname]);

  // Don't show bottom nav on admin, auth pages, or when inside full chat thread
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/chat/") ||
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Rooms", href: "/rooms", icon: DoorOpen },
    { label: "Sell", href: "/sell", icon: Plus, isAction: true },
    { label: "Chat", href: "/chat", icon: MessageSquare, badge: unreadCount },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4E4E7] bg-white sm:hidden pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex h-14 items-center justify-around px-2 max-w-md mx-auto">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label="Post a new listing"
                className="flex flex-col items-center justify-center min-w-[48px] py-1 text-[#F97316] hover:text-[#EA580C] active:scale-95 transition-transform"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F97316] text-white shadow-2xs">
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-medium text-[#18181B] mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center min-w-[48px] py-1 transition-colors ${
                isActive ? "text-[#18181B]" : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.25] text-[#18181B]" : "stroke-[1.75]"}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F97316] text-[8px] font-bold text-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? "font-semibold text-[#18181B]" : "font-normal"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
