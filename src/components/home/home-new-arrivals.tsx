"use client";

import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { products } from "@/lib/products";

export function HomeNewArrivals() {
  const newArrivals = products.filter((p) => p.tag === "new").slice(0, 4);

  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals"
            description="Fresh pieces from the Autumn 2025 collection — quiet colours, honest materials."
            actionHref="/shop?sort=new"
            actionLabel="See all new pieces"
          />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}