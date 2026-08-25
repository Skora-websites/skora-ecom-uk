import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STEPS,
  type OrderStatus,
} from "@/lib/account";

const statusColor: Record<OrderStatus, string> = {
  processing: "bg-accent/20 text-accent-foreground",
  dispatched: "bg-blue-500/15 text-blue-700",
  delivered: "bg-emerald-500/15 text-emerald-700",
};

const stepDot: Record<OrderStatus, string> = {
  processing: "bg-accent text-accent-foreground border-accent",
  dispatched: "bg-blue-500 text-white border-blue-500",
  delivered: "bg-emerald-500 text-white border-emerald-500",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        statusColor[status],
        className
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function OrderStatusTimeline({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  // Active status index + "Placed" is always completed once an order exists
  const activeCount = ORDER_STATUS_STEPS.indexOf(status) + 1;

  return (
    <ol className={cn("space-y-0", className)} aria-label="Order progress">
      {["Placed", ...ORDER_STATUS_STEPS].map((label, i) => {
        const complete = i <= activeCount;
        const isLast = i === ORDER_STATUS_STEPS.length;
        return (
          <li key={label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
                  complete
                    ? stepDot[ORDER_STATUS_STEPS[i - 1] ?? "processing"]
                    : "border-border bg-muted text-muted-foreground"
                )}
              >
                {complete ? <Check className="size-3.5" /> : i + 1}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "w-px flex-1 my-1",
                    complete && i < activeCount ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium",
                  complete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </p>
              {i === 0 && (
                <p className="text-xs text-muted-foreground">Order confirmed</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
