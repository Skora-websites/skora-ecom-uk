import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel = "View all",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-3",
          align === "center" && "items-center"
        )}
      >
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-balance text-3xl leading-tight sm:text-4xl",
            align === "center" && "max-w-2xl"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-pretty text-base text-muted-foreground",
              align === "center" ? "max-w-xl" : "max-w-2xl"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}