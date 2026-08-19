import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col items-start gap-6">
          <p
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles className="size-3.5" />
            New season · Sloane collection
          </p>
          <h1
            className="text-balance animate-fade-up font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Furniture for slower, softer living
          </h1>
          <p
            className="max-w-md text-pretty animate-fade-up text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Honest Scandinavian design in warm natural materials. Made to be
            lived in for a decade — not a season, with free UK delivery and a
            10-year guarantee.
          </p>
          <div
            className="flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <Button asChild size="lg">
              <Link href="/shop">
                Shop the collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop?category=sofas">Explore sofas</Link>
            </Button>
          </div>
          <p
            className="flex items-center gap-4 text-sm text-muted-foreground animate-fade-up"
            style={{ animationDelay: "320ms" }}
          >
            <span>4.8★ from 1,200+ reviews</span>
            <span className="size-1 rounded-full bg-border" />
            <span>10-year guarantee</span>
          </p>
        </div>

        <div
          className="relative aspect-[4/3] animate-fade-up overflow-hidden rounded-[2rem] bg-muted lg:aspect-[5/4]"
          style={{ animationDelay: "160ms" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1800&q=80"
            alt="Bright Scandinavian living room styled with Haven sofas and furnishings"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur">
            The calm edit · Autumn 2025
          </span>
        </div>
      </div>
    </section>
  );
}