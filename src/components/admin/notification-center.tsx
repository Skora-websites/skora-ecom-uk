"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  Package,
  ShoppingBag,
  Star,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  pushNotification,
  relativeTime,
  useNotifications,
  type AppNotification,
  type NewNotification,
} from "@/lib/notifications";
import { useStore, type StoreProduct } from "@/lib/store";
import { cn } from "@/lib/utils";

const orderNames = [
  "Amelia",
  "Noah",
  "Isla",
  "Rory",
  "Priya",
  "Theo",
  "Maya",
  "Harper",
];

const reviewSnippets = [
  "It's the most comfortable sofa we've owned.",
  "Beautiful craftsmanship and quick delivery.",
  "Exceeded every expectation, worth every penny.",
  "The perfect centrepiece for our living room.",
];

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function simulateEvent(products: StoreProduct[]): NewNotification {
  const product = products.length
    ? randomItem(products)
    : undefined;
  const roll = Math.random();

  if (product && roll < 0.35) {
    const price = product.price * (1 + Math.floor(Math.random() * 3));
    return {
      type: "order",
      title: `New order · ${randomItem(orderNames)}`,
      message: `Ordered “${product.name}” for ${price.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      })}.`,
      href: "/admin/orders",
    };
  }
  if (product && roll < 0.6) {
    return {
      type: "review",
      title: "New 5-star review",
      message: `“${randomItem(reviewSnippets)}”`,
    };
  }
  if (product && roll < 0.85) {
    return {
      type: "stock",
      title: `Low stock · ${product.name}`,
      message: `Only ${1 + Math.floor(Math.random() * 3)} left in stock.`,
      href: "/admin/products",
    };
  }
  return {
    type: "customer",
    title: "New customer joined",
    message: `${randomItem(orderNames)} created an account.`,
    href: "/admin/customers",
  };
}

const typeStyles: Record<
  AppNotification["type"],
  { icon: typeof Bell; className: string }
> = {
  order: { icon: ShoppingBag, className: "bg-primary/10 text-primary" },
  review: { icon: Star, className: "bg-amber-500/10 text-amber-600" },
  stock: { icon: AlertTriangle, className: "bg-orange-500/10 text-orange-600" },
  customer: { icon: UserPlus, className: "bg-sky-500/10 text-sky-600" },
};

export function NotificationCenter() {
  const router = useRouter();
  const { products } = useStore();
  const { notifications, unreadCount, markRead, markAllRead, dismiss, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  // Simulate live store activity while the dashboard is open.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = () => {
      const delay = 8000 + Math.random() * 17000; // every 8–25 seconds
      timeout = setTimeout(() => {
        if (cancelled) return;
        pushNotification(simulateEvent(products));
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [products]);

  // Keep relative timestamps fresh.
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notification: AppNotification) => {
    markRead(notification.id);
    if (notification.href) {
      router.push(notification.href);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full"
          aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-5 text-primary-foreground ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(92vw,26rem)] rounded-3xl p-0"
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div>
            <p className="font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">
              Live store activity
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-3 text-xs"
              onClick={markAllRead}
            >
              <CheckCheck className="size-3.5" /> Mark all read
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <BellOff className="size-6" />
            </span>
            <p className="text-sm font-medium">All caught up</p>
            <p className="text-xs text-muted-foreground">
              New store activity will appear here in real time.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <ul className="flex flex-col">
              {notifications.map((notification) => {
                const { icon: Icon, className } = typeStyles[notification.type];
                return (
                  <li key={notification.id} className="relative">
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 pr-12 text-left transition-colors hover:bg-secondary/50",
                        !notification.read && "bg-primary/[0.03]"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl",
                          className
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold">
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="size-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {notification.message}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground/70">
                          {relativeTime(notification.createdAt)}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Dismiss notification"
                      onClick={() => dismiss(notification.id)}
                      className="absolute right-2.5 top-3.5 grid size-6 place-items-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between px-4 py-2.5">
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "Everything is read"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-full px-3 text-xs"
                onClick={clearAll}
              >
                <Package className="size-3.5" /> Clear all
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
