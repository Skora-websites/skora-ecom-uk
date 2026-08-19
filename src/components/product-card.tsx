"use client";

import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/products";
import { formatPrice, getCategory } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { add } = useCart();
  const category = getCategory(product.category);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product);
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
        <ProductImage
          src={product.image}
          alt={`${product.name} — ${category?.name ?? "Haven furniture"}`}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {product.tag && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground",
              product.tag === "bestseller" ? "bg-primary" : "bg-accent text-accent-foreground"
            )}
          >
            {product.tag}
          </span>
        )}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to bag`}
          className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
        >
          <Plus className="size-5" />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {category?.name}
        </p>
        <h3 className="font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="size-3.5 fill-accent text-accent" />
          <span className="font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}