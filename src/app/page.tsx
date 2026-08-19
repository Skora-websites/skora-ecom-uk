import type { Metadata } from "next";
import { HomeHero } from "@/components/home/home-hero";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeNewArrivals } from "@/components/home/home-new-arrivals";
import { HomeValues } from "@/components/home/home-values";
import { HomeInspiration } from "@/components/home/home-inspiration";
import { HomeNewsletter } from "@/components/home/home-newsletter";

export const metadata: Metadata = {
  title: "Haven | Modern Scandinavian Furniture and Home",
  description:
    "Bright, minimal Scandinavian furniture for every room. Sofas, dining, bedroom, lighting and storage with free UK delivery over £300 and a 10-year guarantee.",
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Haven",
  url: "https://haven-home.example.com",
  description:
    "Bright, minimal Scandinavian furniture for every room. Free UK delivery over £300 and a 10-year guarantee.",
  logo: "https://haven-home.example.com/logo.png",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeHero />
      <HomeCategories />
      <HomeNewArrivals />
      <HomeValues />
      <HomeInspiration />
      <HomeNewsletter />
    </>
  );
}