"use client";

import { useMemo, useState } from "react";
import {
  PackageSearch,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductImage } from "@/components/product-image";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { categories, formatPrice, getCategory } from "@/lib/products";
import { useStore, type StoreProduct } from "@/lib/store";

export default function AdminProductsPage() {
  const { products, toggleProductStatus, deleteProduct, resetStore } =
    useStore();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StoreProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoreProduct | null>(null);

  const liveCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.length - liveCount;

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
    [categoryFilter, query, products]
  );

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: StoreProduct) => {
    setEditing(product);
    setFormOpen(true);
  };

  const toggleStatus = (product: StoreProduct) => {
    const next = product.status === "active" ? "draft" : "active";
    toggleProductStatus(product.slug);
    toast.success(
      next === "active"
        ? `“${product.name}” is now live`
        : `“${product.name}” moved to draft`
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.slug);
    toast.success(`“${deleteTarget.name}” deleted`);
    setDeleteTarget(null);
  };

  const handleReset = () => {
    resetStore();
    toast.success("Store restored to the demo catalogue");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} products · {liveCount} live · {draftCount} draft
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="size-4" /> Reset demo data
          </Button>
          <Button onClick={openAdd}>
            <Plus className="size-4" /> Add product
          </Button>
        </div>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <PackageSearch className="size-7" />
          </span>
          <p className="font-medium">No products found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different search or add a new product to the catalogue.
          </p>
          <Button onClick={openAdd} className="mt-1">
            <Plus className="size-4" /> Add product
          </Button>
        </div>
      ) : (
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const isActive = product.status === "active";
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
                            product.tag === "bestseller"
                              ? "default"
                              : "secondary"
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
                          onCheckedChange={() => toggleStatus(product)}
                          aria-label={`Toggle ${product.name}`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isActive
                              ? "text-emerald-700"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(product)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductFormDialog
        open={formOpen}
        existing={editing}
        onOpenChange={setFormOpen}
        onClose={() => setFormOpen(false)}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from the storefront and the catalogue.
              This action can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
