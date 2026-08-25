import { useSyncExternalStore } from "react";
import {
  products as seedProducts,
  type CategorySlug,
  type Product,
  type ProductTag,
} from "@/lib/products";

export type ProductStatus = "active" | "draft";

export interface StoreProduct extends Product {
  status: ProductStatus;
}

export interface ProductInput {
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  material: string;
  finishOptions: string[];
  tag?: ProductTag;
  description: string;
  details: string[];
  status: ProductStatus;
}

export interface StoreApi {
  /** All products, including drafts. */
  products: StoreProduct[];
  /** Products currently live on the storefront. */
  liveProducts: Product[];
  getProduct: (slug: string) => StoreProduct | undefined;
  saveProduct: (input: ProductInput, existingSlug?: string) => StoreProduct;
  deleteProduct: (slug: string) => void;
  toggleProductStatus: (slug: string) => void;
  resetStore: () => void;
}

const STORAGE_KEY = "haven-store-products-v1";

// The static catalogue is the seed. StoreProduct objects are never mutated
// in place, so sharing references with the seed is safe.
const seeded: StoreProduct[] = seedProducts.map((p) => ({ ...p, status: "active" }));

let snapshot: StoreProduct[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readSnapshot(): StoreProduct[] {
  if (snapshot) return snapshot;
  if (typeof window === "undefined") return seeded;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (p) => p && typeof p === "object" && typeof p.slug === "string"
        )
      ) {
        snapshot = parsed as StoreProduct[];
        return snapshot;
      }
    }
  } catch {
    // fall through to seed
  }
  snapshot = seeded;
  return snapshot;
}

/** Used for SSR and hydration so the server HTML always matches the seed. */
function getServerSnapshot(): StoreProduct[] {
  return seeded;
}

function write(next: StoreProduct[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — changes still apply for this session
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(base: string, list: StoreProduct[]): string {
  const fallback = base || "product";
  const taken = new Set(list.map((p) => p.slug));
  if (!taken.has(fallback)) return fallback;
  let i = 2;
  while (taken.has(`${fallback}-${i}`)) i += 1;
  return `${fallback}-${i}`;
}

export function saveProduct(
  input: ProductInput,
  existingSlug?: string
): StoreProduct {
  const list = readSnapshot();
  const slug = existingSlug ?? uniqueSlug(slugify(input.name), list);
  const product: StoreProduct = { ...input, slug };
  const next = existingSlug
    ? list.map((p) => (p.slug === existingSlug ? product : p))
    : [...list, product];
  write(next);
  return product;
}

export function deleteProduct(slug: string) {
  write(readSnapshot().filter((p) => p.slug !== slug));
}

export function toggleProductStatus(slug: string) {
  write(
    readSnapshot().map((p) =>
      p.slug === slug
        ? { ...p, status: p.status === "active" ? "draft" : "active" }
        : p
    )
  );
}

export function resetStore() {
  write(seeded.map((p) => ({ ...p })));
}

export function useStore(): StoreApi {
  const products = useSyncExternalStore(
    subscribe,
    readSnapshot,
    getServerSnapshot
  );
  const liveProducts = products.filter((p) => p.status === "active");
  return {
    products,
    liveProducts,
    getProduct: (slug) => products.find((p) => p.slug === slug),
    saveProduct,
    deleteProduct,
    toggleProductStatus,
    resetStore,
  };
}
