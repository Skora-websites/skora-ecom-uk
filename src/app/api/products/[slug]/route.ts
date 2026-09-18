import { NextResponse } from "next/server";
import { getProductCollection, isMongoConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

function validatePatch(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  if (typeof b.name === "string" && b.name.trim().length >= 2) patch.name = b.name.trim();
  if (typeof b.category === "string") patch.category = b.category;
  if (typeof b.price === "number" && b.price > 0) patch.price = b.price;
  if (b.compareAt === null) patch.compareAt = undefined;
  else if (typeof b.compareAt === "number" && b.compareAt > 0) patch.compareAt = b.compareAt;
  if (typeof b.rating === "number" && b.rating >= 0 && b.rating <= 5) patch.rating = b.rating;
  if (typeof b.reviews === "number" && b.reviews >= 0) patch.reviews = b.reviews;
  if (typeof b.image === "string" && b.image) patch.image = b.image;
  if (typeof b.material === "string" && b.material) patch.material = b.material;
  if (Array.isArray(b.finishOptions) && b.finishOptions.every((f) => typeof f === "string"))
    patch.finishOptions = b.finishOptions;
  if (b.tag === null) patch.tag = undefined;
  else if (b.tag === "new" || b.tag === "bestseller") patch.tag = b.tag;
  if (typeof b.description === "string") patch.description = b.description;
  if (Array.isArray(b.details) && b.details.every((d) => typeof d === "string"))
    patch.details = b.details;
  if (b.status === "active" || b.status === "draft") patch.status = b.status;
  return Object.keys(patch).length > 0 ? patch : null;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 501 });
  }
  const { slug } = await context.params;
  try {
    const body = await request.json();
    const patch = validatePatch(body);
    if (!patch) {
      return NextResponse.json({ error: "Nothing valid to update" }, { status: 400 });
    }
    const collection = await getProductCollection();
    const result = await collection.findOneAndUpdate(
      { slug },
      { $set: patch },
      { returnDocument: "after" }
    );
    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const { _id: _ignored, ...product } = result;
    return NextResponse.json({ product });
  } catch (error) {
    console.error(`PUT /api/products/${slug} failed:`, error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 501 });
  }
  const { slug } = await context.params;
  try {
    const body = (await request.json().catch(() => ({}))) as { status?: unknown };
    if (body.status !== "active" && body.status !== "draft") {
      return NextResponse.json(
        { error: 'status must be "active" or "draft"' },
        { status: 400 }
      );
    }
    const collection = await getProductCollection();
    const result = await collection.findOneAndUpdate(
      { slug },
      { $set: { status: body.status } },
      { returnDocument: "after" }
    );
    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const { _id: _ignored, ...product } = result;
    return NextResponse.json({ product });
  } catch (error) {
    console.error(`PATCH /api/products/${slug} failed:`, error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MongoDB is not configured" }, { status: 501 });
  }
  const { slug } = await context.params;
  try {
    const collection = await getProductCollection();
    const result = await collection.deleteOne({ slug });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/products/${slug} failed:`, error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
