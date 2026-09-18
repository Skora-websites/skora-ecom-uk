import { NextResponse } from "next/server";
import {
  getProductCollection,
  isMongoConfigured,
  type StoreProductDoc,
} from "@/lib/mongodb";
import { products as seedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

/** Seed the collection from the demo catalogue the first time it's used. */
async function ensureSeeded(): Promise<void> {
  const collection = await getProductCollection();
  const count = await collection.countDocuments();
  if (count > 0) return;
  const seed: StoreProductDoc[] = seedProducts.map((p) => ({
    ...p,
    status: "active",
  }));
  await collection.insertMany(seed);
}

/** Basic runtime validation for product payloads coming over the wire. */
function validateProductInput(body: unknown): StoreProductDoc | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const requiredString = (v: unknown, min: number) =>
    typeof v === "string" && v.trim().length >= min;
  if (!requiredString(b.name, 2)) return null;
  if (typeof b.price !== "number" || !(b.price > 0)) return null;
  if (typeof b.rating !== "number" || b.rating < 0 || b.rating > 5) return null;
  if (typeof b.reviews !== "number" || b.reviews < 0) return null;
  if (!requiredString(b.category, 2)) return null;
  if (!requiredString(b.material, 1)) return null;
  if (!Array.isArray(b.finishOptions) || !b.finishOptions.every((f) => typeof f === "string"))
    return null;
  if (!Array.isArray(b.details) || !b.details.every((d) => typeof d === "string"))
    return null;
  if (b.status !== "active" && b.status !== "draft") return null;

  const doc: StoreProductDoc = {
    slug: typeof b.slug === "string" ? b.slug : "",
    name: b.name as string,
    category: b.category as string,
    price: b.price as number,
    rating: b.rating as number,
    reviews: b.reviews as number,
    image: typeof b.image === "string" && b.image ? b.image : "",
    material: b.material as string,
    finishOptions: b.finishOptions as string[],
    description: typeof b.description === "string" ? b.description : "",
    details: b.details as string[],
    status: b.status,
  };
  if (typeof b.compareAt === "number" && b.compareAt > 0) doc.compareAt = b.compareAt;
  if (b.tag === "new" || b.tag === "bestseller") doc.tag = b.tag;
  return doc;
}

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 501 });
  }
  try {
    await ensureSeeded();
    const collection = await getProductCollection();
    const docs = await collection.find().sort({ name: 1 }).toArray();
    // Strip MongoDB's internal _id so documents match the StoreProduct shape.
    const products = docs.map(({ _id: _ignored, ...rest }) => rest);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 501 });
  }
  try {
    const body = await request.json();
    const doc = validateProductInput(body);
    if (!doc || !doc.slug) {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }
    const collection = await getProductCollection();
    const existing = await collection.findOne({ slug: doc.slug });
    if (existing) {
      return NextResponse.json(
        { error: `A product with slug "${doc.slug}" already exists` },
        { status: 409 }
      );
    }
    await collection.insertOne(doc);
    return NextResponse.json({ product: doc }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products failed:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
