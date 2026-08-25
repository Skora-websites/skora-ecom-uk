import { formatPrice, getProduct, type Product } from "@/lib/products";

export type OrderStatus = "processing" | "dispatched" | "delivered";

export interface OrderItem {
  slug: string;
  qty: number;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  deliveryCost: number;
  addressId: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2: string;
  postcode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string;
  tier: string;
  addressIds: string[];
}

export const customer: Customer = {
  firstName: "Emma",
  lastName: "Hartley",
  email: "emma@haven.com",
  phone: "+44 7700 900123",
  memberSince: "March 2024",
  tier: "Haven Member",
  addressIds: ["home", "studio"],
};

export const addresses: Address[] = [
  {
    id: "home",
    label: "Home",
    name: "Emma Hartley",
    line1: "14 Willow Lane, Clifton",
    line2: "Bristol",
    postcode: "BS8 4HT",
    country: "United Kingdom",
    isDefault: true,
  },
  {
    id: "studio",
    label: "Studio",
    name: "Emma Hartley",
    line1: "The Old Bakery, 22 Midland Road",
    line2: "Bristol",
    postcode: "BS6 5TT",
    country: "United Kingdom",
    isDefault: false,
  },
];

export const orders: Order[] = [
  {
    id: "HV-10482",
    placedAt: "2025-09-18T10:24:00Z",
    status: "processing",
    items: [
      { slug: "sloane-sofa", qty: 1 },
      { slug: "luna-pendant", qty: 2 },
    ],
    deliveryCost: 0,
    addressId: "home",
  },
  {
    id: "HV-10361",
    placedAt: "2025-08-02T14:05:00Z",
    status: "dispatched",
    items: [{ slug: "tor-sideboard", qty: 1 }],
    deliveryCost: 0,
    addressId: "home",
  },
  {
    id: "HV-10297",
    placedAt: "2025-06-27T09:12:00Z",
    status: "delivered",
    items: [
      { slug: "sol-table-lamp", qty: 1 },
      { slug: "milo-lounge-chair", qty: 1 },
    ],
    deliveryCost: 0,
    addressId: "studio",
  },
  {
    id: "HV-10120",
    placedAt: "2025-04-11T16:40:00Z",
    status: "delivered",
    items: [{ slug: "bjorn-oak-table", qty: 1 }],
    deliveryCost: 39,
    addressId: "home",
  },
];

export const savedSlugs = [
  "oslo-leather-sofa",
  "bjorn-oak-table",
  "nova-upholstered-bed",
  "alva-bookshelf",
];

export function getAddress(id: string): Address | undefined {
  return addresses.find((a) => a.id === id);
}

export function getOrder(id: string): Order | undefined {
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export interface ResolvedOrderItem {
  product: Product;
  qty: number;
  lineTotal: number;
}

export function orderItems(order: Order): ResolvedOrderItem[] {
  return order.items.map((item) => {
    const product = getProduct(item.slug);
    if (!product) throw new Error(`Unknown product slug in order: ${item.slug}`);
    return { product, qty: item.qty, lineTotal: product.price * item.qty };
  });
}

export function orderSubtotal(order: Order): number {
  return orderItems(order).reduce((sum, item) => sum + item.lineTotal, 0);
}

export function orderTotal(order: Order): number {
  return orderSubtotal(order) + order.deliveryCost;
}

export function savedItems(): Product[] {
  return savedSlugs
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => Boolean(p));
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "processing",
  "dispatched",
  "delivered",
];

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export { formatPrice };
