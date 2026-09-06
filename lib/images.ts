/**
 * Centralized image configuration and fallback utilities for UPSC Cart.
 */

// Clean neutral fallback SVG data URI with subtle book / box icon
export const DEFAULT_FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F4F4F5'/%3E%3Cg fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='120' y='120' width='160' height='160' rx='12' fill='%23FFFFFF' stroke='%23E4E4E7'/%3E%3Cpath d='M160 200l25-25 35 35 20-20 20 20' stroke='%23A1A1AA'/%3E%3Ccircle cx='170' cy='160' r='10' stroke='%23A1A1AA'/%3E%3Ctext x='200' y='250' font-family='sans-serif' font-size='11' font-weight='500' fill='%2371717A' text-anchor='middle'%3EUPSC Cart%3C/text%3E%3C/g%3E%3C/svg%3E";

export const USER_FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

export const ADMIN_FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80";

/**
 * Returns the primary cover image URL or a safe fallback.
 */
export function getListingImageUrl(
  images?: { url: string }[] | string[] | null,
  fallback: string = DEFAULT_FALLBACK_IMAGE
): string {
  if (!images || images.length === 0) {
    return fallback;
  }
  const first = images[0];
  if (typeof first === "string" && first.trim()) {
    return first.trim();
  }
  if (typeof first === "object" && first?.url && first.url.trim()) {
    return first.url.trim();
  }
  return fallback;
}

/**
 * Verified high-quality preset URLs for listings
 */
export const VERIFIED_PRESETS = {
  books: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
  notes: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
  studyTable: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
  studyChair: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
  tableFan: "https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=800&auto=format&fit=crop&q=80",
  roomCooler: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80",
  testSeries: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
};
