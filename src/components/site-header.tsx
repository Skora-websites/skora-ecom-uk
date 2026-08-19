"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Armchair, Menu, Search, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop all", href: "/shop" },
  ...categories.map((c) => ({
    label: c.name,
    href: `/shop?category=${c.slug}`,
  })),
  { label: "New in", href: "/shop?sort=new" },
];

export function SiteHeader() {
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium sm:text-sm">
          <Truck className="size-4 shrink-0" />
          <span>Free UK delivery on orders over £300 · 10-year guarantee</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-display font-semibold tracking-tight"
            aria-label="Haven home"
          >
            <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
              <Armchair className="size-5" />
            </span>
            <span>Haven</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
                      {navLinks.map((link) => {
                        const active =
                          link.href === "/shop"
                            ? pathname === "/shop"
                            : pathname.startsWith(link.href);
                        return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground",
                    active && "bg-secondary text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/shop"
              aria-label="Search the shop"
              className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
            >
              <Search className="size-5" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative grid size-11 place-items-center rounded-full text-foreground transition-all hover:bg-secondary"
              aria-label={`Open bag${count > 0 ? `, ${count} items` : ""}`}
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 py-0.5 text-xs font-bold text-accent-foreground shadow-sm animate-fade-in">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle className="flex items-center gap-2 font-display text-xl">
              <span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground">
                <Armchair className="size-4" />
              </span>
              Haven
            </SheetTitle>
          </SheetHeader>
          <nav
            className="flex flex-col gap-1 overflow-y-auto p-4"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-full px-4 py-3 text-base font-medium transition-colors hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}