import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/products";

export function HomeCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Shop by room"
          title="Find your corner of calm"
          description="Every room has a moment. Start with the piece that makes yours feel like home."
          actionHref="/shop"
          actionLabel="Shop everything"
        />
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {categories.map((category, i) => (
            <li
              key={category.slug}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <ProductImage
                  src={category.image}
                  alt={`${category.name} furniture from Haven`}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <span className="text-primary-foreground">
                    <span className="block font-display text-xl leading-tight sm:text-2xl">
                      {category.name}
                    </span>
                    <span className="block text-xs text-primary-foreground/80 sm:text-sm">
                      {category.tagline}
                    </span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-background/90 text-foreground transition-transform duration-300 group-hover:rotate-45">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}