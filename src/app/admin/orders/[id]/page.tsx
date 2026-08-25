import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminOrders } from "@/lib/admin";
import { AdminOrderDetail } from "@/components/admin/order-detail";

interface AdminOrderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = adminOrders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  if (!order) return { title: "Order not found" };
  return { title: `Order ${order.id} · Admin` };
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;
  const exists = adminOrders.some((o) => o.id.toLowerCase() === id.toLowerCase());
  if (!exists) notFound();

  return <AdminOrderDetail id={id} />;
}
