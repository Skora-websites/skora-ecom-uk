"use client";

import { useMemo } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, products, type CategorySlug } from "@/lib/products";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "new";
type CategoryFilter = CategorySlug | "all";

const sortLabels: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  new: "New arrivals",
};

export function ShopView({
  initialCategory,
  initialSort,
}: {
  initialCategory: string;
  initialSort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = (searchParams.get("category") ?? initialCategory) as CategoryFilter;
  const sort = (searchParams.get("sort") ?? initialSort) as SortKey;

  const setParam = (key: "category" | "sort", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "featured") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const list =
      category === "all"
        ? [...products]
        : products.filter((p) => p.category === category);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "new":
        return [...list].sort((a, b) =>
          (b.tag === "new" ? 1 : 0) - (a.tag === "new" ? 1 : 0)
        );
      default:
        return list;
    }
  }, [category, sort]);

  const activeCategoryName =
    category === "all"
      ? "all furniture"
      : categories.find((c) => c.slug === category)?.name.toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
          <h1 className="text-balance font-display text-4xl leading-tight sm:text-5xl">
            Shop {activeCategoryName}
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Clean Scandinavian design, honest materials and prices that respect
            your wallet. Every piece comes with free UK delivery over £300 and
            our 10-year guarantee.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            <button
              type="button"
              onClick={() => setParam("category", "all")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                category === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground/80 hover:bg-secondary"
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setParam("category", c.slug)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  category === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/80 hover:bg-secondary"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" />
            <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
              <SelectTrigger className="w-48 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {sortLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-dashed border-border bg-card px-8 py-16 text-center">
            <p className="font-display text-xl">
              Nothing in this category yet
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              We're restocking soon. Try another room or check the new
              arrivals.
            </p>
            <button
              type="button"
              onClick={() => setParam("category", "all")}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View everything
            </button>
          </div>
        )}
      </div>
    </div>
  );
}