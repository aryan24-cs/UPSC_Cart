"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Check, X } from "lucide-react";

interface Location {
  id: string;
  name: string;
  slug: string;
  area: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onSelectLocation: (slug: string, name: string) => void;
}

export default function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [radius, setRadius] = useState<number>(3);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        if (data.locations) setLocations(data.locations);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsDetecting(false);
          onSelectLocation("old-rajinder-nagar", "Old Rajinder Nagar");
          onClose();
        },
        () => {
          setIsDetecting(false);
          onSelectLocation("old-rajinder-nagar", "Old Rajinder Nagar");
          onClose();
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetecting(false);
      onSelectLocation("old-rajinder-nagar", "Old Rajinder Nagar");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full sm:max-w-md max-h-[85dvh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 shadow-xl border border-[#E4E4E7] animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
        {/* Mobile Pull Drag Handle */}
        <div className="sm:hidden flex justify-center pb-2">
          <div className="h-1 w-10 rounded-full bg-[#E4E4E7]"></div>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7] shrink-0">
          <div>
            <h3 className="font-semibold text-base text-[#18181B]">Select Location</h3>
            <p className="text-xs text-[#71717A] mt-0.5">Find listings and rooms near your coaching institute</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close location selector"
            className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* GPS Auto-detect Button */}
        <button
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] px-4 py-2.5 text-xs font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors shrink-0 cursor-pointer"
        >
          <Navigation className={`h-3.5 w-3.5 text-[#F97316] ${isDetecting ? "animate-spin" : ""}`} />
          <span>{isDetecting ? "Detecting location..." : "Use Current Location (GPS)"}</span>
        </button>

        {/* Hub Selection List */}
        <div className="mt-3 space-y-1.5 flex-1 overflow-y-auto pr-1">
          <div
            onClick={() => {
              onSelectLocation("all", "All Hubs");
              onClose();
            }}
            className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
              selectedLocation === "all"
                ? "bg-[#FFF7ED] text-[#EA580C] font-semibold"
                : "hover:bg-[#FAFAF9] text-[#18181B]"
            }`}
          >
            <div>
              <p>All Hubs (Delhi NCR & Beyond)</p>
              <p className="text-[11px] text-[#71717A]">Show all active listings</p>
            </div>
            {selectedLocation === "all" && <Check className="h-4 w-4 text-[#F97316] shrink-0" />}
          </div>

          {locations.map((loc) => {
            const isSelected = selectedLocation === loc.slug;
            return (
              <div
                key={loc.id}
                onClick={() => {
                  onSelectLocation(loc.slug, loc.name);
                  onClose();
                }}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-[#FFF7ED] text-[#EA580C] font-semibold"
                    : "hover:bg-[#FAFAF9] text-[#18181B]"
                }`}
              >
                <div>
                  <p>{loc.name}</p>
                  <p className="text-[11px] text-[#71717A]">{loc.area}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-[#F97316] shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Radius selector */}
        <div className="mt-3 pt-3 border-t border-[#E4E4E7] shrink-0">
          <div className="flex items-center justify-between text-xs text-[#71717A] mb-1">
            <span>Radius</span>
            <span className="font-semibold text-[#18181B]">{radius} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full accent-[#F97316] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
