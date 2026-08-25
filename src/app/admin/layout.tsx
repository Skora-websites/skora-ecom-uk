"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { NotificationCenter } from "@/components/admin/notification-center";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      if (isAuthenticated("admin")) router.replace("/admin");
      return;
    }
    if (!isAuthenticated("admin")) router.replace("/admin/login");
  }, [isLoginPage, isAuthenticated, router]);

  // The login page renders standalone, without the dashboard chrome.
  if (isLoginPage) return <>{children}</>;
  if (!isAuthenticated("admin")) return null;

  const handleLogout = () => {
    logout();
    toast.success("Signed out of admin");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Haven admin
          </p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
            Store dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.name ?? "Haven Admin"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Store className="size-4" /> View store
            </Link>
          </Button>
          <NotificationCenter />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav
            className="flex gap-1 overflow-x-auto rounded-3xl border bg-card p-2 lg:flex-col lg:rounded-2xl"
            aria-label="Admin"
          >
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:rounded-xl",
                    active &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <Icon className="size-4" />
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
