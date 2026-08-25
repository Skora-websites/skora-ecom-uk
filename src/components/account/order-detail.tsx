"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product-image";
import { OrderStatusBadge, OrderStatusTimeline } from "@/components/order-status";
import { useCart } from "@/lib/cart";
import {
  formatOrderDate,
  getAddress,
  getOrder,
  orderItems,
  orderSubtotal,
  orderTotal,
} from "@/lib/account";
import { formatPrice } from "@/lib/products";

export function OrderDetail({ id }: { id: string }) {
  const { add } = useCart();
  const order = getOrder(id);
  if (!order) return null;

  const items = orderItems(order);
  const address = getAddress(order.addressId);
  const subtotal = orderSubtotal(order);

  const handleReorder = () => {
    items.forEach((item) => add(item.product, item.qty));
    toast.success("Items added to your bag");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Order {order.id}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatOrderDate(order.placedAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <section className="rounded-3xl border bg-card p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Order progress
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <OrderStatusTimeline status={order.status} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Link
              key={item.product.slug}
              href={`/shop/${item.product.slug}`}
              className="flex items-center gap-4 rounded-3xl border bg-card p-4 transition-colors hover:bg-secondary/40"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
                <ProductImage
                  src={item.product.image}
                  alt={item.product.name}
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.product.material} · Qty {item.qty}
                </p>
                <p className="mt-1 font-semibold">{formatPrice(item.lineTotal)}</p>
              </div>
            </Link>
          ))}

          <Button variant="outline" className="self-start" onClick={handleReorder}>
            <RotateCcw className="size-4" /> Reorder all
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Summary
            </p>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>
                  {order.deliveryCost === 0 ? (
                    <span className="font-medium text-emerald-700">Free</span>
                  ) : (
                    formatPrice(order.deliveryCost)
                  )}
                </dd>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(orderTotal(order))}</dd>
              </div>
            </dl>
          </div>

          {address && (
            <div className="rounded-3xl border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Delivery to
              </p>
              <p className="mt-3 font-medium">{address.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {address.name}
                <br />
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.postcode}
                <br />
                {address.country}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
