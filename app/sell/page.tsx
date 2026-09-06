"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Tag,
  DollarSign,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SellPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [step, setStep] = useState(1);

  // Form State
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
  ]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState("GOOD");
  const [locationId, setLocationId] = useState("");
  const [brand, setBrand] = useState("");
  const [edition, setEdition] = useState("");
  const [reasonForSelling, setReasonForSelling] = useState("");
  const [tags, setTags] = useState("");

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) setCategoryId(data.categories[0].id);
        }
      });

    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        if (data.locations) {
          setLocations(data.locations);
          if (data.locations.length > 0) setLocationId(data.locations[0].id);
        }
      });
  }, []);

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.success && data.suggestion) {
        setTitle(data.suggestion.title);
        setDescription(data.suggestion.description);
        setPrice(data.suggestion.estimatedPrice.toString());
        setTags(data.suggestion.tags);

        const matched = categories.find((c) => c.slug === data.suggestion.categorySlug);
        if (matched) setCategoryId(matched.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !description || !price || !categoryId || !locationId) {
      alert("Please fill in all required fields!");
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price,
          originalPrice: originalPrice || null,
          isNegotiable,
          condition,
          categoryId,
          subcategory: subcategory || null,
          locationId,
          images,
          brand,
          edition,
          reasonForSelling,
          tags,
        }),
      });

      const data = await res.json();
      if (data.success && data.listing) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        router.push(`/listing/${data.listing.slug}`);
      } else {
        alert(data.error || "Failed to publish listing");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsPublishing(false);
    }
  };

  const selectedCatObj = categories.find((c) => c.id === categoryId);

  const stepsList = [
    { num: 1, label: "Category" },
    { num: 2, label: "Photos" },
    { num: 3, label: "Details" },
    { num: 4, label: "Review" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Wizard Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#18181B] tracking-tight">Post a Listing</h1>
        <p className="text-xs sm:text-sm text-[#71717A] mt-1">
          Reach UPSC aspirants in Old Rajinder Nagar, Mukherjee Nagar, and nearby hubs.
        </p>

        {/* Clean Linear Stepper */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {stepsList.map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (isDone) setStep(s.num);
                }}
                className={`flex flex-col border-t-2 pt-2.5 transition-colors ${
                  isDone
                    ? "border-[#F97316] cursor-pointer"
                    : isActive
                    ? "border-[#F97316]"
                    : "border-[#E4E4E7]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-semibold ${
                      isActive || isDone ? "text-[#F97316]" : "text-[#A1A1AA]"
                    }`}
                  >
                    0{s.num}
                  </span>
                  <span
                    className={`text-xs font-medium truncate ${
                      isActive ? "text-[#18181B]" : isDone ? "text-[#71717A]" : "text-[#A1A1AA]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-7 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-[#18181B]">Choose a Category</h2>
            <p className="text-xs text-[#71717A] mt-0.5">Select the category that best describes your item</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(cat.id);
                    setSubcategory("");
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-colors min-h-[96px] ${
                    isSelected
                      ? "border-[#F97316] bg-[#FFF7ED] text-[#EA580C]"
                      : "border-[#E4E4E7] hover:border-[#D4D4D8] hover:bg-[#FAFAF9] text-[#18181B]"
                  }`}
                >
                  <Tag className={`h-5 w-5 mb-2 ${isSelected ? "text-[#F97316]" : "text-[#71717A]"}`} />
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {selectedCatObj && selectedCatObj.subcategories?.length > 0 && (
            <div className="pt-4 border-t border-[#E4E4E7]">
              <label className="block text-xs font-medium text-[#18181B] mb-2.5">
                Subcategory / Subject (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedCatObj.subcategories.map((sub: any) => {
                  const isSubSelected = subcategory === sub.name;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubcategory(sub.name)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                        isSubSelected
                          ? "border-[#18181B] bg-[#18181B] text-white"
                          : "border-[#E4E4E7] bg-white text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B]"
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!categoryId}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#F97316] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] disabled:opacity-50 transition-colors"
            >
              <span>Next: Add Photos</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PHOTOS */}
      {step === 2 && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-7 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-[#18181B]">Add Photos</h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              Clear photos of the cover, spine, and index pages help buyers make quick decisions.
            </p>
          </div>

          {/* Photo Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5] group"
              >
                <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Image via URL or Preset */}
          <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-[#FAFAF9] p-4 space-y-3">
            <p className="text-xs font-medium text-[#18181B]">Add photo via URL</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste direct image URL (Unsplash or web link)..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="rounded-lg bg-[#18181B] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-colors"
              >
                Add Image
              </button>
            </div>

            {/* Quick preset demo images */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#71717A]">Sample presets:</span>
              {[
                { label: "Book Stack", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80" },
                { label: "Study Table", url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80" },
                { label: "Table Fan", url: "https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=800&auto=format&fit=crop&q=80" },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setImages((prev) => [...prev, s.url])}
                  className="rounded-md bg-white border border-[#E4E4E7] px-2 py-1 text-[10px] font-medium text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B]"
                >
                  + {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] transition-colors"
            >
              <span>Next: Item Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & SMART AI ASSISTANT */}
      {step === 3 && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-7 space-y-6">
          {/* Smart Listing Assistant Container */}
          <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAF9] p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-[#F97316]" />
              <h3 className="font-semibold text-xs text-[#18181B]">
                Auto-fill Assistant (Optional)
              </h3>
            </div>
            <p className="text-xs text-[#71717A] mb-3">
              Type keywords (e.g. &quot;laxmikanth 7th edition slightly marked&quot;) to auto-fill title, description, and suggested pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. vision ias prelims test series 2025"
                className="flex-1 rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAiAssist}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="rounded-lg bg-[#18181B] px-3.5 py-2 text-xs font-medium text-white hover:bg-black transition-colors disabled:opacity-50"
              >
                {isGeneratingAi ? "Filling..." : "Auto-Fill"}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Listing Title <span className="text-[#F97316]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Indian Polity by M. Laxmikanth (7th Edition)"
                className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Asking Price (₹) <span className="text-[#F97316]">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 420"
                  className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2.5 text-sm font-semibold text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Original Price (₹) <span className="text-[#71717A] text-[11px]">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 895"
                  className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2.5 text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Condition <span className="text-[#F97316]">*</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2.5 text-xs font-medium text-[#18181B] focus:border-[#F97316] focus:outline-none"
                >
                  <option value="LIKE_NEW">Like New (Barely used, clean)</option>
                  <option value="GOOD">Good (Light highlighting, sturdy)</option>
                  <option value="NEW">Brand New (Unopened/Unused)</option>
                  <option value="FAIR">Fair (Heavily used, readable)</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 pt-2 sm:pt-6">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="h-4 w-4 accent-[#F97316] rounded border-[#E4E4E7] cursor-pointer"
                />
                <label htmlFor="negotiable" className="text-xs font-medium text-[#18181B] cursor-pointer">
                  Price is negotiable with fellow aspirants
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Description <span className="text-[#F97316]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention condition, highlighting, included supplements, or preferred pickup spot..."
                className="w-full rounded-[10px] border border-[#E4E4E7] p-3 text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Publisher / Brand <span className="text-[#71717A] text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. McGraw Hill, Vision IAS"
                  className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                  Edition / Year <span className="text-[#71717A] text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  placeholder="e.g. 7th Edition (2024)"
                  className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                Reason for Selling <span className="text-[#71717A] text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={reasonForSelling}
                onChange={(e) => setReasonForSelling(e.target.value)}
                placeholder="e.g. Cleared Prelims / Shifting room"
                className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] placeholder-[#A1A1AA] focus:border-[#F97316] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#71717A] hover:text-[#18181B] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!title || !description || !price}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] disabled:opacity-50 transition-colors"
            >
              <span>Next: Location & Preview</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LOCATION & PUBLISH */}
      {step === 4 && (
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-5 sm:p-7 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-[#18181B]">Select Location & Review</h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              Buyers search within their coaching hub (e.g. Old Rajinder Nagar, Mukherjee Nagar).
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#18181B] mb-1.5">
              Hub / Area <span className="text-[#F97316]">*</span>
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full rounded-[10px] border border-[#E4E4E7] px-3 py-2.5 text-xs sm:text-sm font-medium text-[#18181B] focus:border-[#F97316] focus:outline-none"
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.area})
                </option>
              ))}
            </select>
          </div>

          {/* Listing Card Preview */}
          <div className="pt-4 border-t border-[#E4E4E7]">
            <h3 className="text-xs font-medium text-[#71717A] mb-3">
              Listing preview
            </h3>
            <div className="max-w-xs mx-auto rounded-xl border border-[#E4E4E7] bg-white overflow-hidden">
              <div className="relative aspect-4/3 w-full bg-[#F4F4F5]">
                <Image
                  src={images[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white">
                  {condition.replace("_", " ")}
                </span>
              </div>
              <div className="p-3">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-base font-semibold text-[#18181B]">₹{price}</span>
                  {isNegotiable && (
                    <span className="text-[11px] text-[#71717A]">· Negotiable</span>
                  )}
                </div>
                <h4 className="font-medium text-xs text-[#18181B] truncate">{title || "Untitled Listing"}</h4>
                <p className="text-[11px] text-[#71717A] mt-1 truncate">
                  📍 {locations.find((l) => l.id === locationId)?.name || "Coaching Hub"} · Just now
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-xs font-medium text-[#71717A] hover:text-[#18181B] py-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#F97316] px-6 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#EA580C] disabled:opacity-50 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isPublishing ? "Publishing..." : "Publish Listing"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
