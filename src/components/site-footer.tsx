"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Armchair,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/products";

const companyLinks = [
  { label: "About Haven", href: "/" },
  { label: "Sustainability", href: "/" },
  { label: "Careers", href: "/" },
  { label: "Press", href: "/" },
];

const helpLinks = [
  { label: "Delivery", href: "/" },
  { label: "Returns", href: "/" },
  { label: "10-year guarantee", href: "/" },
  { label: "Contact us", href: "/" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("Welcome to the Haven list!", {
      description: "Look out for launches, styling tips and quiet offers.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr]">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-2xl font-semibold"
              aria-label="Haven home"
            >
              <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
                <Armchair className="size-5" />
              </span>
              Haven
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/75">
              Bright, honest Scandinavian furniture for slower living. Designed
              in Copenhagen, loved in the UK.
            </p>
            <div className="flex items-center gap-2">
              {[
                { label: "Instagram", Icon: Instagram },
                { label: "Facebook", Icon: Facebook },
                { label: "Twitter", Icon: Twitter },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Shop
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    className="text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company and help">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-4 mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Help
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              The Haven list
            </h3>
            <p className="text-sm leading-relaxed text-primary-foreground/75">
              Room ideas, new pieces and member-only offers. One calm email a
              month.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 min-w-0 flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <Button
                type="submit"
                variant="accent"
                size="icon"
                aria-label="Subscribe"
                className="size-11 shrink-0"
              >
                <ArrowRight className="size-4" />
              </Button>
            </form>
            <p className="text-xs text-primary-foreground/60">
              By subscribing you agree to our privacy policy. Unsubscribe
              anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Haven Ltd. All rights reserved.</p>
          <p>Prices in GBP (£) · Designed in Copenhagen</p>
        </div>
      </div>
    </footer>
  );
}