"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/** Routes that render their own navigation and don't need the storefront chrome. */
const CHROME_LESS_PREFIXES = ["/admin", "/account"];

/**
 * Renders the storefront header and footer only on public storefront pages.
 * Dashboards (admin and account) provide their own navigation, so the
 * site-wide chrome is hidden there.
 */
export function StorefrontChrome() {
  const pathname = usePathname();

  const hideChrome = CHROME_LESS_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (hideChrome) return null;

  return (
    <>
      <SiteHeader />
      <SiteFooter />
    </>
  );
}
