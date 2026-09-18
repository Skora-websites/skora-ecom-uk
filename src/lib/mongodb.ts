import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB connection helper.
 *
 * Configure via environment variables:
 * - MONGODB_URI  — connection string (e.g. from MongoDB Atlas → Connect → Drivers)
 * - MONGODB_DB   — optional database name (defaults to "haven")
 *
 * When MONGODB_URI is not set, the app runs in local mode: the admin
 * dashboard falls back to browser localStorage persistence.
 */

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "haven";

export function isMongoConfigured(): boolean {
  return Boolean(uri);
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI is not configured");
  // Reuse the client across hot reloads in development.
  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mongoClientPromise = client.connect();
  }
  return global.__mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export async function getProductCollection() {
  const db = await getDb();
  return db.collection<StoreProductDoc>("products");
}

/** Shape of a product document as stored in MongoDB. */
export interface StoreProductDoc {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  material: string;
  finishOptions: string[];
  tag?: string;
  description: string;
  details: string[];
  status: "active" | "draft";
}
