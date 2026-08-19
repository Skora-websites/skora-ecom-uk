import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import {
  formatPrice,
  getCategory,
  getProduct,
  getRelated,
  products,
} from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  const category = getCategory(product.category);
  return {
    title: `${product.name} – ${formatPrice(product.price)}`,
    description: `${product.description} Free UK delivery over £300 and a 10-year guarantee from Haven.`,
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Haven`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelated(product);
  const category = getCategory(product.category);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    brand: { "@type": "Brand", name: "Haven" },
    category: category?.name,
    material: product.material,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      url: `https://haven-home.example.com/shop/${product.slug}`,
      priceCurrency: "GBP",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}