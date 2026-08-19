"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/lib/cart";
import { FREE_DELIVERY_THRESHOLD, formatPrice } from "@/lib/products";

export function CartSheet() {
  const { items, count, subtotal, isOpen, closeCart, setQty, remove, clear } =
    useCart();

  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const handleCheckout = () => {
    toast.success("Order placed — thank you for shopping with Haven!", {
      description: "This is a demo store, so no payment was taken.",
    });
    clear();
    closeCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl font-medium">
              <ShoppingBag className="size-5" />
              Your bag
              {count > 0 && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              aria-label="Close bag"
            >
              <X className="size-5" />
            </Button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-lg">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill it with something beautiful for your home.
              </p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href="/shop">Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {remaining > 0 ? (
                <div className="mb-5 rounded-2xl bg-secondary/70 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Truck className="size-4 text-primary" />
                    You're {formatPrice(remaining)} away from free delivery
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/15">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-5 flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
                  <Truck className="size-4" />
                  Free delivery unlocked — nice one.
                </div>
              )}

              <ul className="flex flex-col gap-5">
                {items.map((item) => (
                  <li key={item.slug} className="flex gap-4">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeCart}
                      className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-muted"
                    >
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">
                          {item.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => remove(item.slug)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                          className="grid size-7 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-secondary disabled:opacity-40"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="grid size-7 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-secondary"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t px-5 py-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium">Subtotal</span>
                <span className="font-display text-xl font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Delivery calculated at checkout.
              </p>
              <Button
                variant="accent"
                size="lg"
                className="mt-4 w-full"
                onClick={handleCheckout}
              >
                Checkout · {formatPrice(subtotal)}
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full"
                asChild
                onClick={closeCart}
              >
                <Link href="/shop">Continue browsing</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}