import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { formatOrderDate, orderItems, orderTotal, orders } from "@/lib/account";
import { formatPrice } from "@/lib/products";
import { OrderStatusBadge } from "@/components/order-status";
import { ProductImage } from "@/components/product-image";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Order history</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Track deliveries and view past purchases.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Package className="size-7" />
          </span>
          <p className="font-medium">No orders yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            When you place an order it will appear here for tracking.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const items = orderItems(order);
            const first = items[0];
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id.toLowerCase()}`}
                className="group rounded-3xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Placed {formatOrderDate(order.placedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-lg font-semibold">
                      {formatPrice(orderTotal(order))}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <ProductImage
                      src={first.product.image}
                      alt={first.product.name}
                      sizes="56px"
                    />
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {first.product.name}
                    {items.length > 1 && ` +${items.length - 1} more item${items.length > 2 ? "s" : ""}`}
                  </p>
                  <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
