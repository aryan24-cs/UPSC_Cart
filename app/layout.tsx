import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "UPSC Cart — Buy & Sell UPSC Books, Notes, Furniture + Rooms",
  description:
    "Buy & sell UPSC essentials and find rooms near coaching hubs. Direct chat. Zero commission.",
  keywords: [
    "UPSC Cart",
    "UPSC books buy sell",
    "Old Rajinder Nagar rooms",
    "Mukherjee Nagar PG",
    "Vision IAS notes",
    "Laxmikanth used",
    "UPSC aspirant marketplace",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#18181B] w-full max-w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:pb-12 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
