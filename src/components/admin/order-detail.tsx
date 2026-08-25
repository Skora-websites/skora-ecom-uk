"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, OrderStatusTimeline } from "@/components/order-status";
import { adminOrders, formatAdminDate, formatPrice } from "@/lib/admin";
import type { OrderStatus } from "@/lib/account";
import { ORDER_STATUS_LABEL } from "@/lib/account";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  processing: "dispatched",
  dispatched: "delivered",
  delivered: null,
};

export function AdminOrderDetail({ id }: { id: string }) {
  const order = adminOrders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  const [status, setStatus] = useState<OrderStatus | null>(order?.status ?? null);

  if (!order || !status) return null;

  const next = NEXT_STATUS[status];

  const advance = () => {
    if (!next) return;
    setStatus(next);
    toast.success(
      `Order ${order.id} marked as ${ORDER_STATUS_LABEL[next].toLowerCase()}`
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Order {order.id}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {formatAdminDate(order.placedAt)}
            </p>
          </div>
          <OrderStatusBadge status={status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fulfilment
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <OrderStatusTimeline status={status} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {next ? (
              <Button onClick={advance}>
                <Check className="size-4" /> Mark as {ORDER_STATUS_LABEL[next]}
              </Button>
            ) : (
              <p className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-700">
                This order has been delivered
              </p>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Customer
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer.email}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Items
              </p>
              <p className="mt-1 text-sm">{order.itemsSummary}</p>
            </div>
          </section>

          <section className="rounded-3xl border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Summary
            </p>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Item count</dt>
                <dd>{order.items}</dd>
              </div>
              <div className="flex justify-between border-t pt-2">
                <dt className="text-muted-foreground">Total</dt>
                <dd className="text-lg font-semibold">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
