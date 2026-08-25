"use client";

import { useMemo, useState } from "react";
import { PackageSearch, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductImage } from "@/components/product-image";
import {
  categories,
  formatPrice,
  getCategory,
  products,
} from "@/lib/products";

type ProductStatus = "active" | "draft";
type CategoryFilter = "all" | string;

export default function AdminProductsPage() {
  const [statusBySlug, setStatusBySlug] = useState<Record<string, ProductStatus>>(
    () => Object.fromEntries(products.map((p) => [p.slug, "active"]))
  );
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const toggleStatus = (slug: string) => {
    const next = statusBySlug[slug] === "active" ? "draft" : "active";
    setStatusBySlug((prev) => ({ ...prev, [slug]: next }));
    toast.success(
      next === "active" ? "Product is now live" : "Product moved to draft"
    );
  };

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchCategory =
          categoryFilter === "all" || p.category === categoryFilter;
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q);
        return matchCategory && matchQuery;
      }),
    [categoryFilter, query]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Products</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} products · toggle live status
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="h-11 rounded-full pl-10"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="h-11 w-full rounded-full sm:w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-3xl border bg-card p-2 sm:p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No products match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => {
                const isActive = statusBySlug[product.slug] === "active";
                return (
                  <TableRow key={product.slug}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.material}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategory(product.category)?.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-semibold">
                        {formatPrice(product.price)}
                      </p>
                      {product.compareAt && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.compareAt)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <Star className="size-3.5 fill-accent text-accent" />
                        {product.rating.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.tag ? (
                        <Badge
                          variant={
                            product.tag === "bestseller" ? "default" : "secondary"
                          }
                          className="rounded-full"
                        >
                          {product.tag}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => toggleStatus(product.slug)}
                          aria-label={`Toggle ${product.name}`}
                        />
                        <span
                          className={`text-xs font-semibold ${isActive ? "text-emerald-700" : "text-muted-foreground"}`}
                        >
                          {isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}