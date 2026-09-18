"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/** Routes that render their own navigation and don't need the storefront chrome. */
const CHROME_LESS_PREFIXES = ["/admin", "/account"];

function useHideChrome() {
  const pathname = usePathname();
  return CHROME_LESS_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Renders the storefront header above the page content and the footer below it.
 * Dashboards (admin and account) provide their own navigation, so the
 * site-wide chrome is hidden there.
 */
export function StorefrontHeader() {
  if (useHideChrome()) return null;
  return <SiteHeader />;
}

export function StorefrontFooter() {
  if (useHideChrome()) return null;
  return <SiteFooter />;
}
