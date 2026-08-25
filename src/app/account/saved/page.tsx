"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";
import { savedItems } from "@/lib/account";
import type { Product } from "@/lib/products";

export default function SavedItemsPage() {
  const [items, setItems] = useState<Product[]>(savedItems());

  const handleRemove = (product: Product) => {
    setItems((prev) => prev.filter((p) => p.slug !== product.slug));
    toast.success(`${product.name} removed from saved items`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Saved items</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pieces you&apos;ve bookmarked —{" "}
          {items.length} {items.length === 1 ? "item" : "items"}.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Heart className="size-7" />
          </span>
          <p className="font-medium">No saved items yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tap the heart on any product to keep it here for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <div key={product.slug} className="relative">
              <ProductCard product={product} />
              <button
                type="button"
                onClick={() => handleRemove(product)}
                aria-label={`Remove ${product.name} from saved items`}
                className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-background/85 text-destructive shadow-sm backdrop-blur transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <Heart className="size-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
