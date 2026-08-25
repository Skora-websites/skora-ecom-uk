import { formatPrice, products } from "@/lib/products";
import type { OrderStatus } from "@/lib/account";

export interface AdminOrder {
  id: string;
  customer: { name: string; email: string };
  placedAt: string;
  status: OrderStatus;
  items: number;
  total: number;
  itemsSummary: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  memberSince: string;
  lastOrder: string;
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  slug: string;
  unitsSold: number;
  revenue: number;
}

export const revenueByWeek: RevenuePoint[] = [
  { label: "W1", revenue: 12400, orders: 86 },
  { label: "W2", revenue: 13800, orders: 94 },
  { label: "W3", revenue: 11200, orders: 71 },
  { label: "W4", revenue: 15900, orders: 108 },
  { label: "W5", revenue: 14300, orders: 92 },
  { label: "W6", revenue: 17100, orders: 115 },
  { label: "W7", revenue: 16200, orders: 103 },
  { label: "W8", revenue: 18900, orders: 124 },
];

export const adminOrders: AdminOrder[] = [
  {
    id: "HV-10492",
    customer: { name: "Oliver Bennett", email: "oliver@example.com" },
    placedAt: "2025-09-21T09:15:00Z",
    status: "processing",
    items: 3,
    total: 1287,
    itemsSummary: "Sloane Sofa, Luna Pendant x2",
  },
  {
    id: "HV-10488",
    customer: { name: "Priya Sharma", email: "priya@example.com" },
    placedAt: "2025-09-20T18:42:00Z",
    status: "processing",
    items: 1,
    total: 1199,
    itemsSummary: "Oslo Leather Sofa",
  },
  {
    id: "HV-10482",
    customer: { name: "Emma Hartley", email: "emma@haven.com" },
    placedAt: "2025-09-18T10:24:00Z",
    status: "processing",
    items: 3,
    total: 1077,
    itemsSummary: "Sloane Sofa, Luna Pendant x2",
  },
  {
    id: "HV-10471",
    customer: { name: "Tom Calloway", email: "tom@example.com" },
    placedAt: "2025-09-15T14:30:00Z",
    status: "dispatched",
    items: 2,
    total: 898,
    itemsSummary: "Bjorn Oak Table, Elsa Chairs",
  },
  {
    id: "HV-10465",
    customer: { name: "Grace Liu", email: "grace@example.com" },
    placedAt: "2025-09-12T11:08:00Z",
    status: "dispatched",
    items: 1,
    total: 699,
    itemsSummary: "Nova Upholstered Bed",
  },
  {
    id: "HV-10451",
    customer: { name: "Mateo Silva", email: "mateo@example.com" },
    placedAt: "2025-09-08T16:52:00Z",
    status: "delivered",
    items: 2,
    total: 538,
    itemsSummary: "Tor Sideboard, Sol Table Lamp",
  },
  {
    id: "HV-10439",
    customer: { name: "Aisha Khan", email: "aisha@example.com" },
    placedAt: "2025-09-05T10:01:00Z",
    status: "delivered",
    items: 1,
    total: 289,
    itemsSummary: "Astrid Rattan Chair",
  },
  {
    id: "HV-10428",
    customer: { name: "Jack Whitmore", email: "jack@example.com" },
    placedAt: "2025-09-02T13:22:00Z",
    status: "delivered",
    items: 2,
    total: 449,
    itemsSummary: "Alva Bookshelf, Sol Table Lamp",
  },
  {
    id: "HV-10412",
    customer: { name: "Sofia Rossi", email: "sofia@example.com" },
    placedAt: "2025-08-29T15:44:00Z",
    status: "delivered",
    items: 1,
    total: 1349,
    itemsSummary: "Freja Corner Sofa",
  },
  {
    id: "HV-10397",
    customer: { name: "Noah Walker", email: "noah@example.com" },
    placedAt: "2025-08-25T09:36:00Z",
    status: "delivered",
    items: 1,
    total: 549,
    itemsSummary: "Embla Bed",
  },
];

export const adminCustomers: AdminCustomer[] = [
  {
    id: "C-1001",
    name: "Emma Hartley",
    email: "emma@haven.com",
    orders: 4,
    totalSpent: 3211,
    memberSince: "March 2024",
    lastOrder: "2025-09-18",
  },
  {
    id: "C-1002",
    name: "Oliver Bennett",
    email: "oliver@example.com",
    orders: 3,
    totalSpent: 2128,
    memberSince: "May 2024",
    lastOrder: "2025-09-21",
  },
  {
    id: "C-1003",
    name: "Priya Sharma",
    email: "priya@example.com",
    orders: 2,
    totalSpent: 1846,
    memberSince: "January 2025",
    lastOrder: "2025-09-20",
  },
  {
    id: "C-1004",
    name: "Tom Calloway",
    email: "tom@example.com",
    orders: 5,
    totalSpent: 4230,
    memberSince: "November 2023",
    lastOrder: "2025-09-15",
  },
  {
    id: "C-1005",
    name: "Grace Liu",
    email: "grace@example.com",
    orders: 2,
    totalSpent: 1348,
    memberSince: "July 2024",
    lastOrder: "2025-09-12",
  },
  {
    id: "C-1006",
    name: "Mateo Silva",
    email: "mateo@example.com",
    orders: 3,
    totalSpent: 1526,
    memberSince: "April 2024",
    lastOrder: "2025-09-08",
  },
  {
    id: "C-1007",
    name: "Aisha Khan",
    email: "aisha@example.com",
    orders: 1,
    totalSpent: 289,
    memberSince: "September 2025",
    lastOrder: "2025-09-05",
  },
  {
    id: "C-1008",
    name: "Jack Whitmore",
    email: "jack@example.com",
    orders: 2,
    totalSpent: 998,
    memberSince: "June 2024",
    lastOrder: "2025-09-02",
  },
];

export const topProducts: TopProduct[] = products.slice(0, 5).map((p, i) => ({
  slug: p.slug,
  unitsSold: 96 - i * 14,
  revenue: (p.price * (96 - i * 14)) / 1.2,
}));

export const adminStats = {
  totalRevenue: revenueByWeek.reduce((sum, w) => sum + w.revenue, 0),
  totalOrders: revenueByWeek.reduce((sum, w) => sum + w.orders, 0),
  totalCustomers: 1284,
  conversionRate: 3.6,
  avgOrderValue: 154,
};

export function formatAdminDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export { formatPrice };
