import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeInspiration() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] bg-primary text-primary-foreground lg:grid-cols-2">
        <div className="relative order-2 min-h-72 lg:order-1 lg:min-h-full">
          <Image
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
            alt="Airy Scandinavian bedroom styled with Haven bed, linen and soft lighting"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="order-1 flex flex-col items-start justify-center gap-5 p-8 sm:p-12 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            The lookbook
          </p>
          <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">
            Restyled for autumn, built for every season
          </h2>
          <p className="max-w-md text-pretty text-primary-foreground/80">
            Warm linen, deep greens and smoked oak — the Autumn 2025 lookbook
            shows how one room can change with just a few considered pieces.
          </p>
          <Button asChild variant="accent" size="lg">
            <Link href="/shop">
              Explore the look
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}