"use client";

import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDetail } from "@/components/product-detail";
import { useStore } from "@/lib/store";

interface StoreProductPageProps {
  slug: string;
}

/**
 * Resolves a product that exists only in the client store (e.g. one added
 * through the admin) and renders its detail page. Falls back to a friendly
 * "not available" state while the store hydrates or if it can't be found.
 */
export function StoreProductPage({ slug }: StoreProductPageProps) {
  const { products } = useStore();
  const product = products.find(
    (p) => p.slug === slug && p.status === "active"
  );

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="grid size-16 place-items-center rounded-3xl bg-secondary text-muted-foreground">
          <PackageX className="size-8" />
        </span>
        <h1 className="font-display text-2xl">Product not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This piece doesn&apos;t seem to be in the catalogue anymore. Take a
          look at what&apos;s new instead.
        </p>
        <Button asChild variant="accent">
          <Link href="/shop">Shop the collection</Link>
        </Button>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
