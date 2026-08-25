import Link from "next/link";
import { Heart, MapPin, Package, ArrowRight, Truck } from "lucide-react";
import {
  addresses,
  customer,
  formatOrderDate,
  orderItems,
  orderTotal,
  orders,
  savedSlugs,
} from "@/lib/account";
import { formatPrice } from "@/lib/products";
import { OrderStatusBadge, OrderStatusTimeline } from "@/components/order-status";
import { ProductImage } from "@/components/product-image";

export default function AccountOverviewPage() {
  const latest = orders[0];
  const latestItems = orderItems(latest);

  const summary = [
    {
      label: "Total orders",
      value: orders.length,
      href: "/account/orders",
      icon: Package,
    },
    {
      label: "Saved items",
      value: savedSlugs.length,
      href: "/account/saved",
      icon: Heart,
    },
    {
      label: "Addresses",
      value: addresses.length,
      href: "/account/addresses",
      icon: MapPin,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group flex flex-col gap-3 rounded-3xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/40"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold">{s.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="rounded-3xl border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Latest order
            </p>
            <h2 className="mt-1 text-xl font-semibold">{latest.id}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Placed {formatOrderDate(latest.placedAt)} ·{" "}
              {formatPrice(orderTotal(latest))}
            </p>
          </div>
          <OrderStatusBadge status={latest.status} />
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_220px]">
          <div className="flex flex-col gap-3">
            {latestItems.map((item) => (
              <div
                key={item.product.slug}
                className="flex items-center gap-4 rounded-2xl border bg-background/60 p-3"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <ProductImage
                    src={item.product.image}
                    alt={item.product.name}
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty {item.qty}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
            <Link
              href={`/account/orders/${latest.id.toLowerCase()}`}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              View order details <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-2xl bg-secondary/50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Order progress
            </p>
            <OrderStatusTimeline status={latest.status} />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent/20 text-accent-foreground">
            <Truck className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Delivery updates</p>
            <p className="text-sm text-muted-foreground">
              We'll email you at {customer.email} as your order moves.
            </p>
          </div>
        </div>
        <Link
          href="/account/profile"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Manage preferences <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
