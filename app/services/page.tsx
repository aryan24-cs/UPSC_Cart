"use client";

import { useState, useEffect } from "react";
import {
  Utensils,
  Printer,
  BookOpen,
  Truck,
  Star,
  Phone,
  MapPin,
  Tag,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async (cat = activeCategory) => {
    setIsLoading(true);
    try {
      const url = cat === "ALL" ? "/api/services" : `/api/services?category=${cat}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory]);

  const categories = [
    { label: "All Services", value: "ALL", icon: Tag },
    { label: "Tiffin / Mess", value: "TIFFIN", icon: Utensils },
    { label: "Photocopy & Binding", value: "PRINTING", icon: Printer },
    { label: "Reading Libraries", value: "LIBRARY", icon: BookOpen },
    { label: "Movers & Shifting", value: "MOVERS", icon: Truck },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0">
      {/* Header */}
      <div className="pb-4 border-b border-[#E4E4E7] mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
          Student Services Directory
        </h1>
        <p className="text-xs text-[#71717A] mt-0.5">
          Verified tiffin mess, material printing, reading libraries, and luggage shifting in ORN & Mukherjee Nagar
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.value;
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#18181B] text-white font-semibold"
                  : "bg-white border border-[#E4E4E7] text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#E4E4E7] bg-white p-5 h-48"></div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-white p-12 text-center">
          <p className="text-sm font-medium text-[#18181B]">No service providers in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex flex-col justify-between rounded-xl border border-[#E4E4E7] bg-white p-5 hover:border-[#D4D4D8] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded bg-[#F4F4F5] text-[#71717A] px-2 py-0.5 text-[11px] font-medium">
                    {svc.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#18181B]">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{svc.rating}</span>
                    <span className="text-[#A1A1AA] font-normal">({svc.reviewCount})</span>
                  </div>
                </div>

                <h3 className="font-semibold text-base text-[#18181B]">{svc.title}</h3>
                <p className="text-xs text-[#71717A] mt-1 line-clamp-2 leading-relaxed">{svc.description}</p>

                <p className="text-xs text-[#71717A] mt-2 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>{svc.locationName}</span>
                </p>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {svc.badges.split(",").map((b: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded bg-[#FAFAF9] border border-[#E4E4E7] px-2 py-0.5 text-[10px] text-[#71717A]"
                    >
                      ✓ {b.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#F4F4F5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block">Pricing</span>
                  <span className="text-xs font-semibold text-[#18181B]">{svc.pricingStr}</span>
                </div>

                <a
                  href={`tel:${svc.phone}`}
                  className="flex items-center gap-1.5 rounded-lg bg-[#18181B] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#27272A] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> Call Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
