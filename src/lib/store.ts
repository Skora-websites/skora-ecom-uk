import { useEffect, useSyncExternalStore } from "react";
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
  /** True once the MongoDB API has responded successfully at least once. */
  isServerBacked: boolean;
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

// ---------------------------------------------------------------------------
// MongoDB sync (via /api/products)
// ---------------------------------------------------------------------------

type ServerState = "unknown" | "available" | "unavailable";
let serverState: ServerState = "unknown";
let syncInFlight: Promise<void> | null = null;

/**
 * Pulls the catalogue from MongoDB (through the API) and replaces the local
 * snapshot. No-ops when the API is unavailable (local-only mode).
 */
export function syncFromServer(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (serverState === "unavailable") return Promise.resolve();
  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) {
        serverState = "unavailable";
        return;
      }
      const data: unknown = await res.json();
      const list =
        data && typeof data === "object" && Array.isArray((data as { products?: unknown }).products)
          ? ((data as { products: StoreProduct[] }).products)
          : null;
      if (!list) {
        serverState = "unavailable";
        return;
      }
      serverState = "available";
      write(list);
    } catch {
      serverState = "unavailable";
    } finally {
      syncInFlight = null;
    }
  })();
  return syncInFlight;
}

/** Fire-and-forget write-through to the API when MongoDB mode is active. */
function syncToServer(url: string, method: string, body?: unknown) {
  if (serverState !== "available") return;
  void fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).catch((error) => {
    console.warn(`MongoDB sync failed (${method} ${url}):`, error);
  });
}

export function isServerBacked(): boolean {
  return serverState === "available";
}

// ---------------------------------------------------------------------------

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
  if (existingSlug) {
    syncToServer(`/api/products/${encodeURIComponent(existingSlug)}`, "PUT", input);
  } else {
    syncToServer("/api/products", "POST", product);
  }
  return product;
}

export function deleteProduct(slug: string) {
  write(readSnapshot().filter((p) => p.slug !== slug));
  syncToServer(`/api/products/${encodeURIComponent(slug)}`, "DELETE");
}

export function toggleProductStatus(slug: string) {
  const next = readSnapshot().map((p) =>
    p.slug === slug
      ? { ...p, status: p.status === "active" ? ("draft" as const) : ("active" as const) }
      : p
  );
  write(next);
  const toggled = next.find((p) => p.slug === slug);
  if (toggled) {
    syncToServer(`/api/products/${encodeURIComponent(slug)}`, "PATCH", {
      status: toggled.status,
    });
  }
}

export function resetStore() {
  write(seeded.map((p) => ({ ...p })));
}

export function useStore(): StoreApi {
  // Hydrate from MongoDB once on first mount in any component that uses the store.
  useEffect(() => {
    void syncFromServer();
  }, []);

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
    isServerBacked: serverState === "available",
  };
}
