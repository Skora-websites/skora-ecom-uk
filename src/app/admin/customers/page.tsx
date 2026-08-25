"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminCustomers, formatAdminDate, formatPrice } from "@/lib/admin";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");

  const maxSpent = Math.max(...adminCustomers.map((c) => c.totalSpent));

  const filtered = useMemo(
    () =>
      adminCustomers.filter((c) => {
        const q = query.trim().toLowerCase();
        return (
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      }),
    [query]
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Customers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {adminCustomers.length} registered customers
        </p>
      </div>

      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email…"
          className="h-11 rounded-full pl-10"
        />
      </div>

      <div className="rounded-3xl border bg-card p-2 sm:p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Member since</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total spent</TableHead>
              <TableHead>Last order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No customers match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((customer) => {
                const isTop = customer.totalSpent === maxSpent;
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                            {initials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {customer.name}
                            {isTop && (
                              <span className="ml-1.5 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                                Top
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.memberSince}</TableCell>
                    <TableCell className="text-right">{customer.orders}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(customer.totalSpent)}
                    </TableCell>
                    <TableCell>{formatDate(customer.lastOrder)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}