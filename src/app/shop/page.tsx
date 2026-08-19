import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop-view";

export const metadata: Metadata = {
  title: "Shop Furniture | Sofas, Dining, Bedroom and Lighting",
  description:
    "Browse the full Haven range: sofas, armchairs, dining tables, beds and lighting. Clean Scandinavian design, honest prices and free UK delivery over £300.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <ShopView
        initialCategory={
          params.category &&
          ["sofas", "armchairs", "dining", "bedroom", "lighting", "storage"].includes(
            params.category
          )
            ? params.category
            : "all"
        }
        initialSort={
          ["featured", "price-asc", "price-desc", "new"].includes(
            params.sort ?? ""
          )
            ? params.sort!
            : "featured"
        }
      />
    </Suspense>
  );
}