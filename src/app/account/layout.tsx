"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Home,
  LogOut,
  MapPin,
  Package,
  User as UserIcon,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { customer } from "@/lib/account";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/account", icon: Home },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Saved items", href: "/account/saved", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: UserIcon },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated("customer")) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated("customer")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success("Signed out — see you soon");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            My account
          </p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
            Hello, {customer.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.tier} since {customer.memberSince}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav
            className="flex gap-1 overflow-x-auto rounded-3xl border bg-card p-2 lg:flex-col lg:rounded-2xl"
            aria-label="Account"
          >
            {navItems.map((item) => {
              const active =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:rounded-xl",
                    active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <Icon className="size-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
