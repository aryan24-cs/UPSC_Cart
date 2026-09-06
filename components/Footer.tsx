"use client";

import Link from "next/link";
import { MessageSquare, ExternalLink, ShieldCheck, Mail, Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E4E4E7] bg-white text-[#18181B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & App Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#18181B]">
                UPSC<span className="text-[#F97316]">Cart</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed max-w-sm">
              The student marketplace for UPSC aspirants — buy & sell essentials, connect via direct chat, and find rooms near coaching hubs in Old Rajinder Nagar, Mukherjee Nagar, and Karol Bagh.
            </p>
            
            {/* Play Store Link Button */}
            <div className="pt-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.upsccart.upsc.cart"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAF9] px-4 py-2.5 text-xs font-semibold text-[#18181B] hover:bg-[#F4F4F5] hover:border-[#D4D4D8] transition-colors"
              >
                <Smartphone className="h-4 w-4 text-[#F97316]" />
                <span>Get on Google Play</span>
                <ExternalLink className="h-3 w-3 text-[#A1A1AA]" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">Explore</h4>
            <ul className="space-y-2 text-xs text-[#71717A]">
              <li>
                <Link href="/#features" className="hover:text-[#18181B] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how" className="hover:text-[#18181B] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-[#18181B] transition-colors font-medium text-[#F97316]">
                  🔥 Best Deals
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-[#18181B] transition-colors">
                  Study Rooms & PGs
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#18181B] transition-colors">
                  Student Services
                </Link>
              </li>
              <li>
                <Link href="/#download" className="hover:text-[#18181B] transition-colors">
                  Download App
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">Legal</h4>
            <ul className="space-y-2 text-xs text-[#71717A]">
              <li>
                <a
                  href="https://chatsapp-4a54d.web.app/privacy_policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://chatsapp-4a54d.web.app/terms_and_conditions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1"
                >
                  <span>Terms of Service</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://chatsapp-4a54d.web.app/delete_account.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1"
                >
                  <span>Delete Account Data</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">Community & Support</h4>
            <ul className="space-y-2 text-xs text-[#71717A]">
              <li>
                <a
                  href="https://whatsapp.com/channel/0029VbCxxrN9cDDRBXEO3E2w"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1.5"
                >
                  <span>WhatsApp Channel</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+0_sR0hPmNMA5OWM1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1.5"
                >
                  <span>Telegram Channel</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/upsccart?utm_source=qr&igsh=MTV5ZmF2dTQ1eTd1ZQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#18181B] transition-colors flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:support@upsccart.shop"
                  className="hover:text-[#18181B] transition-colors inline-flex items-center gap-1.5 font-medium text-[#18181B]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#F97316]" />
                  <span>support@upsccart.shop</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-10 pt-6 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} UPSC Cart. All rights reserved. Zero Commission Student Marketplace.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Hyper-Local Student Protection</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
