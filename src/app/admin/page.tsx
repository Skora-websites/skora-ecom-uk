"use client";

import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { OrderStatusBadge } from "@/components/order-status";
import {
  adminOrders,
  adminStats,
  formatAdminDate,
  revenueByWeek,
  topProducts,
} from "@/lib/admin";
import { formatCount, formatPrice, getProduct } from "@/lib/products";

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
};

export default function AdminOverviewPage() {
  const first = revenueByWeek[0];
  const last = revenueByWeek[revenueByWeek.length - 1];
  const revenueDelta = ((last.revenue - first.revenue) / first.revenue) * 100;
  const ordersDelta = ((last.orders - first.orders) / first.orders) * 100;
  const firstAov = first.revenue / first.orders;
  const lastAov = last.revenue / last.orders;
  const aovDelta = ((lastAov - firstAov) / firstAov) * 100;

  const kpis = [
    {
      label: "Total revenue",
      value: formatPrice(adminStats.totalRevenue),
      delta: `+${revenueDelta.toFixed(1)}%`,
      icon: Banknote,
    },
    {
      label: "Total orders",
      value: formatCount(adminStats.totalOrders),
      delta: `+${ordersDelta.toFixed(1)}%`,
      icon: Package,
    },
    {
      label: "Customers",
      value: formatCount(adminStats.totalCustomers),
      delta: "+2.4%",
      icon: Users,
    },
    {
      label: "Avg order value",
      value: formatPrice(adminStats.avgOrderValue),
      delta: `+${aovDelta.toFixed(1)}%`,
      icon: TrendingUp,
    },
  ];

  const maxUnits = Math.max(...topProducts.map((p) => p.unitsSold));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="flex flex-col gap-3 rounded-3xl border bg-card p-5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <p className="text-2xl font-semibold">{kpi.value}</p>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-emerald-500/15 text-emerald-700"
                  >
                    {kpi.delta}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Revenue</h2>
              <p className="text-sm text-muted-foreground">
                Last 8 weeks · {formatPrice(adminStats.avgOrderValue)} average
                order
              </p>
            </div>
            <Badge variant="outline" className="rounded-full">
              {formatPrice(first.revenue)} → {formatPrice(last.revenue)}
            </Badge>
          </div>
          <ChartContainer config={chartConfig} className="mt-4 h-72 w-full">
            <AreaChart data={revenueByWeek} margin={{ left: 4, right: 4 }}>
              <defs>
                <linearGradient
                  id="fillRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      formatPrice(Number(value)),
                      "Revenue",
                    ]}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Top products</h2>
          <p className="text-sm text-muted-foreground">By units sold</p>
          <ul className="mt-4 flex flex-col gap-4">
            {topProducts.map((product, i) => {
              const meta = getProduct(product.slug);
              return (
                <li key={product.slug} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {meta?.name ?? product.slug}
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(product.unitsSold / maxUnits) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      {formatCount(product.unitsSold)} sold
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(Math.round(product.revenue))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="rounded-3xl border bg-card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <p className="text-sm text-muted-foreground">
              Latest {adminOrders.slice(0, 5).length} across the store
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {adminOrders.slice(0, 5).map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id.toLowerCase()}`}
              className="group flex items-center justify-between gap-3 rounded-2xl border bg-background/60 p-4 transition-colors hover:bg-secondary/40"
            >
              <div className="min-w-0">
                <p className="font-semibold">{order.id}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {order.customer.name} · {formatAdminDate(order.placedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="font-semibold">{formatPrice(order.total)}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
