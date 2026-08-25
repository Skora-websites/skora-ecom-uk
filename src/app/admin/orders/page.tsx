"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Package, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { adminOrders as seedOrders, formatAdminDate, formatPrice } from "@/lib/admin";
import type { OrderStatus } from "@/lib/account";
import { ORDER_STATUS_LABEL } from "@/lib/account";

type StatusFilter = "all" | OrderStatus;

const STATUS_FILTERS: StatusFilter[] = ["all", "processing", "dispatched", "delivered"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(seedOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const changeStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} marked as ${ORDER_STATUS_LABEL[status].toLowerCase()}`);
  };

  const filtered = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.customer.email.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} orders · update status or open for details
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or customer…"
            className="h-11 rounded-full pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="h-11 w-full rounded-full sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all"
                  ? "All statuses"
                  : ORDER_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
            <Package className="size-7" />
          </span>
          <p className="font-medium">No matching orders</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different search or status filter.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-2 sm:p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} className="group">
                  <TableCell className="align-top">
                    <Link
                      href={`/admin/orders/${order.id.toLowerCase()}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {order.id}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatAdminDate(order.placedAt)}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer.email}
                    </p>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    {order.items}
                  </TableCell>
                  <TableCell className="text-right align-top font-semibold">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="align-top">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        changeStatus(order.id, value as OrderStatus)
                      }
                    >
                      <SelectTrigger className="h-8 w-36 rounded-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/admin/orders/${order.id.toLowerCase()}`}
                        aria-label={`View order ${order.id}`}
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
