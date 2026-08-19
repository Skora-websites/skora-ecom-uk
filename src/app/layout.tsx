import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartSheet } from "@/components/cart-sheet";
import { Toaster } from "@/components/ui/sonner";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const SITE_URL = "https://haven-home.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Haven | Modern Scandinavian Furniture and Home",
    template: "%s | Haven",
  },
  description:
    "Bright, minimal Scandinavian furniture for every room. Sofas, dining, bedroom, lighting and storage with free UK delivery over £300 and a 10-year guarantee.",
  keywords: [
    "Scandinavian furniture",
    "sofas",
    "dining tables",
    "beds",
    "lighting",
    "home furnishings",
    "UK furniture store",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Haven | Modern Scandinavian Furniture and Home",
    description:
      "Bright, minimal Scandinavian furniture for every room. Free UK delivery over £300.",
    url: SITE_URL,
    siteName: "Haven",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#31433b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${fraunces.variable} antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartSheet />
          <Toaster position="top-center" richColors closeButton />
        </CartProvider>
      </body>
    </html>
  );
}