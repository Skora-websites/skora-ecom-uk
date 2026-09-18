"use client";

import Link from "next/link";
import {
  Armchair,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
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
  { label: "Staff sign in", href: "/admin/login" },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
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
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Haven Ltd. All rights reserved.</p>
          <p>
            Designed by{" "}
            <a
              href="http://skorainfotech.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-foreground/80 underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
            >
              Skora Infotech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}