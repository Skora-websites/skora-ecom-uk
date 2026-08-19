"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { SectionHeading } from "@/components/section-heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/cart";
import { formatPrice, getCategory, type Product } from "@/lib/products";

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const { add, openCart } = useCart();
  const category = getCategory(product.category);
  const [finish, setFinish] = useState(product.finishOptions[0]);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    add(product, qty);
    toast.success(
      `${qty} × ${product.name} added to your bag`,
      {
        action: {
          label: "View bag",
          onClick: () => openCart(),
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link
              href="/shop"
              className="transition-colors hover:text-primary"
            >
              Shop
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="transition-colors hover:text-primary"
            >
              {category?.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted lg:sticky lg:top-24">
          <ProductImage
            src={product.image}
            alt={`${product.name} — ${category?.name} by Haven`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
          {product.tag && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              {product.tag}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {category.name}
            </p>
          )}
          <h1 className="text-balance font-display text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-semibold">
              <Star className="size-4 fill-accent text-accent" />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              · {product.reviews} reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="font-display text-3xl font-semibold">
              {formatPrice(product.price)}
            </p>
            {product.compareAt && (
              <p className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </p>
            )}
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Save 10% — offer ends soon
          </p>

          <p className="text-pretty leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="finish-select"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground"
            >
              Finish · {finish}
            </label>
            <Select value={finish} onValueChange={setFinish}>
              <SelectTrigger id="finish-select" className="w-full sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {product.finishOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-3 py-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="grid size-8 place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <span
                className="w-6 text-center font-semibold"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="grid size-8 place-items-center rounded-full transition-colors hover:bg-secondary"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              variant="accent"
              size="lg"
              className="flex-1 sm:flex-none"
              onClick={handleAdd}
            >
              <ShoppingBag className="size-5" />
              Add to bag · {formatPrice(product.price * qty)}
            </Button>
          </div>

          <ul className="flex flex-col gap-3 rounded-[1.5rem] bg-secondary/40 p-5 text-sm">
            <li className="flex items-center gap-3">
              <Truck className="size-5 shrink-0 text-primary" />
              Free UK delivery over £300 · delivered to your room
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-5 shrink-0 text-primary" />
              10-year guarantee on every frame and spring
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="size-5 shrink-0 text-primary" />
              60-day home trial — free collection if it's not right
            </li>
          </ul>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Product details</AccordionTrigger>
              <AccordionContent>
                <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Standard delivery takes 3–5 working days and costs £9.95, or
                it's free on orders over £300. Large pieces arrive with our
                friendly two-person team who'll carry them to the room of your
                choice.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Returns</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Live with your purchase for up to 60 days. If it isn't right,
                request a free collection and we'll refund you in full — no
                questions, no restocking fees.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="mt-20" aria-label="You may also like">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Complete the room"
            title="You may also like"
            actionHref={`/shop?category=${product.category}`}
                        actionLabel={`Shop all ${category?.name ?? "related"}`}
                        className="[&_a]:w-fit"
          />
        </div>
        <div className="mt-8">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.slug}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}