import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/account";
import { OrderDetail } from "@/components/account/order-detail";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) return { title: "Order not found" };
  return { title: `Order ${order.id}` };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return <OrderDetail id={id} />;
}
